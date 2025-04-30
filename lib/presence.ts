"use client"

import { getSupabaseClient } from "./supabase-client"
import { useEffect, useState } from "react"

export type PresenceStatus = "online" | "offline" | "away" | "busy"

export type UserPresence = {
  user_id: string
  status: PresenceStatus
  last_seen: string
}

// Track user presence in a specific channel
export function useTrackPresence(userId: string, channelName = "global") {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    try {
      const supabase = getSupabaseClient()
      const channel = supabase.channel(channelName)

      // Enter the channel with the user's presence data
      channel
        .on("presence", { event: "sync" }, () => {
          // Handle presence sync (optional)
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          // Handle new user joining (optional)
          console.log("User joined:", newPresences)
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          // Handle user leaving (optional)
          console.log("User left:", leftPresences)
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // Track presence for the current user
            await channel.track({
              user_id: userId,
              status: "online",
              last_seen: new Date().toISOString(),
            })
          }
        })

      // Set up heartbeat to keep presence active
      const heartbeatInterval = setInterval(async () => {
        await channel.track({
          user_id: userId,
          status: "online",
          last_seen: new Date().toISOString(),
        })
      }, 30000) // Update every 30 seconds

      // Clean up
      return () => {
        clearInterval(heartbeatInterval)
        channel.unsubscribe()
      }
    } catch (err) {
      console.error("Error tracking presence:", err)
      setError(err instanceof Error ? err : new Error("Failed to track presence"))
    }
  }, [userId, channelName])

  return { error }
}

// Get presence data for users in a specific channel
export function useGetPresence(channelName = "global") {
  const [presenceData, setPresenceData] = useState<Record<string, UserPresence[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const supabase = getSupabaseClient()
      const channel = supabase.channel(channelName)

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState()
          setPresenceData(state)
          setLoading(false)
        })
        .on("presence", { event: "join" }, () => {
          const state = channel.presenceState()
          setPresenceData(state)
        })
        .on("presence", { event: "leave" }, () => {
          const state = channel.presenceState()
          setPresenceData(state)
        })
        .subscribe()

      return () => {
        channel.unsubscribe()
      }
    } catch (err) {
      console.error("Error getting presence:", err)
      setError(err instanceof Error ? err : new Error("Failed to get presence"))
      setLoading(false)
    }
  }, [channelName])

  // Extract online user IDs from presence data
  const onlineUserIds = Object.values(presenceData)
    .flat()
    .map((presence) => presence.user_id)

  // Check if a specific user is online
  const isUserOnline = (userId: string) => onlineUserIds.includes(userId)

  return { presenceData, onlineUserIds, isUserOnline, loading, error }
}
