"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Toaster } from "@/components/ui/toaster"
import { initializePusherClient, pusherChannels, isPusherConnected } from "@/lib/pusher-client"
import { NotificationToast, type Notification } from "./notification-toast"
import { logger } from "@/lib/logger"

// Fallback polling interval when Pusher is not available
const POLLING_INTERVAL = 30000 // 30 seconds

export function NotificationProvider() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPusherAvailable, setIsPusherAvailable] = useState(true)

  // Initialize Pusher client
  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let pollingInterval: NodeJS.Timeout | null = null
    let isMounted = true

    const initPusher = async () => {
      try {
        logger.info("Initializing Pusher client")
        const client = await initializePusherClient()

        // Check if component is still mounted
        if (!isMounted) return

        if (client) {
          logger.info("Pusher client initialized successfully")
          setIsPusherAvailable(true)

          // Subscribe to the public notifications channel
          const channel = client.subscribe(pusherChannels.notifications)
          logger.info(`Subscribed to channel: ${pusherChannels.notifications}`)

          // Listen for new notification events
          channel.bind("new-notification", (data: Omit<Notification, "id">) => {
            if (!isMounted) return

            const notification = {
              id: uuidv4(),
              ...data,
            }
            setNotifications((prev) => [...prev, notification])
            logger.info("Received new notification", { title: notification.title })

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
              if (isMounted) {
                dismissNotification(notification.id)
              }
            }, 5000)
          })

          // Store unsubscribe function
          unsubscribe = () => {
            logger.info(`Unsubscribing from channel: ${pusherChannels.notifications}`)
            channel.unbind("new-notification")
            client.unsubscribe(pusherChannels.notifications)
          }

          setIsInitialized(true)
        } else {
          logger.warn("Failed to initialize Pusher client, falling back to polling")
          setIsPusherAvailable(false)
          setupPolling()
        }
      } catch (error) {
        if (isMounted) {
          logger.error("Error in NotificationProvider", {
            error: error instanceof Error ? error.message : String(error),
          })
          setIsPusherAvailable(false)
          setupPolling()
        }
      }
    }

    // Fallback to polling when Pusher is not available
    const setupPolling = () => {
      logger.info(`Setting up polling fallback with interval: ${POLLING_INTERVAL}ms`)

      // Fetch notifications immediately
      fetchNotifications()

      // Then set up interval
      pollingInterval = setInterval(fetchNotifications, POLLING_INTERVAL)
    }

    const fetchNotifications = async () => {
      try {
        logger.info("Fetching notifications via polling")
        const response = await fetch("/api/notifications")
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`)
        }

        const data = await response.json()

        if (isMounted && data.notifications && Array.isArray(data.notifications)) {
          // Process new notifications
          data.notifications.forEach((notification: Omit<Notification, "id">) => {
            const newNotification = {
              id: uuidv4(),
              ...notification,
            }

            // Check if we already have this notification (based on content)
            const isDuplicate = notifications.some(
              (n) => n.title === newNotification.title && n.message === newNotification.message,
            )

            if (!isDuplicate) {
              setNotifications((prev) => [...prev, newNotification])

              // Auto-dismiss after 5 seconds
              setTimeout(() => {
                if (isMounted) {
                  dismissNotification(newNotification.id)
                }
              }, 5000)
            }
          })
        }
      } catch (error) {
        logger.error("Error fetching notifications", {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    initPusher()

    // Check connection status periodically
    const connectionCheckInterval = setInterval(() => {
      const connected = isPusherConnected()
      if (!connected && isPusherAvailable) {
        logger.warn("Pusher connection lost, falling back to polling")
        setIsPusherAvailable(false)
        setupPolling()
      } else if (connected && !isPusherAvailable) {
        logger.info("Pusher connection restored")
        setIsPusherAvailable(true)

        // Clear polling interval if it exists
        if (pollingInterval) {
          clearInterval(pollingInterval)
          pollingInterval = null
        }
      }
    }, 10000) // Check every 10 seconds

    // Cleanup function
    return () => {
      isMounted = false

      if (unsubscribe) {
        unsubscribe()
      }

      if (pollingInterval) {
        clearInterval(pollingInterval)
      }

      clearInterval(connectionCheckInterval)
    }
  }, [notifications])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <>
      <Toaster>
        {notifications.map((notification) => (
          <NotificationToast key={notification.id} notification={notification} onDismiss={dismissNotification} />
        ))}
      </Toaster>
    </>
  )
}
