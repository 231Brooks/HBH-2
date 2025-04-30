import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher-server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId, content } = await request.json()

    if (!chatId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save message to database
    const message = await db.query(
      `
      INSERT INTO messages (chat_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, content, created_at as timestamp
      `,
      [chatId, session.user.id, content],
    )

    if (!message || !message.rows || message.rows.length === 0) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    const newMessage = {
      id: message.rows[0].id,
      content: message.rows[0].content,
      sender: {
        id: session.user.id,
        name: session.user.name || "Unknown User",
        image: session.user.image,
      },
      timestamp: message.rows[0].timestamp,
    }

    // Trigger new message event on the chat channel
    await pusherServer.trigger(`chat-${chatId}`, "new-message", newMessage)

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
