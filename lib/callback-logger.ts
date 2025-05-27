/**
 * Middleware for logging callback information
 * Wrap your callback handlers with this to automatically log activity
 */
export async function withCallbackLogging(handler: Function, endpoint: string) {
  return async function wrappedHandler(...args: any[]) {
    const start = Date.now()
    let statusCode = 200
    let responseData = null

    try {
      const result = await handler(...args)
      responseData = result

      // Extract status code if it's a NextResponse
      if (result && typeof result === "object" && "status" in result) {
        statusCode = result.status
      }

      return result
    } catch (error) {
      statusCode = 500
      responseData = { error: error.message }
      throw error
    } finally {
      const durationMs = Date.now() - start

      // Log the callback info
      try {
        await fetch("/api/logging/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.INTERNAL_API_KEY || "default-key",
          },
          body: JSON.stringify({
            endpoint,
            statusCode,
            durationMs,
            method: "POST", // You can enhance this to detect the actual method
            request: { args: JSON.parse(JSON.stringify(args)).slice(0, 1000) }, // Truncate for safety
            response: responseData ? JSON.parse(JSON.stringify(responseData)).slice(0, 1000) : null,
          }),
        })
      } catch (logError) {
        console.error("Error logging callback:", logError)
      }
    }
  }
}
