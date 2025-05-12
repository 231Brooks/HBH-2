"use client"

import Pusher from "pusher-js"
import { logger } from "./logger"

// Create a more robust Pusher client with conditional initialization
let pusherClient: Pusher | null = null
let isInitializing = false
let initPromise: Promise<Pusher | null> | null = null
let retryCount = 0
const MAX_RETRIES = 5
const RETRY_DELAY_BASE = 2000 // 2 seconds base delay

// We'll initialize Pusher with configuration from a server endpoint
export async function initializePusherClient(): Promise<Pusher | null> {
  // If already initialized, return the existing client
  if (pusherClient) {
    return pusherClient
  }

  // If already initializing, return the existing promise
  if (isInitializing && initPromise) {
    return initPromise
  }

  // Don't initialize on the server
  if (typeof window === "undefined") {
    return null
  }

  isInitializing = true

  initPromise = new Promise<Pusher | null>(async (resolve) => {
    try {
      // Fetch Pusher configuration from server
      const response = await fetch("/api/pusher/config")
      if (!response.ok) {
        logger.error(`Failed to fetch Pusher configuration: ${response.status} ${response.statusText}`)
        resolve(null)
        return
      }

      const config = await response.json()
      logger.info("Received Pusher config", { hasKey: !!config.key, hasCluster: !!config.cluster })

      if (!config.key || !config.cluster) {
        logger.error("Invalid Pusher configuration received: missing key or cluster")
        resolve(null)
        return
      }

      // Configure Pusher with fallbacks and better error handling
      pusherClient = new Pusher(config.key, {
        cluster: config.cluster,
        authEndpoint: "/api/pusher/auth",
        // Enable all transports for better fallback options
        enabledTransports: ["ws", "wss", "xhr_streaming", "xhr_polling"],
        disabledTransports: [],
        // Increase timeouts for better reliability
        activityTimeout: 60000, // 1 minute
        pongTimeout: 30000, // 30 seconds
        // Retry configuration
        maxReconnectionAttempts: 10,
        maxReconnectGapInSeconds: 60,
        // Enable stats for better debugging
        enableStats: true,
        // Reduce WebSocket connection issues in some environments
        wsHost: config.cluster + ".pusher.com",
        httpHost: config.cluster + ".pusher.com",
      })

      // Add connection monitoring
      pusherClient.connection.bind("connected", () => {
        logger.info("Connected to Pusher")
        // Reset retry count on successful connection
        retryCount = 0
      })

      pusherClient.connection.bind("disconnected", () => {
        logger.warn("Disconnected from Pusher")
      })

      pusherClient.connection.bind("error", (err: any) => {
        logger.error("Pusher connection error", err)

        // Handle WebSocket errors specifically
        if (err.type === "WebSocketError") {
          logger.warn("WebSocket connection failed, will try alternative transports")

          // If we've already retried too many times, don't retry again
          if (retryCount >= MAX_RETRIES) {
            logger.error(`Maximum retry attempts (${MAX_RETRIES}) reached, giving up`)
            return
          }

          // Exponential backoff for retries
          const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount)
          retryCount++

          logger.info(`Retrying connection in ${delay}ms (attempt ${retryCount} of ${MAX_RETRIES})`)

          setTimeout(() => {
            if (pusherClient) {
              // Force disconnect and reconnect
              pusherClient.disconnect()
              pusherClient.connect()
            }
          }, delay)
        }

        // Handle specific error codes
        if (err?.data?.code === 4200) {
          logger.info("Attempting to reconnect to Pusher...")
          setTimeout(() => {
            if (pusherClient) {
              pusherClient.connect()
            }
          }, 3000)
        }
      })

      // Add stats monitoring for debugging
      if (pusherClient.connection.isSupported()) {
        logger.info("WebSockets are supported in this browser")
      } else {
        logger.warn("WebSockets are not supported in this browser, will use HTTP fallbacks")
      }

      resolve(pusherClient)
    } catch (error) {
      logger.error("Failed to initialize Pusher client", {
        error: error instanceof Error ? error.message : String(error),
      })
      // Set to null so we can handle this case
      pusherClient = null
      resolve(null)
    } finally {
      isInitializing = false
    }
  })

  return initPromise
}

// Channel definitions
export const pusherChannels = {
  notifications: "notifications",
  userNotifications: (userId: string) => `private-user-${userId}-notifications`,
}

// Enhanced subscribe function with error handling
export async function subscribeToPusherChannel(
  channelName: string,
  eventName: string,
  callback: (data: any) => void,
): Promise<() => void> {
  try {
    // Initialize client if not already done
    const client = await initializePusherClient()

    // If Pusher client isn't available, return a no-op function
    if (!client) {
      logger.warn("Pusher client not available, skipping subscription")
      return () => {}
    }

    const channel = client.subscribe(channelName)

    // Handle subscription errors
    channel.bind("subscription_error", (status: any) => {
      logger.error(`Subscription error for channel ${channelName}:`, status)
    })

    channel.bind(eventName, callback)

    // Return unsubscribe function
    return () => {
      try {
        channel.unbind(eventName, callback)
        client.unsubscribe(channelName)
      } catch (error) {
        logger.error(`Error unsubscribing from channel: ${channelName}`, error)
      }
    }
  } catch (error) {
    logger.error(`Failed to subscribe to Pusher channel: ${channelName}`, error)
    // Return no-op function
    return () => {}
  }
}

// Create a function to check if Pusher is connected
export function isPusherConnected(): boolean {
  return !!pusherClient && pusherClient.connection.state === "connected"
}

// Export the client initialization function and the client itself
export { pusherClient }
