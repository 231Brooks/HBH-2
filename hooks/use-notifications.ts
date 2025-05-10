"use client"

import { useState } from "react"

interface SendNotificationOptions {
  title: string
  description: string
  type?: "default" | "success" | "error" | "warning" | "info"
  userId?: string
}

export function useNotifications() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendNotification = async (options: SendNotificationOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send notification")
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendNotification,
    isLoading,
    error,
  }
}
