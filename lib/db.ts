import { neon } from "@neondatabase/serverless"

// Create SQL client
export const sql = neon(process.env.DATABASE_URL || "")

// Helper function to execute SQL queries with error handling
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
