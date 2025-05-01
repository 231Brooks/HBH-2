"use server"

// This function will run on the server and handle the API key securely
export async function applyDatabaseOptimizations() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || ""}/api/setup-db-optimizations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.INTERNAL_API_KEY || "", // Using the non-public version
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to apply database optimizations")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Optimization error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
