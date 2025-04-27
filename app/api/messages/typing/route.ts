import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher-server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { channelName, userId, userName, isTyping } = body

    if (!channelName || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Trigger event on Pusher
    await pusherServer.trigger(channelName, "typing-indicator", {
      userId,
      userName,
      isTyping,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending typing indicator:", error)
    return NextResponse.json({ error: "Failed to send typing indicator" }, { status: 500 })
  }
}
