"use client"

import PusherClient from "pusher-js"
import { useState, useEffect } from "react"

let pusher: PusherClient | undefined

interface PusherConfig {
  key: string
  cluster: string
}

async function fetchPusherConfig(): Promise<PusherConfig> {
  const response = await fetch("/api/pusher/config")
  if (!response.ok) {
    throw new Error("Failed to fetch Pusher configuration")
  }
  return response.json()
}

export function usePusher() {
  const [client, setClient] = useState<PusherClient | null>(null)

  useEffect(() => {
    async function setup() {
      if (typeof window === "undefined") return

      try {
        if (!pusher) {
          const config = await fetchPusherConfig()
          pusher = new PusherClient(config.key, {
            cluster: config.cluster,
            forceTLS: true,
          })
        }

        setClient(pusher)
      } catch (error) {
        console.error("Error initializing Pusher client:", error)
      }
    }

    setup()

    return () => {
      // No need to disconnect here as we're reusing the client
    }
  }, [])

  return client
}

export function getPusherClient() {
  if (typeof window === "undefined") {
    return null
  }

  if (!pusher) {
    fetchPusherConfig()
      .then((config) => {
        pusher = new PusherClient(config.key, {
          cluster: config.cluster,
          forceTLS: true,
        })
      })
      .catch((error) => {
        console.error("Error initializing Pusher client:", error)
      })
  }
  return pusher
}
