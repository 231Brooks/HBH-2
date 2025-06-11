import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Initialize Supabase admin client
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase admin credentials not found" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Read SQL file
    const sqlFilePath = path.join(process.cwd(), "scripts", "create-test-messages-table.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute SQL
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: "Failed to set up test tables" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test tables set up successfully",
    })
  } catch (error) {
    console.error("Error setting up test tables:", error)
    return NextResponse.json({ error: "Failed to set up test tables" }, { status: 500 })
  }
}
