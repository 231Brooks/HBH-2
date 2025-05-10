import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET() {
  const startTime = Date.now()
  const checks = { database: false, api: true }
  let status = 200

  try {
    // Check database connection
    await sql`SELECT 1`
    checks.database = true

    logger.info("Health check passed")
  } catch (error) {
    logger.error("Health check failed", error)
    status = 503 // Service Unavailable
  }

  const responseTime = Date.now() - startTime

  return NextResponse.json(
    {
      status: status === 200 ? "ok" : "error",
      timestamp: new Date().toISOString(),
      checks,
      responseTime: `${responseTime}ms`,
    },
    { status },
  )
}
