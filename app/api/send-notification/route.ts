import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, message, type = "info" } = await request.json()

    if (!userId || !message) {
      return NextResponse.json({ success: false, error: "userId and message are required" }, { status: 400 })
    }

    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Insert the notification
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        message,
        type,
      })
      .select()

    if (error) {
      console.error("Error sending notification:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, notification: data[0] })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
