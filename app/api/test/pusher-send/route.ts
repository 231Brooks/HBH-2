import { NextResponse } from "next/server"
import Pusher from "pusher"

export async function POST(request: Request) {
  try {
    const { channel, event, data } = await request.json()

    // Validate inputs
    if (!channel || !event || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Pusher
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })

    // Trigger event
    await pusher.trigger(channel, event, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending Pusher message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
