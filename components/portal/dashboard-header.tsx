'use client'

import { useSupabase } from '@/contexts/supabase-context'

export function DashboardHeader() {
  const { user } = useSupabase()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Welcome to your HBH Portal dashboard. Here's what's happening today.
      </p>
    </div>
  )
}
