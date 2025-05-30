"use client"

import { useState, useEffect } from "react"

type PusherConfig = {
  key: string
  cluster: string
  forceTLS: boolean
}

export function usePusherConfig() {
  const [config, setConfig] = useState<PusherConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/pusher-config")
        if (!response.ok) {
          throw new Error("Failed to fetch Pusher configuration")
        }
        const data = await response.json()
        setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading, error }
}
