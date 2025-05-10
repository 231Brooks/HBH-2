import Pusher from "pusher"
import { env } from "./env"
import { logger } from "./logger"
import { ExternalServiceError } from "./error-handler"

// Create Pusher instance with proper error handling
let pusherServer: Pusher | null = null

try {
  // Only initialize if all required env vars are present
  if (
    env.NEXT_PUBLIC_PUSHER_APP_ID &&
    env.NEXT_PUBLIC_PUSHER_KEY &&
    env.PUSHER_SECRET &&
    env.NEXT_PUBLIC_PUSHER_CLUSTER
  ) {
    pusherServer = new Pusher({
      appId: env.NEXT_PUBLIC_PUSHER_APP_ID,
      key: env.NEXT_PUBLIC_PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    })

    logger.info("Pusher server initialized successfully")
  } else {
    logger.warn("Missing Pusher environment variables, Pusher server not initialized")
  }
} catch (error) {
  logger.error("Failed to initialize Pusher server", error)
}

// Enhanced trigger function with error handling
export async function triggerPusherEvent(channel: string, event: string, data: any): Promise<void> {
  if (!pusherServer) {
    logger.warn("Pusher server not initialized, skipping event trigger")
    return
  }

  try {
    await pusherServer.trigger(channel, event, data)
    logger.debug(`Pusher event triggered: ${event} on ${channel}`, { eventType: event })
  } catch (error) {
    logger.error(`Failed to trigger Pusher event: ${event} on ${channel}`, error)
    throw new ExternalServiceError("Failed to send real-time notification")
  }
}

// Export the server instance
export { pusherServer }
