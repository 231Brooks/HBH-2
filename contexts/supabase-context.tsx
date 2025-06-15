"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { SupabaseClient, User } from "@supabase/supabase-js"

type SupabaseContextType = {
  supabase: SupabaseClient | null
  user: User | null
  loading: boolean
  error: Error | null
  isHydrated: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  user: null,
  loading: true,
  error: null,
  isHydrated: false,
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated on client
    setIsHydrated(true)

    let subscription: any = null

    async function initializeAuth() {
      try {
        const client = getSupabaseClient()
        setSupabase(client)

        // Get initial auth state (await the promise)
        const {
          data: { session },
        } = await client.auth.getSession()
        setUser(session?.user || null)

        // Set up auth state listener
        const {
          data: { subscription: authSubscription },
        } = client.auth.onAuthStateChange((_event, session) => {
          console.log("Auth state changed:", _event, session?.user?.email)
          setUser(session?.user || null)
        })

        subscription = authSubscription
        setLoading(false)
      } catch (err) {
        console.error("Error initializing Supabase client:", err)
        setError(err instanceof Error ? err : new Error("Failed to initialize Supabase client"))
        setLoading(false)
      }
    }

    initializeAuth()

    // Return cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return <SupabaseContext.Provider value={{ supabase, user, loading, error, isHydrated }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
