import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { checkAuctionExtension, sendOutbidNotifications, updateAuctionAnalytics } from "@/lib/auction-management"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId, amount } = await request.json()

    if (!propertyId || !amount) {
      return NextResponse.json({ error: "Property ID and amount are required" }, { status: 400 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Bid amount must be a positive number" }, { status: 400 })
    }

    // Get property details with auction information
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        status: true,
        currentBid: true,
        minimumBid: true,
        bidIncrement: true,
        auctionEndDate: true,
        ownerId: true,
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if property is an auction
    if (property.status !== "AUCTION") {
      return NextResponse.json({ error: "Property is not an auction" }, { status: 400 })
    }

    // Check if auction has ended
    if (property.auctionEndDate && new Date() > property.auctionEndDate) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Check if user is trying to bid on their own property
    if (property.ownerId === user.id) {
      return NextResponse.json({ error: "You cannot bid on your own property" }, { status: 400 })
    }

    // Calculate minimum bid
    const currentBid = property.currentBid || 0
    const bidIncrement = property.bidIncrement || 1000
    const minimumBid = currentBid > 0 ? currentBid + bidIncrement : property.minimumBid || 5000

    if (amount < minimumBid) {
      return NextResponse.json(
        {
          error: "Bid amount is too low",
          minimumBid,
          currentBid: property.currentBid,
        },
        { status: 400 },
      )
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Mark all previous bids as outbid
      await tx.bid.updateMany({
        where: {
          propertyId,
          status: "ACTIVE",
        },
        data: {
          status: "OUTBID",
          isWinning: false,
        },
      })

      // Create the new bid
      const bid = await tx.bid.create({
        data: {
          amount,
          propertyId,
          bidderId: user.id,
          status: "ACTIVE",
          isWinning: true,
        },
        include: {
          bidder: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Update property current bid
      await tx.property.update({
        where: { id: propertyId },
        data: { currentBid: amount },
      })

      return bid
    })

    // Post-transaction operations (don't block the response)
    Promise.all([
      // Check if auction should be extended
      checkAuctionExtension(propertyId, result.id),
      // Send outbid notifications
      sendOutbidNotifications(propertyId, amount),
      // Update auction analytics
      updateAuctionAnalytics(propertyId)
    ]).catch(error => {
      console.error("Error in post-bid operations:", error)
    })

    return NextResponse.json({
      success: true,
      bid: result,
      newCurrentBid: amount,
    })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
