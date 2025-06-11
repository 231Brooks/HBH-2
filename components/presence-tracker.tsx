"use client"

import { useSupabase } from "@/contexts/supabase-context"
import { useTrackPresence } from "@/lib/presence"
import { useEffect } from "react"

export function PresenceTracker() {
  const { user } = useSupabase()
  const userId = user?.id

  // Track user presence when logged in
  const { error } = useTrackPresence(userId || "")

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Presence tracking error:", error)
    }
  }, [error])

  // This component doesn't render anything
  return null
}
