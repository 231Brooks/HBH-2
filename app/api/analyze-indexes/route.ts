import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    // Verify API key
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get index usage statistics
    const { data: indexStats, error: indexError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          schemaname,
          relname AS table_name,
          indexrelname AS index_name,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch,
          pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
        FROM
          pg_stat_user_indexes
        ORDER BY
          idx_scan DESC;
      `,
    })

    if (indexError) throw indexError

    // Get table statistics
    const { data: tableStats, error: tableError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          relname AS table_name,
          n_live_tup AS row_count,
          n_tup_ins AS inserts,
          n_tup_upd AS updates,
          n_tup_del AS deletes,
          n_tup_hot_upd AS hot_updates,
          pg_size_pretty(pg_relation_size(relid)) AS table_size
        FROM
          pg_stat_user_tables
        ORDER BY
          n_live_tup DESC;
      `,
    })

    if (tableError) throw tableError

    // Get slow queries
    const { data: slowQueries, error: queryError } = await supabase
      .from("query_performance_logs")
      .select("*")
      .gt("duration_ms", 500)
      .order("duration_ms", { ascending: false })
      .limit(20)

    if (queryError) throw queryError

    // Analyze and make recommendations
    const recommendations = analyzeIndexes(indexStats, tableStats, slowQueries)

    return NextResponse.json({
      indexStats,
      tableStats,
      slowQueries,
      recommendations,
    })
  } catch (error: any) {
    console.error("Error analyzing indexes:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function analyzeIndexes(indexStats: any[], tableStats: any[], slowQueries: any[]) {
  const recommendations = []

  // Find unused indexes
  const unusedIndexes = indexStats.filter((index) => index.idx_scan === 0)
  if (unusedIndexes.length > 0) {
    recommendations.push({
      type: "remove_unused",
      priority: "medium",
      description: `Consider removing ${unusedIndexes.length} unused indexes to reduce overhead`,
      indexes: unusedIndexes.map((idx) => idx.index_name),
    })
  }

  // Find tables with high write activity but few indexes
  const highWriteTables = tableStats.filter((table) => {
    const writeOps = table.inserts + table.updates + table.deletes
    const tableIndexes = indexStats.filter((idx) => idx.table_name === table.table_name)
    return writeOps > 10000 && tableIndexes.length < 3
  })

  if (highWriteTables.length > 0) {
    recommendations.push({
      type: "optimize_writes",
      priority: "high",
      description: `${highWriteTables.length} tables have high write activity but few indexes`,
      tables: highWriteTables.map((t) => t.table_name),
    })
  }

  // Analyze slow queries for missing indexes
  const queryPatterns = slowQueries.reduce((acc: any, query: any) => {
    // Very simplified query pattern detection
    const pattern = query.query.includes("WHERE")
      ? query.query
          .split("WHERE")[1]
          .split(/AND|OR|ORDER|GROUP|LIMIT/)[0]
          .trim()
      : "unknown"

    if (!acc[pattern]) {
      acc[pattern] = { count: 0, avgDuration: 0 }
    }

    acc[pattern].count++
    acc[pattern].avgDuration =
      (acc[pattern].avgDuration * (acc[pattern].count - 1) + query.duration_ms) / acc[pattern].count

    return acc
  }, {})

  const commonPatterns = Object.entries(queryPatterns)
    .filter(([_, stats]: [string, any]) => stats.count > 2 && stats.avgDuration > 500)
    .map(([pattern, stats]: [string, any]) => ({ pattern, ...stats }))

  if (commonPatterns.length > 0) {
    recommendations.push({
      type: "add_indexes",
      priority: "high",
      description: `${commonPatterns.length} common query patterns could benefit from additional indexes`,
      patterns: commonPatterns,
    })
  }

  return recommendations
}
