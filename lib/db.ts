import { neon } from "@neondatabase/serverless"
import { validateEnv, env } from "./env"

// Validate environment variables
validateEnv()

// For connection pooling in production
const connectionString = env.DATABASE_URL

// Create a SQL client
export const sql = neon(connectionString)

// Helper function to execute queries with error handling
export async function query<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    return (await sql(query, params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database query failed")
  }
}
