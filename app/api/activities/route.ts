import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Try to get real activities from the database
    try {
      const activities = await prisma.activity.findMany({
        take: 10,
        orderBy: {
          timestamp: "desc",
        },
        include: {
          user: true,
        },
      })

      return NextResponse.json({
        status: "success",
        activities,
      })
    } catch (dbError) {
      console.error("Database error, falling back to mock data:", dbError)

      // Fallback to mock data if database query fails
      const mockActivities = [
        {
          id: "1",
          type: "PROPERTY_LISTED",
          title: "New Property Listed",
          description: "A new property was added to the marketplace",
          user: {
            id: "user1",
            name: "John Doe",
            image: "/placeholder.jpg",
          },
          entityId: "prop1",
          entityType: "property",
          timestamp: new Date().toISOString(),
          metadata: {},
        },
        {
          id: "2",
          type: "TRANSACTION_CREATED",
          title: "New Transaction Started",
          description: "A new transaction was initiated",
          user: {
            id: "user2",
            name: "Jane Smith",
            image: "/placeholder.jpg",
          },
          entityId: "trans1",
          entityType: "transaction",
          timestamp: new Date().toISOString(),
          metadata: {},
        },
      ]

      return NextResponse.json({
        status: "success",
        activities: mockActivities,
        note: "Using mock data due to database connection issues",
      })
    }
  } catch (error) {
    console.error("Error in activities API route:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch activities",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Mock successful creation
    return NextResponse.json({
      success: true,
      activity: {
        id: "new-activity-" + Date.now(),
        type: "CUSTOM_ACTIVITY",
        title: "Activity Created",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
