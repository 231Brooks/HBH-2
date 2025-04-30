import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher-server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId, userId, userName, isTyping } = await request.json()

    if (!chatId || !userId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Trigger typing event on the chat channel
    await pusherServer.trigger(`chat-${chatId}`, "typing", {
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
