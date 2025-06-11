"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/contexts/supabase-context"
import type { RealtimeChannel } from "@supabase/supabase-js"

type SubscriptionEvent = "INSERT" | "UPDATE" | "DELETE" | "*"

export function useSupabaseSubscription<T = any>(
  table: string,
  event: SubscriptionEvent = "*",
  callback?: (payload: { new: T; old: T }) => void,
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!supabase) return

    // Initial fetch
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: initialData, error: fetchError } = await supabase.from(table).select("*")

        if (fetchError) {
          throw fetchError
        }

        setData(initialData || [])
      } catch (err) {
        console.error(`Error fetching data from ${table}:`, err)
        setError(err instanceof Error ? err : new Error(`Failed to fetch data from ${table}`))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscription
    const newChannel = supabase
      .channel(`public:${table}`)
      .on("postgres_changes", { event, schema: "public", table }, (payload) => {
        if (callback) {
          callback(payload.new as any)
        }

        // Update local data based on the event
        if (event === "INSERT" || event === "*") {
          setData((currentData) => [...currentData, payload.new as T])
        } else if (event === "UPDATE" || event === "*") {
          setData((currentData) =>
            currentData.map((item: any) => (item.id === (payload.new as any).id ? payload.new : item)),
          )
        } else if (event === "DELETE" || event === "*") {
          setData((currentData) => currentData.filter((item: any) => item.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [supabase, table, event, callback])

  return { data, error, loading, channel }
}
