import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher-server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, type } = body

    if (!message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create notification object
    const notification = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    }

    // Trigger event on Pusher
    await pusherServer.trigger("user-notifications", "new-notification", notification)

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
