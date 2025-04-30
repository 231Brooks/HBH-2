"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@neondatabase/serverless"
import { auth } from "@/lib/auth"

// Get all auction items
export async function getAuctionItems() {
  try {
    const items = await sql`
      SELECT m.*, u.name as owner_name, u.image as owner_image,
        (SELECT MAX(b.amount) FROM "Bid" b WHERE b.item_id = m.id AND b.status = 'ACTIVE') as current_bid,
        (SELECT COUNT(*) FROM "Bid" b WHERE b.item_id = m.id) as bid_count
      FROM "MarketplaceItem" m
      JOIN "User" u ON m."userId" = u.id
      WHERE m.is_auction = true
      ORDER BY m."createdAt" DESC
    `

    return {
      success: true,
      items: items.rows.map((item) => ({
        ...item,
        isAuction: item.is_auction,
        auctionEnd: item.auction_end,
        auctionReservePrice: item.auction_reserve_price,
        currentBid: item.current_bid || item.price,
        bidCount: Number.parseInt(item.bid_count || "0"),
      })),
    }
  } catch (error) {
    console.error("Failed to fetch auction items:", error)
    return { success: false, error: "Failed to fetch auction items" }
  }
}

// Get a single auction item by ID
export async function getAuctionItem(id: string) {
  try {
    const [item] = (
      await sql`
      SELECT m.*, u.name as owner_name, u.image as owner_image,
        (SELECT MAX(b.amount) FROM "Bid" b WHERE b.item_id = m.id AND b.status = 'ACTIVE') as current_bid,
        (SELECT COUNT(*) FROM "Bid" b WHERE b.item_id = m.id) as bid_count
      FROM "MarketplaceItem" m
      JOIN "User" u ON m."userId" = u.id
      WHERE m.id = ${id} AND m.is_auction = true
    `
    ).rows

    if (!item) {
      return { success: false, error: "Auction item not found" }
    }

    return {
      success: true,
      item: {
        ...item,
        isAuction: item.is_auction,
        auctionEnd: item.auction_end,
        auctionReservePrice: item.auction_reserve_price,
        currentBid: item.current_bid || item.price,
        bidCount: Number.parseInt(item.bid_count || "0"),
      },
    }
  } catch (error) {
    console.error("Failed to fetch auction item:", error)
    return { success: false, error: "Failed to fetch auction item" }
  }
}

// Get bids for an auction item
export async function getItemBids(itemId: string) {
  try {
    const bids = await sql`
      SELECT b.*, u.name as user_name, u.image as user_image
      FROM "Bid" b
      JOIN "User" u ON b.user_id = u.id
      WHERE b.item_id = ${itemId}
      ORDER BY b.amount DESC
    `

    return {
      success: true,
      bids: bids.rows.map((bid) => ({
        id: bid.id,
        amount: bid.amount,
        status: bid.status,
        createdAt: bid.created_at,
        user: {
          id: bid.user_id,
          name: bid.user_name,
          image: bid.user_image,
        },
      })),
    }
  } catch (error) {
    console.error("Failed to fetch bids:", error)
    return { success: false, error: "Failed to fetch bids" }
  }
}

// Place a bid on an auction item
export async function placeBid(itemId: string, amount: number) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to place a bid" }
  }

  try {
    // Check if item exists and is an auction
    const [item] = (
      await sql`
      SELECT * FROM "MarketplaceItem"
      WHERE id = ${itemId} AND is_auction = true
    `
    ).rows

    if (!item) {
      return { success: false, error: "Auction item not found" }
    }

    // Check if auction has ended
    if (item.auction_end && new Date(item.auction_end) < new Date()) {
      return { success: false, error: "Auction has ended" }
    }

    // Check if user is the owner
    if (item.userId === session.user.id) {
      return { success: false, error: "You cannot bid on your own item" }
    }

    // Get highest bid
    const [highestBid] = (
      await sql`
      SELECT * FROM "Bid"
      WHERE item_id = ${itemId} AND status = 'ACTIVE'
      ORDER BY amount DESC
      LIMIT 1
    `
    ).rows

    const minimumBid = highestBid ? Number.parseFloat(highestBid.amount) + 10 : item.price

    // Check if bid amount is high enough
    if (amount < minimumBid) {
      return { success: false, error: `Bid must be at least $${minimumBid.toFixed(2)}` }
    }

    // Place the bid
    const [newBid] = (
      await sql`
      INSERT INTO "Bid" (id, item_id, user_id, amount, status, created_at)
      VALUES (gen_random_uuid()::text, ${itemId}, ${session.user.id}, ${amount}, 'ACTIVE', NOW())
      RETURNING id
    `
    ).rows

    // Update previous bids to outbid status
    if (highestBid) {
      await sql`
        UPDATE "Bid"
        SET status = 'OUTBID'
        WHERE item_id = ${itemId}
        AND id != ${newBid.id}
        AND status = 'ACTIVE'
      `
    }

    revalidatePath(`/marketplace/auction/${itemId}`)
    return { success: true, bidId: newBid.id }
  } catch (error) {
    console.error("Failed to place bid:", error)
    return { success: false, error: "Failed to place bid" }
  }
}

// Create a new auction item
export async function createAuctionItem(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to create an auction" }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const image = formData.get("image") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const reservePrice = formData.get("reservePrice") ? Number.parseFloat(formData.get("reservePrice") as string) : null

    // Parse auction end date and time
    const endDate = formData.get("endDate") as string
    const endTime = formData.get("endTime") as string
    const auctionEnd = new Date(`${endDate}T${endTime}`)

    if (isNaN(auctionEnd.getTime())) {
      return { success: false, error: "Invalid auction end date or time" }
    }

    // Validate required fields
    if (!title || !description || !category || !price) {
      return { success: false, error: "Missing required fields" }
    }

    // Create the auction item
    const [newItem] = (
      await sql`
      INSERT INTO "MarketplaceItem" (
        id, title, description, category, image, price, 
        "userId", status, is_auction, auction_end, auction_reserve_price,
        "createdAt", "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text, ${title}, ${description}, ${category}, ${image}, ${price},
        ${session.user.id}, 'AVAILABLE', true, ${auctionEnd.toISOString()}, ${reservePrice},
        NOW(), NOW()
      )
      RETURNING id
    `
    ).rows

    revalidatePath("/marketplace/auctions")
    return { success: true, itemId: newItem.id }
  } catch (error) {
    console.error("Failed to create auction item:", error)
    return { success: false, error: "Failed to create auction item" }
  }
}
