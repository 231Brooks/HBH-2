import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId, isTyping } = await request.json()

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Broadcast typing status to conversation channel
    await supabase
      .from("typing_indicators")
      .upsert({
        user_id: session.user.id,
        conversation_id: conversationId,
        is_typing: isTyping,
        updated_at: new Date().toISOString(),
      })
      .select()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Typing indicator error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
