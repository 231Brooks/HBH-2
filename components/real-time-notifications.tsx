"use client"

import { useEffect } from "react"
import { usePusher } from "@/lib/pusher-client"
import { useToast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
}

interface RealTimeNotificationsProps {
  userId: string
  onNewNotification?: (notification: Notification) => void
}

export function RealTimeNotifications({ userId, onNewNotification }: RealTimeNotificationsProps) {
  const { client: pusher, isConfigured } = usePusher()
  const { toast } = useToast()

  useEffect(() => {
    if (!pusher || !isConfigured) return

    // Subscribe to the user's notification channel
    const channel = pusher.subscribe(`user-${userId}-notifications`)

    // Listen for new notifications
    channel.bind("new-notification", (data: Notification) => {
      // Show toast notification
      toast({
        title: data.title,
        description: data.message,
        variant: data.type === "error" ? "destructive" : "default",
      })

      // Call the callback if provided
      if (onNewNotification) {
        onNewNotification(data)
      }
    })

    return () => {
      pusher.unsubscribe(`user-${userId}-notifications`)
    }
  }, [pusher, userId, toast, onNewNotification, isConfigured])

  // This component doesn't render anything
  return null
}
