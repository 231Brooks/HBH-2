import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Verify user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { 
        id: true, 
        ownerId: true, 
        title: true,
        status: true,
        auctionEndDate: true,
        minimumBid: true,
        reservePrice: true,
        currentBid: true
      }
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get analytics data
    const analytics = await prisma.auctionAnalytics.findUnique({
      where: { propertyId },
      include: {
        property: {
          select: {
            title: true,
            status: true,
            auctionEndDate: true,
            minimumBid: true,
            reservePrice: true,
            currentBid: true
          }
        }
      }
    })

    // Get bid history for detailed analytics
    const bids = await prisma.bid.findMany({
      where: { propertyId },
      include: {
        bidder: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "asc" }
    })

    // Get extension history
    const extensions = await prisma.auctionExtension.findMany({
      where: { propertyId },
      orderBy: { createdAt: "asc" }
    })

    // Get watch list count
    const watchListCount = await prisma.auctionWatchList.count({
      where: { propertyId }
    })

    // Calculate additional metrics
    const bidsByHour = calculateBidsByHour(bids)
    const bidderActivity = calculateBidderActivity(bids)
    const timeToFirstBid = bids.length > 0 ? 
      new Date(bids[0].createdAt).getTime() - new Date(property.auctionEndDate || 0).getTime() : null

    // Calculate auction performance score
    const performanceScore = calculatePerformanceScore({
      totalBids: analytics?.totalBids || 0,
      uniqueBidders: analytics?.uniqueBidders || 0,
      watchListCount,
      reservePriceMet: analytics?.reservePriceMet || false,
      extensionCount: analytics?.extensionCount || 0
    })

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        watchListCount,
        bidsByHour,
        bidderActivity,
        timeToFirstBid,
        performanceScore,
        extensions,
        property
      }
    })
  } catch (error) {
    console.error("Error fetching auction analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateBidsByHour(bids: any[]): { hour: number; count: number }[] {
  const hourCounts: { [key: number]: number } = {}
  
  bids.forEach(bid => {
    const hour = new Date(bid.createdAt).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourCounts[hour] || 0
  }))
}

function calculateBidderActivity(bids: any[]): { bidderId: string; bidderName: string; bidCount: number; totalAmount: number; averageBid: number }[] {
  const bidderStats: { [key: string]: { name: string; bidCount: number; totalAmount: number } } = {}

  bids.forEach(bid => {
    if (!bidderStats[bid.bidderId]) {
      bidderStats[bid.bidderId] = {
        name: bid.bidder.name || 'Anonymous',
        bidCount: 0,
        totalAmount: 0
      }
    }
    bidderStats[bid.bidderId].bidCount++
    bidderStats[bid.bidderId].totalAmount += bid.amount
  })

  return Object.entries(bidderStats).map(([bidderId, stats]) => ({
    bidderId,
    bidderName: stats.name,
    bidCount: stats.bidCount,
    totalAmount: stats.totalAmount,
    averageBid: stats.totalAmount / stats.bidCount
  })).sort((a, b) => b.bidCount - a.bidCount)
}

function calculatePerformanceScore(metrics: {
  totalBids: number
  uniqueBidders: number
  watchListCount: number
  reservePriceMet: boolean
  extensionCount: number
}): number {
  let score = 0

  // Bid activity (40% of score)
  score += Math.min(metrics.totalBids * 2, 40)

  // Bidder engagement (30% of score)
  score += Math.min(metrics.uniqueBidders * 3, 30)

  // Interest level (20% of score)
  score += Math.min(metrics.watchListCount * 2, 20)

  // Reserve price met (10% of score)
  if (metrics.reservePriceMet) {
    score += 10
  }

  // Bonus for extensions (indicates competitive bidding)
  score += Math.min(metrics.extensionCount * 2, 5)

  return Math.min(Math.round(score), 100)
}
