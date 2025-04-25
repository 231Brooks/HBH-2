import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute a query and return the results
export async function query<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(queryText, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
