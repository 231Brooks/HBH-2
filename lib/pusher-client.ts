"use client"

import Pusher from "pusher-js"
import { logger } from "./logger"

// Create a more robust Pusher client with conditional initialization
let pusherClient: Pusher | null = null
let isInitializing = false
let initPromise: Promise<Pusher | null> | null = null

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

      pusherClient = new Pusher(config.key, {
        cluster: config.cluster,
        authEndpoint: "/api/pusher/auth",
        enabledTransports: ["ws", "wss"],
        disabledTransports: [],
        activityTimeout: 30000,
        pongTimeout: 15000,
        maxReconnectionAttempts: 10,
        maxReconnectGapInSeconds: 30,
      })

      // Add connection monitoring
      pusherClient.connection.bind("connected", () => {
        logger.info("Connected to Pusher")
      })

      pusherClient.connection.bind("disconnected", () => {
        logger.warn("Disconnected from Pusher")
      })

      pusherClient.connection.bind("error", (err: any) => {
        logger.error("Pusher connection error", err)

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

// Export the client initialization function and the client itself
export { pusherClient }
