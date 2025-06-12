"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSupabase } from "@/contexts/supabase-context"
import { ClientOnly } from "@/components/client-only"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading, isHydrated } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isHydrated && !loading && !user) {
      // Redirect to login with callback URL
      const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
      router.push(loginUrl)
    }
  }, [user, loading, isHydrated, router, pathname])

  // Show loading state while checking authentication
  if (!isHydrated || loading) {
    return (
      fallback || (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // If not authenticated, show loading (redirect is happening)
  if (!user) {
    return (
      fallback || (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Redirecting to login...</p>
          </div>
        </div>
      )
    )
  }

  // User is authenticated, render the protected content
  return <ClientOnly fallback={fallback}>{children}</ClientOnly>
}
