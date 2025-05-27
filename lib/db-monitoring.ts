import { performance } from "perf_hooks"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for logging
const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Interface for query metrics
interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  success: boolean
  error?: string
}

// Function to log slow queries
export async function logSlowQuery(metrics: QueryMetrics) {
  try {
    // Only log queries that take more than 500ms
    if (metrics.duration > 500) {
      await supabase.from("query_performance_logs").insert([
        {
          query: metrics.query,
          duration_ms: metrics.duration,
          timestamp: metrics.timestamp.toISOString(),
          success: metrics.success,
          error: metrics.error || null,
        },
      ])
    }
  } catch (error) {
    console.error("Failed to log slow query:", error)
  }
}

// Higher-order function to wrap query functions with performance monitoring
export function withQueryPerformance<T extends (...args: any[]) => Promise<any>>(queryFn: T, queryName: string): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const start = performance.now()
    try {
      const result = await queryFn(...args)
      const duration = performance.now() - start

      // Log metrics asynchronously (don't await)
      logSlowQuery({
        query: queryName,
        duration,
        timestamp: new Date(),
        success: true,
      })

      return result
    } catch (error: any) {
      const duration = performance.now() - start

      // Log error metrics
      logSlowQuery({
        query: queryName,
        duration,
        timestamp: new Date(),
        success: false,
        error: error.message,
      })

      throw error
    }
  }) as T
}

// Create the monitoring database tables
export async function setupDatabaseMonitoring() {
  try {
    // Create table for query performance logs
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS query_performance_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          query TEXT NOT NULL,
          duration_ms FLOAT NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL,
          success BOOLEAN NOT NULL,
          error TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_query_perf_timestamp ON query_performance_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_query_perf_duration ON query_performance_logs(duration_ms);
      `,
    })

    if (createError) throw createError

    return { success: true }
  } catch (error: any) {
    console.error("Failed to set up database monitoring:", error)
    return { success: false, error: error.message }
  }
}
