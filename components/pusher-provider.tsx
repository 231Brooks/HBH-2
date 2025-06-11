"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import Pusher from "pusher-js"
import { usePusherConfig } from "@/hooks/use-pusher-config"

type PusherContextType = {
  pusher: Pusher | null
  loading: boolean
  error: Error | null
}

const PusherContext = createContext<PusherContextType>({
  pusher: null,
  loading: true,
  error: null,
})

export const usePusher = () => useContext(PusherContext)

export function PusherProvider({ children }: { children: ReactNode }) {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null)
  const { config, loading, error } = usePusherConfig()

  useEffect(() => {
    if (config && !pusherClient) {
      const client = new Pusher(config.key, {
        cluster: config.cluster,
        forceTLS: config.forceTLS,
      })

      setPusherClient(client)

      return () => {
        client.disconnect()
      }
    }
  }, [config, pusherClient])

  return <PusherContext.Provider value={{ pusher: pusherClient, loading, error }}>{children}</PusherContext.Provider>
}
