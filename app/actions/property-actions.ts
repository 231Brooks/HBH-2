"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { Property } from "@/types"

// Get all properties with optional filters
export async function getProperties(filters: any = {}) {
  try {
    // In a real app, you would build a dynamic query based on filters
    const properties = await sql`
      SELECT p.*, u.name as owner_name, u.email as owner_email
      FROM "Property" p
      JOIN "User" u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `

    return {
      success: true,
      properties: properties.map(mapPropertyFromDb),
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return { success: false, error: "Failed to fetch properties" }
  }
}

// Get a single property by ID
export async function getPropertyById(id: string) {
  try {
    const [property] = await sql`
      SELECT p.*, u.name as owner_name, u.email as owner_email
      FROM "Property" p
      JOIN "User" u ON p.owner_id = u.id
      WHERE p.id = ${id}
    `

    if (!property) {
      return { success: false, error: "Property not found" }
    }

    // Get property images
    const images = await sql`
      SELECT * FROM "PropertyImage"
      WHERE property_id = ${id}
      ORDER BY is_primary DESC
    `

    return {
      success: true,
      property: {
        ...mapPropertyFromDb(property),
        images: images.map((img: any) => ({
          id: img.id,
          url: img.url,
          isPrimary: img.is_primary,
        })),
      },
    }
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return { success: false, error: "Failed to fetch property" }
  }
}

// Toggle save property
export async function toggleSaveProperty(propertyId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if property is already saved
    const [existingSave] = await sql`
      SELECT * FROM "SavedProperty"
      WHERE user_id = ${session.user.id}
      AND property_id = ${propertyId}
    `

    if (existingSave) {
      // Unsave the property
      await sql`
        DELETE FROM "SavedProperty"
        WHERE user_id = ${session.user.id}
        AND property_id = ${propertyId}
      `
      return { success: true, saved: false }
    } else {
      // Save the property
      await sql`
        INSERT INTO "SavedProperty" (id, user_id, property_id, created_at)
        VALUES (gen_random_uuid(), ${session.user.id}, ${propertyId}, NOW())
      `
      return { success: true, saved: true }
    }
  } catch (error) {
    console.error("Failed to toggle save property:", error)
    return { success: false, error: "Failed to save property" }
  }
}

// Get bids for a property
export async function getPropertyBids(propertyId: string) {
  try {
    const bids = await sql`
      SELECT b.*, u.name as user_name, u.email as user_email
      FROM "Bid" b
      JOIN "User" u ON b.user_id = u.id
      WHERE b.property_id = ${propertyId}
      ORDER BY b.amount DESC
    `

    return {
      success: true,
      bids: bids.map((bid: any) => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.created_at,
        status: bid.status,
        user: {
          id: bid.user_id,
          name: bid.user_name,
          email: bid.user_email,
        },
      })),
    }
  } catch (error) {
    console.error("Failed to fetch bids:", error)
    return { success: false, error: "Failed to fetch bids" }
  }
}

// Place a bid on a property
export async function placeBid(propertyId: string, amount: number) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if property exists and is in auction status
    const [property] = await sql`
      SELECT * FROM "Property"
      WHERE id = ${propertyId}
      AND status = 'AUCTION'
    `

    if (!property) {
      return { success: false, error: "Property not found or not available for auction" }
    }

    // Check if auction has ended
    if (property.auction_end && new Date(property.auction_end) < new Date()) {
      return { success: false, error: "Auction has ended" }
    }

    // Check if user is the owner
    if (property.owner_id === session.user.id) {
      return { success: false, error: "You cannot bid on your own property" }
    }

    // Get highest bid
    const [highestBid] = await sql`
      SELECT * FROM "Bid"
      WHERE property_id = ${propertyId}
      ORDER BY amount DESC
      LIMIT 1
    `

    const minimumBid = highestBid ? highestBid.amount + 1000 : property.price

    // Check if bid amount is high enough
    if (amount < minimumBid) {
      return { success: false, error: `Bid must be at least ${minimumBid}` }
    }

    // Place the bid
    const [newBid] = await sql`
      INSERT INTO "Bid" (id, property_id, user_id, amount, created_at, status)
      VALUES (gen_random_uuid(), ${propertyId}, ${session.user.id}, ${amount}, NOW(), 'ACTIVE')
      RETURNING id
    `

    // Update previous bids to outbid status
    if (highestBid) {
      await sql`
        UPDATE "Bid"
        SET status = 'OUTBID'
        WHERE property_id = ${propertyId}
        AND id != ${newBid.id}
        AND status = 'ACTIVE'
      `
    }

    revalidatePath(`/marketplace/property/${propertyId}`)

    return { success: true, bidId: newBid.id }
  } catch (error) {
    console.error("Failed to place bid:", error)
    return { success: false, error: "Failed to place bid" }
  }
}

// Helper function to map database property to frontend property
function mapPropertyFromDb(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    address: dbProperty.address,
    city: dbProperty.city,
    state: dbProperty.state,
    zipCode: dbProperty.zip_code,
    price: dbProperty.price,
    beds: dbProperty.beds,
    baths: dbProperty.baths,
    sqft: dbProperty.sqft,
    type: dbProperty.type,
    status: dbProperty.status,
    features: dbProperty.features,
    latitude: dbProperty.latitude,
    longitude: dbProperty.longitude,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
    auctionEnd: dbProperty.auction_end,
    auctionReservePrice: dbProperty.auction_reserve_price,
    ownerId: dbProperty.owner_id,
    owner: {
      id: dbProperty.owner_id,
      name: dbProperty.owner_name,
      email: dbProperty.owner_email,
    },
    images: [], // Images are loaded separately
  }
}
