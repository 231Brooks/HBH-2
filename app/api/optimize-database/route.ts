import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    // Verify API key
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get optimization type from request
    const { type = "all" } = await request.json()

    const results: Record<string, any> = {}

    // Apply index optimizations
    if (type === "all" || type === "indexes") {
      const indexScript = fs.readFileSync(
        path.join(process.cwd(), "scripts/db-optimizations/fine-tune-indexes.sql"),
        "utf8",
      )

      const { error: indexError } = await supabase.rpc("exec_sql", {
        sql: indexScript,
      })

      results.indexes = {
        success: !indexError,
        error: indexError?.message,
      }
    }

    // Analyze and vacuum database
    if (type === "all" || type === "analyze") {
      const { error: analyzeError } = await supabase.rpc("exec_sql", {
        sql: "ANALYZE;",
      })

      results.analyze = {
        success: !analyzeError,
        error: analyzeError?.message,
      }
    }

    // Update table statistics
    if (type === "all" || type === "statistics") {
      const { error: statsError } = await supabase.rpc("exec_sql", {
        sql: `
          ALTER TABLE "Property" ALTER COLUMN status SET STATISTICS 1000;
          ALTER TABLE "Property" ALTER COLUMN type SET STATISTICS 1000;
          ALTER TABLE "Property" ALTER COLUMN price SET STATISTICS 1000;
          ALTER TABLE "Property" ALTER COLUMN city SET STATISTICS 1000;
          ALTER TABLE "Property" ALTER COLUMN state SET STATISTICS 1000;
        `,
      })

      results.statistics = {
        success: !statsError,
        error: statsError?.message,
      }
    }

    // Set work_mem for complex queries
    if (type === "all" || type === "work_mem") {
      const { error: workMemError } = await supabase.rpc("exec_sql", {
        sql: `
          SET work_mem = '16MB';
        `,
      })

      results.work_mem = {
        success: !workMemError,
        error: workMemError?.message,
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error("Error optimizing database:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
