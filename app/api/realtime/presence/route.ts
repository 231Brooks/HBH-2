import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, channelId } = await request.json()

    if (!status || !["online", "offline"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update user presence in database
    await supabase
      .from("user_presence")
      .upsert({
        user_id: session.user.id,
        status,
        channel_id: channelId || null,
        last_seen_at: new Date().toISOString(),
      })
      .select()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Presence error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
