import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update all notifications as read
    const { error } = await supabase
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", session.user.id)
      .eq("read", false)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Mark all notifications read error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
