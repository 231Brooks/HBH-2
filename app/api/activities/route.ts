import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

// Create SQL client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const entityId = searchParams.get("entityId")
    const entityType = searchParams.get("entityType")
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    // Build WHERE clause based on filters
    let whereClause = ""
    const params: any[] = []
    let paramIndex = 1

    if (userId) {
      whereClause += `user_id = $${paramIndex} `
      params.push(userId)
      paramIndex++
    }

    if (entityId && entityType) {
      if (whereClause) whereClause += "AND "
      whereClause += `entity_id = $${paramIndex} AND entity_type = $${paramIndex + 1} `
      params.push(entityId, entityType)
      paramIndex += 2
    }

    // If no specific filters, show activities relevant to the user
    if (!whereClause) {
      whereClause = `
        user_id = $${paramIndex} OR 
        entity_id IN (
          SELECT id FROM properties WHERE user_id = $${paramIndex}
          UNION
          SELECT id FROM transactions WHERE creator_id = $${paramIndex}
        )
      `
      params.push(session.user.id)
    }

    if (whereClause) {
      whereClause = `WHERE ${whereClause}`
    }

    // Add limit parameter
    params.push(limit)

    const query = `
      SELECT a.*, 
             u.name as user_name, 
             u.image as user_image
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      ${whereClause}
      ORDER BY a.timestamp DESC
      LIMIT $${params.length}
    `

    const activities = await sql(query, params)

    // Format the activities for the client
    const formattedActivities = activities.map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      user: {
        id: activity.user_id,
        name: activity.user_name,
        image: activity.user_image,
      },
      entityId: activity.entity_id,
      entityType: activity.entity_type,
      timestamp: activity.timestamp,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : {},
    }))

    return NextResponse.json({ activities: formattedActivities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, description, entityId, entityType, metadata } = body

    if (!type || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the activity
    const result = await sql`
      INSERT INTO activities (
        type, title, description, user_id, entity_id, entity_type, timestamp, metadata
      ) VALUES (
        ${type}, ${title}, ${description}, ${session.user.id}, ${entityId}, ${entityType}, NOW(), ${JSON.stringify(metadata || {})}
      ) RETURNING id, timestamp
    `

    const activity = {
      id: result[0].id,
      type,
      title,
      description,
      user: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      entityId,
      entityType,
      timestamp: result[0].timestamp,
      metadata: metadata || {},
    }

    // Trigger Pusher event
    const { pusherServer } = await import("@/lib/pusher-server")

    // Determine which channel to publish to
    let channelName = "global-activities"
    if (entityId && entityType) {
      channelName = `${entityType}-${entityId}-activities`
    }

    // Also publish to user-specific channel
    const userChannel = `user-${session.user.id}-activities`

    await pusherServer.trigger(channelName, "new-activity", activity)
    if (channelName !== userChannel) {
      await pusherServer.trigger(userChannel, "new-activity", activity)
    }

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
