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
    const format = searchParams.get("format") || "csv" // csv or json

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
        status: true
      }
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get bid history
    const bids = await prisma.bid.findMany({
      where: { propertyId },
      include: {
        bidder: {
          select: { 
            id: true, 
            name: true, 
            email: true // Only include for property owner
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    if (format === "json") {
      return NextResponse.json({
        success: true,
        property: {
          id: property.id,
          title: property.title,
          status: property.status
        },
        bids: bids.map(bid => ({
          id: bid.id,
          amount: bid.amount,
          status: bid.status,
          isWinning: bid.isWinning,
          bidder: {
            id: bid.bidder.id,
            name: bid.bidder.name,
            email: bid.bidder.email
          },
          createdAt: bid.createdAt,
          updatedAt: bid.updatedAt
        })),
        exportedAt: new Date().toISOString(),
        totalBids: bids.length
      })
    } else {
      // Generate CSV
      const csvHeaders = [
        "Bid ID",
        "Amount",
        "Status", 
        "Is Winning",
        "Bidder Name",
        "Bidder Email",
        "Bid Date",
        "Bid Time"
      ]

      const csvRows = bids.map(bid => [
        bid.id,
        bid.amount.toString(),
        bid.status,
        bid.isWinning ? "Yes" : "No",
        bid.bidder.name || "Anonymous",
        bid.bidder.email || "",
        new Date(bid.createdAt).toLocaleDateString(),
        new Date(bid.createdAt).toLocaleTimeString()
      ])

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
      ].join("\n")

      const filename = `auction-bids-${property.title.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`
        }
      })
    }
  } catch (error) {
    console.error("Error exporting bid history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Export auction analytics data
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId, includeAnalytics = true } = await request.json()

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

    // Get comprehensive auction data
    const [bids, analytics, extensions, watchListCount] = await Promise.all([
      prisma.bid.findMany({
        where: { propertyId },
        include: {
          bidder: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      includeAnalytics ? prisma.auctionAnalytics.findUnique({
        where: { propertyId }
      }) : null,
      prisma.auctionExtension.findMany({
        where: { propertyId },
        orderBy: { createdAt: "asc" }
      }),
      prisma.auctionWatchList.count({
        where: { propertyId }
      })
    ])

    const exportData = {
      property: {
        id: property.id,
        title: property.title,
        status: property.status,
        auctionEndDate: property.auctionEndDate,
        minimumBid: property.minimumBid,
        reservePrice: property.reservePrice,
        currentBid: property.currentBid
      },
      summary: {
        totalBids: bids.length,
        uniqueBidders: new Set(bids.map(bid => bid.bidderId)).size,
        highestBid: bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : null,
        averageBid: bids.length > 0 ? bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length : null,
        watchListCount,
        extensionCount: extensions.length
      },
      bids: bids.map(bid => ({
        id: bid.id,
        amount: bid.amount,
        status: bid.status,
        isWinning: bid.isWinning,
        bidder: {
          id: bid.bidder.id,
          name: bid.bidder.name,
          email: bid.bidder.email
        },
        createdAt: bid.createdAt
      })),
      extensions: extensions.map(ext => ({
        id: ext.id,
        originalEndDate: ext.originalEndDate,
        newEndDate: ext.newEndDate,
        extensionMinutes: ext.extensionMinutes,
        createdAt: ext.createdAt
      })),
      analytics: analytics ? {
        totalBids: analytics.totalBids,
        uniqueBidders: analytics.uniqueBidders,
        highestBid: analytics.highestBid,
        averageBid: analytics.averageBid,
        viewCount: analytics.viewCount,
        watchListCount: analytics.watchListCount,
        reservePriceMet: analytics.reservePriceMet,
        extensionCount: analytics.extensionCount,
        finalSalePrice: analytics.finalSalePrice
      } : null,
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    return NextResponse.json({
      success: true,
      data: exportData
    })
  } catch (error) {
    console.error("Error exporting auction data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
