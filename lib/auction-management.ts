import prisma from "@/lib/prisma"
import { sendAuctionNotificationEmail } from "@/lib/auction-notifications"

export interface AuctionEndResult {
  propertyId: string
  winnerId?: string
  finalPrice?: number
  reserveMet: boolean
  totalBids: number
  uniqueBidders: number
}

/**
 * Check for auctions that have ended and process them
 */
export async function processEndedAuctions(): Promise<AuctionEndResult[]> {
  const now = new Date()
  
  // Find auctions that have ended but haven't been processed
  const endedAuctions = await prisma.property.findMany({
    where: {
      status: "AUCTION",
      auctionEndDate: {
        lte: now
      }
    },
    include: {
      bids: {
        where: { status: "ACTIVE" },
        include: {
          bidder: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { amount: "desc" }
      },
      owner: {
        select: { id: true, name: true, email: true }
      },
      analytics: true
    }
  })

  const results: AuctionEndResult[] = []

  for (const auction of endedAuctions) {
    try {
      const result = await processAuctionEnd(auction)
      results.push(result)
    } catch (error) {
      console.error(`Failed to process auction ${auction.id}:`, error)
    }
  }

  return results
}

/**
 * Process the end of a single auction
 */
async function processAuctionEnd(auction: any): Promise<AuctionEndResult> {
  const winningBid = auction.bids[0] // Highest bid
  const reserveMet = !auction.reservePrice || (winningBid?.amount >= auction.reservePrice)
  
  // Calculate analytics
  const totalBids = auction.bids.length
  const uniqueBidders = new Set(auction.bids.map((bid: any) => bid.bidderId)).size
  
  return await prisma.$transaction(async (tx) => {
    let winnerId: string | undefined
    let finalPrice: number | undefined

    if (winningBid && reserveMet) {
      // Auction has a winner
      winnerId = winningBid.bidderId
      finalPrice = winningBid.amount

      // Update winning bid status
      await tx.bid.update({
        where: { id: winningBid.id },
        data: { status: "WINNING" }
      })

      // Update property with winner
      await tx.property.update({
        where: { id: auction.id },
        data: {
          status: "SOLD",
          auctionWinnerId: winnerId,
          currentBid: finalPrice
        }
      })

      // Send winner notification
      await sendAuctionNotificationEmail({
        type: "auction_won",
        to: winningBid.bidder.email,
        data: {
          propertyTitle: auction.title,
          winningBid: finalPrice,
          propertyId: auction.id
        }
      })

      // Send seller notification
      await sendAuctionNotificationEmail({
        type: "auction_sold",
        to: auction.owner.email,
        data: {
          propertyTitle: auction.title,
          finalPrice: finalPrice,
          winnerName: winningBid.bidder.name,
          propertyId: auction.id
        }
      })
    } else {
      // No winner (no bids or reserve not met)
      await tx.property.update({
        where: { id: auction.id },
        data: { status: "FOR_SALE" } // Return to regular sale
      })

      // Send seller notification about no sale
      await sendAuctionNotificationEmail({
        type: "auction_no_sale",
        to: auction.owner.email,
        data: {
          propertyTitle: auction.title,
          highestBid: winningBid?.amount,
          reservePrice: auction.reservePrice,
          propertyId: auction.id
        }
      })
    }

    // Mark all other bids as expired
    await tx.bid.updateMany({
      where: {
        propertyId: auction.id,
        status: "ACTIVE",
        id: { not: winningBid?.id }
      },
      data: { status: "EXPIRED" }
    })

    // Update or create analytics
    await tx.auctionAnalytics.upsert({
      where: { propertyId: auction.id },
      update: {
        totalBids,
        uniqueBidders,
        highestBid: winningBid?.amount,
        averageBid: totalBids > 0 ? auction.bids.reduce((sum: number, bid: any) => sum + bid.amount, 0) / totalBids : null,
        reservePriceMet: reserveMet,
        finalSalePrice: finalPrice
      },
      create: {
        propertyId: auction.id,
        totalBids,
        uniqueBidders,
        highestBid: winningBid?.amount,
        averageBid: totalBids > 0 ? auction.bids.reduce((sum: number, bid: any) => sum + bid.amount, 0) / totalBids : null,
        reservePriceMet: reserveMet,
        finalSalePrice: finalPrice
      }
    })

    // Send notifications to all losing bidders
    const losingBidders = auction.bids.slice(1) // All except the winner
    for (const bid of losingBidders) {
      await sendAuctionNotificationEmail({
        type: "auction_lost",
        to: bid.bidder.email,
        data: {
          propertyTitle: auction.title,
          yourBid: bid.amount,
          winningBid: winningBid?.amount,
          propertyId: auction.id
        }
      })
    }

    return {
      propertyId: auction.id,
      winnerId,
      finalPrice,
      reserveMet,
      totalBids,
      uniqueBidders
    }
  })
}

/**
 * Check if a bid should trigger an auction extension
 */
export async function checkAuctionExtension(propertyId: string, bidId: string): Promise<boolean> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      auctionEndDate: true,
      status: true
    }
  })

  if (!property || property.status !== "AUCTION" || !property.auctionEndDate) {
    return false
  }

  const now = new Date()
  const endDate = new Date(property.auctionEndDate)
  const timeUntilEnd = endDate.getTime() - now.getTime()
  const minutesUntilEnd = timeUntilEnd / (1000 * 60)

  // Extend if bid is placed within 10 minutes of auction end
  if (minutesUntilEnd <= 10 && minutesUntilEnd > 0) {
    const extensionMinutes = 10
    const newEndDate = new Date(endDate.getTime() + (extensionMinutes * 60 * 1000))

    await prisma.$transaction(async (tx) => {
      // Update auction end date
      await tx.property.update({
        where: { id: propertyId },
        data: { auctionEndDate: newEndDate }
      })

      // Log the extension
      await tx.auctionExtension.create({
        data: {
          propertyId,
          originalEndDate: endDate,
          newEndDate,
          triggerBidId: bidId,
          extensionMinutes
        }
      })

      // Update analytics extension count
      await tx.auctionAnalytics.upsert({
        where: { propertyId },
        update: {
          extensionCount: { increment: 1 }
        },
        create: {
          propertyId,
          extensionCount: 1
        }
      })
    })

    return true
  }

  return false
}

/**
 * Send outbid notifications to previous bidders
 */
export async function sendOutbidNotifications(propertyId: string, newBidAmount: number): Promise<void> {
  // Get all outbid users for this property
  const outbidBids = await prisma.bid.findMany({
    where: {
      propertyId,
      status: "OUTBID"
    },
    include: {
      bidder: {
        select: { id: true, name: true, email: true }
      },
      property: {
        select: { title: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Send notifications to unique bidders (avoid duplicate emails)
  const notifiedUsers = new Set<string>()
  
  for (const bid of outbidBids) {
    if (!notifiedUsers.has(bid.bidderId)) {
      await sendAuctionNotificationEmail({
        type: "outbid",
        to: bid.bidder.email,
        data: {
          propertyTitle: bid.property.title,
          yourBid: bid.amount,
          newBid: newBidAmount,
          propertyId
        }
      })
      notifiedUsers.add(bid.bidderId)
    }
  }
}

/**
 * Update auction analytics when a new bid is placed
 */
export async function updateAuctionAnalytics(propertyId: string): Promise<void> {
  const bids = await prisma.bid.findMany({
    where: { propertyId },
    select: { amount: true, bidderId: true }
  })

  const totalBids = bids.length
  const uniqueBidders = new Set(bids.map(bid => bid.bidderId)).size
  const highestBid = Math.max(...bids.map(bid => bid.amount))
  const averageBid = totalBids > 0 ? bids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids : 0

  await prisma.auctionAnalytics.upsert({
    where: { propertyId },
    update: {
      totalBids,
      uniqueBidders,
      highestBid,
      averageBid
    },
    create: {
      propertyId,
      totalBids,
      uniqueBidders,
      highestBid,
      averageBid
    }
  })
}
