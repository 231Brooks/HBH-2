import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, status: true },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Get bid history for the property
    const bids = await prisma.bid.findMany({
      where: { propertyId },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      bids,
    })
  } catch (error) {
    console.error("Error fetching bid history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
