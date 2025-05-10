import { type NextRequest, NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher-server"
import { getSession } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    // Check if Pusher server is initialized
    if (!pusherServer) {
      logger.error("Pusher server not initialized")
      return NextResponse.json({ error: "Pusher service unavailable" }, { status: 503 })
    }

    const session = await getSession()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const socketId = formData.get("socket_id") as string
    const channel = formData.get("channel_name") as string

    if (!socketId || !channel) {
      logger.error("Missing required Pusher auth parameters")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Check if this is a private channel for the current user
    const userChannel = `private-user-${session.user.id}-notifications`

    if (channel === userChannel) {
      const authResponse = pusherServer.authorizeChannel(socketId, channel)
      return NextResponse.json(authResponse)
    }

    return NextResponse.json({ error: "Unauthorized channel" }, { status: 403 })
  } catch (error) {
    logger.error("Pusher auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
