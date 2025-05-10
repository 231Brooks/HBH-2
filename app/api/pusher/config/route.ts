import { NextResponse } from "next/server"
import { errorHandler } from "@/lib/error-handler"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    // Get the Pusher configuration from environment variables
    const key = process.env.PUSHER_KEY
    const cluster = process.env.PUSHER_CLUSTER

    // Log the configuration (without exposing the actual key)
    logger.info("Pusher config requested", {
      hasKey: !!key,
      hasCluster: !!cluster,
    })

    // Check if the configuration is valid
    if (!key || !cluster) {
      logger.error("Missing Pusher configuration", { hasKey: !!key, hasCluster: !!cluster })
      return NextResponse.json({ error: "Pusher configuration is incomplete" }, { status: 500 })
    }

    // Return the configuration
    return NextResponse.json({
      key,
      cluster,
    })
  } catch (error) {
    logger.error("Error in Pusher config endpoint", { error: error instanceof Error ? error.message : String(error) })
    return errorHandler(error)
  }
}
