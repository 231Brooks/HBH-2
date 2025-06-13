import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/api/setup-realtime-tables/setup.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error setting up realtime tables:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
