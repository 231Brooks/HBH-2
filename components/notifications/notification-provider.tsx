"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Toaster } from "@/components/ui/toaster"
import { initializePusherClient, pusherChannels } from "@/lib/pusher-client"
import { NotificationToast, type Notification } from "./notification-toast"
import { logger } from "@/lib/logger"

export function NotificationProvider() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Pusher client
  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let isMounted = true

    const initPusher = async () => {
      try {
        logger.info("Initializing Pusher client")
        const client = await initializePusherClient()

        // Check if component is still mounted
        if (!isMounted) return

        if (client) {
          logger.info("Pusher client initialized successfully")

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
          logger.warn("Failed to initialize Pusher client, notifications will not be available")
        }
      } catch (error) {
        if (isMounted) {
          logger.error("Error in NotificationProvider", {
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    }

    initPusher()

    // Cleanup function
    return () => {
      isMounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

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
