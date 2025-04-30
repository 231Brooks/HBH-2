"use client"

import PusherClient from "pusher-js"
import { useState, useEffect } from "react"

let pusher: PusherClient | undefined

interface PusherConfig {
  key: string
  cluster: string
  configured: boolean
}

async function fetchPusherConfig(): Promise<PusherConfig> {
  try {
    const response = await fetch("/api/pusher/config")
    if (!response.ok) {
      console.warn("Failed to fetch Pusher configuration")
      return { configured: false, key: "", cluster: "" }
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching Pusher configuration:", error)
    return { configured: false, key: "", cluster: "" }
  }
}

export function usePusher() {
  const [client, setClient] = useState<PusherClient | null>(null)
  const [isConfigured, setIsConfigured] = useState<boolean>(false)

  useEffect(() => {
    async function setup() {
      if (typeof window === "undefined") return

      try {
        // Fetch configuration from the server
        const config = await fetchPusherConfig()
        setIsConfigured(config.configured)

        if (config.configured && config.key && config.cluster) {
          if (!pusher) {
            pusher = new PusherClient(config.key, {
              cluster: config.cluster,
              forceTLS: true,
            })
          }
          setClient(pusher)
        } else {
          setClient(null)
        }
      } catch (error) {
        console.error("Error initializing Pusher client:", error)
        setClient(null)
        setIsConfigured(false)
      }
    }

    setup()

    return () => {
      // No need to disconnect here as we're reusing the client
    }
  }, [])

  return { client, isConfigured }
}

export async function getPusherClient() {
  if (typeof window === "undefined") {
    return null
  }

  if (!pusher) {
    const config = await fetchPusherConfig()
    if (config.configured && config.key && config.cluster) {
      pusher = new PusherClient(config.key, {
        cluster: config.cluster,
        forceTLS: true,
      })
    }
  }
  return pusher || null
}
