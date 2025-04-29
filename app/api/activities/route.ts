import { NextResponse } from "next/server"

export async function GET() {
  // Return mock data instead of using Prisma
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

  return NextResponse.json({ activities: mockActivities })
}

export async function POST() {
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
}
