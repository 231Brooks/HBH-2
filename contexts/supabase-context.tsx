"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { SupabaseClient, User } from "@supabase/supabase-js"

type SupabaseContextType = {
  supabase: SupabaseClient | null
  user: User | null
  loading: boolean
  error: Error | null
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  user: null,
  loading: true,
  error: null,
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const client = getSupabaseClient()
      setSupabase(client)

      // Get initial auth state
      const {
        data: { session },
      } = client.auth.getSession()
      setUser(session?.user || null)

      // Set up auth state listener
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      setLoading(false)

      // Clean up subscription
      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.error("Error initializing Supabase client:", err)
      setError(err instanceof Error ? err : new Error("Failed to initialize Supabase client"))
      setLoading(false)
    }
  }, [])

  return <SupabaseContext.Provider value={{ supabase, user, loading, error }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
