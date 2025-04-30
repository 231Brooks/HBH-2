import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Pusher is configured
    const isPusherConfigured = process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_CLUSTER

    if (!isPusherConfigured) {
      return NextResponse.json({
        configured: false,
        message: "Pusher is not configured. Real-time features will be disabled.",
      })
    }

    // Only return what the client needs, not the secret
    return NextResponse.json({
      configured: true,
      key: process.env.PUSHER_KEY,
      cluster: process.env.PUSHER_CLUSTER,
    })
  } catch (error) {
    console.error("Error fetching Pusher config:", error)
    return NextResponse.json({ error: "Failed to fetch Pusher config" }, { status: 500 })
  }
}
