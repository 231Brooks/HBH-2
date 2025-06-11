"use client"

import { type ReactNode, Suspense } from "react"
import { SupabaseProvider } from "@/contexts/supabase-context"

export function SupabaseProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading Supabase...</div>}>
      <SupabaseProvider>{children}</SupabaseProvider>
    </Suspense>
  )
}
