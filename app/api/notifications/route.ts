import { type NextRequest, NextResponse } from "next/server"
import { triggerPusherEvent } from "@/lib/pusher-server"
import { pusherChannels } from "@/lib/pusher-client"
import { logger } from "@/lib/logger"
import { ValidationError, handleApiError } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type = "default", userId } = body

    // Validate required fields
    if (!title || !title.trim()) {
      throw new ValidationError("Title is required")
    }

    if (!description || !description.trim()) {
      throw new ValidationError("Description is required")
    }

    // Validate notification type
    const validTypes = ["default", "success", "error", "warning", "info"]
    if (type && !validTypes.includes(type)) {
      throw new ValidationError(`Invalid notification type. Must be one of: ${validTypes.join(", ")}`)
    }

    const notification = {
      id: crypto.randomUUID(),
      title,
      description,
      type,
      timestamp: new Date().toISOString(),
    }

    // If userId is provided, send to a specific user's channel
    if (userId) {
      await triggerPusherEvent(pusherChannels.userNotifications(userId), "new-notification", notification)
      logger.info(`Sent notification to user ${userId}`, { notificationId: notification.id })
    } else {
      // Otherwise, broadcast to the public channel
      await triggerPusherEvent(pusherChannels.notifications, "new-notification", notification)
      logger.info("Sent broadcast notification", { notificationId: notification.id })
    }

    return NextResponse.json({ success: true, notificationId: notification.id })
  } catch (error) {
    const { statusCode, message, type } = handleApiError(error)
    return NextResponse.json({ error: message, type }, { status: statusCode })
  }
}
