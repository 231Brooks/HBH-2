'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase-context'
import { hasPortalAccess } from '@/lib/user-roles'

interface PortalAuthGuardProps {
  children: React.ReactNode
}

export function PortalAuthGuard({ children }: PortalAuthGuardProps) {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login?redirect=/portal')
      return
    }

    // Check if user has portal access
    const checkPortalAccess = async () => {
      try {
        const response = await fetch('/api/shared/auth/session')
        const data = await response.json()
        
        if (!data.platformAccess?.portal) {
          router.push('/?error=portal_access_denied')
          return
        }
        
        setChecking(false)
      } catch (error) {
        console.error('Portal access check failed:', error)
        router.push('/?error=portal_check_failed')
      }
    }

    checkPortalAccess()
  }, [user, loading, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
