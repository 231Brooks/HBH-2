import { Pool } from "pg"
import { logger } from "./logger"

// Connection pool for direct database access when needed
let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
      })

      // Log pool creation
      logger.info("Database connection pool created")

      // Handle pool errors
      pool.on("error", (err) => {
        logger.error("Unexpected database pool error", err)
      })
    } catch (error) {
      logger.error("Failed to create database pool", error)
      throw error
    }
  }

  return pool
}

// Clean up pool on application shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", () => {
    if (pool) {
      logger.info("Closing database pool due to SIGTERM")
      pool.end()
    }
  })
}

// Helper function for transactions
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await getPool().connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
