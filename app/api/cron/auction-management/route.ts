import { NextRequest, NextResponse } from "next/server"
import { processEndedAuctions } from "@/lib/auction-management"
import { sendAuctionNotificationEmail } from "@/lib/auction-notifications"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting auction management cron job...")

    // Process ended auctions
    const endedAuctionResults = await processEndedAuctions()
    
    // Send ending soon notifications (auctions ending in 1 hour)
    const endingSoonResults = await sendEndingSoonNotifications()
    
    // Send ending today notifications (auctions ending in 24 hours)
    const endingTodayResults = await sendEndingTodayNotifications()

    console.log("Auction management cron job completed", {
      endedAuctions: endedAuctionResults.length,
      endingSoonNotifications: endingSoonResults,
      endingTodayNotifications: endingTodayResults
    })

    return NextResponse.json({
      success: true,
      results: {
        endedAuctions: endedAuctionResults.length,
        endingSoonNotifications: endingSoonResults,
        endingTodayNotifications: endingTodayResults
      }
    })
  } catch (error) {
    console.error("Auction management cron job failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendEndingSoonNotifications(): Promise<number> {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
  const fiftyMinutesFromNow = new Date(Date.now() + 50 * 60 * 1000)

  // Find auctions ending in the next 10 minutes (50-60 minutes from now)
  const endingSoonAuctions = await prisma.property.findMany({
    where: {
      status: "AUCTION",
      auctionEndDate: {
        gte: fiftyMinutesFromNow,
        lte: oneHourFromNow
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
      watchedBy: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  })

  let notificationCount = 0

  for (const auction of endingSoonAuctions) {
    const timeRemaining = formatTimeRemaining(new Date(auction.auctionEndDate!))
    
    // Notify all bidders
    const uniqueBidders = new Map()
    auction.bids.forEach(bid => {
      if (!uniqueBidders.has(bid.bidderId)) {
        uniqueBidders.set(bid.bidderId, {
          email: bid.bidder.email,
          name: bid.bidder.name,
          highestBid: bid.amount
        })
      }
    })

    for (const [bidderId, bidder] of uniqueBidders) {
      try {
        await sendAuctionNotificationEmail({
          type: "auction_ending_soon",
          to: bidder.email,
          data: {
            propertyTitle: auction.title,
            propertyId: auction.id,
            timeRemaining,
            yourBid: bidder.highestBid
          }
        })
        notificationCount++
      } catch (error) {
        console.error(`Failed to send ending soon notification to bidder ${bidderId}:`, error)
      }
    }

    // Notify watchers who haven't bid
    for (const watcher of auction.watchedBy) {
      if (!uniqueBidders.has(watcher.userId)) {
        try {
          await sendAuctionNotificationEmail({
            type: "auction_ending_soon",
            to: watcher.user.email,
            data: {
              propertyTitle: auction.title,
              propertyId: auction.id,
              timeRemaining
            }
          })
          notificationCount++
        } catch (error) {
          console.error(`Failed to send ending soon notification to watcher ${watcher.userId}:`, error)
        }
      }
    }
  }

  return notificationCount
}

async function sendEndingTodayNotifications(): Promise<number> {
  const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const twentyThreeHoursFromNow = new Date(Date.now() + 23 * 60 * 60 * 1000)

  // Find auctions ending in the next hour (23-24 hours from now)
  const endingTodayAuctions = await prisma.property.findMany({
    where: {
      status: "AUCTION",
      auctionEndDate: {
        gte: twentyThreeHoursFromNow,
        lte: twentyFourHoursFromNow
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
      watchedBy: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  })

  let notificationCount = 0

  for (const auction of endingTodayAuctions) {
    const timeRemaining = formatTimeRemaining(new Date(auction.auctionEndDate!))
    
    // Notify all bidders
    const uniqueBidders = new Map()
    auction.bids.forEach(bid => {
      if (!uniqueBidders.has(bid.bidderId)) {
        uniqueBidders.set(bid.bidderId, {
          email: bid.bidder.email,
          name: bid.bidder.name,
          highestBid: bid.amount
        })
      }
    })

    for (const [bidderId, bidder] of uniqueBidders) {
      try {
        await sendAuctionNotificationEmail({
          type: "auction_ending_soon",
          to: bidder.email,
          data: {
            propertyTitle: auction.title,
            propertyId: auction.id,
            timeRemaining,
            yourBid: bidder.highestBid
          }
        })
        notificationCount++
      } catch (error) {
        console.error(`Failed to send ending today notification to bidder ${bidderId}:`, error)
      }
    }

    // Notify watchers who haven't bid
    for (const watcher of auction.watchedBy) {
      if (!uniqueBidders.has(watcher.userId)) {
        try {
          await sendAuctionNotificationEmail({
            type: "auction_ending_soon",
            to: watcher.user.email,
            data: {
              propertyTitle: auction.title,
              propertyId: auction.id,
              timeRemaining
            }
          })
          notificationCount++
        } catch (error) {
          console.error(`Failed to send ending today notification to watcher ${watcher.userId}:`, error)
        }
      }
    }
  }

  return notificationCount
}

function formatTimeRemaining(endDate: Date): string {
  const now = new Date()
  const timeLeft = endDate.getTime() - now.getTime()
  
  if (timeLeft <= 0) return "Auction has ended"
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}
