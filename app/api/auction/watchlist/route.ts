import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Verify property exists and is an auction
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, status: true, title: true }
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.status !== "AUCTION") {
      return NextResponse.json({ error: "Property is not an auction" }, { status: 400 })
    }

    // Check if already watching
    const existingWatch = await prisma.auctionWatchList.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId
        }
      }
    })

    if (existingWatch) {
      return NextResponse.json({ error: "Already watching this auction" }, { status: 400 })
    }

    // Add to watch list
    const watchItem = await prisma.auctionWatchList.create({
      data: {
        userId: user.id,
        propertyId
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            auctionEndDate: true,
            currentBid: true,
            minimumBid: true
          }
        }
      }
    })

    // Update analytics watch count
    await prisma.auctionAnalytics.upsert({
      where: { propertyId },
      update: {
        watchListCount: { increment: 1 }
      },
      create: {
        propertyId,
        watchListCount: 1
      }
    })

    return NextResponse.json({
      success: true,
      watchItem
    })
  } catch (error) {
    console.error("Error adding to watch list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    // Remove from watch list
    const deleted = await prisma.auctionWatchList.deleteMany({
      where: {
        userId: user.id,
        propertyId
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not watching this auction" }, { status: 404 })
    }

    // Update analytics watch count
    await prisma.auctionAnalytics.upsert({
      where: { propertyId },
      update: {
        watchListCount: { decrement: 1 }
      },
      create: {
        propertyId,
        watchListCount: 0
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error removing from watch list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (propertyId) {
      // Check if user is watching a specific property
      const watchItem = await prisma.auctionWatchList.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId
          }
        }
      })

      return NextResponse.json({
        success: true,
        isWatching: !!watchItem
      })
    } else {
      // Get all watched auctions for the user
      const watchList = await prisma.auctionWatchList.findMany({
        where: { userId: user.id },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              city: true,
              state: true,
              auctionEndDate: true,
              currentBid: true,
              minimumBid: true,
              reservePrice: true,
              images: {
                where: { isPrimary: true },
                select: { url: true }
              },
              bids: {
                where: { status: "ACTIVE" },
                select: { amount: true },
                orderBy: { amount: "desc" },
                take: 1
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })

      return NextResponse.json({
        success: true,
        watchList
      })
    }
  } catch (error) {
    console.error("Error fetching watch list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
