import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(process.env.SUPABASE_SUPABASE_URL!, process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!)

    // Create the test table if it doesn't exist
    const { error } = await supabase.rpc("create_test_table_if_not_exists", {
      table_name: "integration_test",
    })

    if (error) {
      console.error("Error creating test table:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
