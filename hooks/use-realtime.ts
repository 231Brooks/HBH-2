'use client'

import { useEffect, useRef } from 'react'
import { useSupabase } from '@/contexts/supabase-context'
import { CHANNELS, EVENTS } from '@/lib/pusher-server'
import { usePusher } from '@/contexts/pusher-context'

export function useRealtimeNotifications() {
  const { user } = useSupabase()
  const { pusher } = usePusher()
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!pusher || !user) return

    const channel = pusher.subscribe(CHANNELS.USER_NOTIFICATIONS(user.id))
    channelRef.current = channel

    // Listen for new notifications
    channel.bind(EVENTS.NOTIFICATION_CREATED, (data: any) => {
      // Show toast notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('notification', { detail: data.notification })
        window.dispatchEvent(event)
      }
    })

    // Listen for feature unlocks
    const featureChannel = pusher.subscribe(CHANNELS.FEATURE_UNLOCKS(user.id))
    featureChannel.bind(EVENTS.FEATURE_UNLOCKED, (data: any) => {
      // Show feature unlock notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('feature-unlocked', { detail: data })
        window.dispatchEvent(event)
      }
    })

    return () => {
      channel.unbind_all()
      featureChannel.unbind_all()
      pusher.unsubscribe(CHANNELS.USER_NOTIFICATIONS(user.id))
      pusher.unsubscribe(CHANNELS.FEATURE_UNLOCKS(user.id))
    }
  }, [pusher, user])

  return channelRef.current
}

export function useRealtimeLearning() {
  const { user } = useSupabase()
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !user) return

    const channel = pusher.subscribe(CHANNELS.LEARNING_PROGRESS(user.id))

    channel.bind(EVENTS.COURSE_ENROLLED, (data: any) => {
      // Refresh learning data
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('learning-update', { 
          detail: { type: 'enrolled', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.COURSE_COMPLETED, (data: any) => {
      // Show completion celebration
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('course-completed', { detail: data })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.CERTIFICATION_EARNED, (data: any) => {
      // Show certification earned notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('certification-earned', { detail: data })
        window.dispatchEvent(event)
      }
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(CHANNELS.LEARNING_PROGRESS(user.id))
    }
  }, [pusher, user])
}

export function useRealtimeTeam(teamId?: string) {
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !teamId) return

    const channel = pusher.subscribe(CHANNELS.TEAM_UPDATES(teamId))

    channel.bind(EVENTS.TEAM_MEMBER_ADDED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('team-update', { 
          detail: { type: 'member-added', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.TEAM_MEMBER_REMOVED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('team-update', { 
          detail: { type: 'member-removed', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.TEAM_LEADER_CHANGED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('team-update', { 
          detail: { type: 'leader-changed', data } 
        })
        window.dispatchEvent(event)
      }
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(CHANNELS.TEAM_UPDATES(teamId))
    }
  }, [pusher, teamId])
}

export function useRealtimeInvestment(groupId?: string) {
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !groupId) return

    const channel = pusher.subscribe(CHANNELS.INVESTMENT_UPDATES(groupId))

    channel.bind(EVENTS.INVESTMENT_MADE, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('investment-update', { 
          detail: { type: 'investment-made', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.PROPERTY_LINKED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('investment-update', { 
          detail: { type: 'property-linked', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.DISTRIBUTION_MADE, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('investment-update', { 
          detail: { type: 'distribution-made', data } 
        })
        window.dispatchEvent(event)
      }
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(CHANNELS.INVESTMENT_UPDATES(groupId))
    }
  }, [pusher, groupId])
}

export function useRealtimeKPI(kpiId?: string) {
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !kpiId) return

    const channel = pusher.subscribe(CHANNELS.KPI_UPDATES(kpiId))

    channel.bind(EVENTS.KPI_UPDATED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('kpi-update', { 
          detail: { type: 'value-updated', data } 
        })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.KPI_ALERT_TRIGGERED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('kpi-alert', { detail: data })
        window.dispatchEvent(event)
      }
    })

    channel.bind(EVENTS.KPI_TARGET_REACHED, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('kpi-target-reached', { detail: data })
        window.dispatchEvent(event)
      }
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(CHANNELS.KPI_UPDATES(kpiId))
    }
  }, [pusher, kpiId])
}

// Hook for admin users to listen to platform-wide events
export function useRealtimeAdmin() {
  const { user } = useSupabase()
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !user || user.role !== 'ADMIN') return

    const syncChannel = pusher.subscribe(CHANNELS.PLATFORM_SYNC)
    const adminChannel = pusher.subscribe(CHANNELS.ADMIN_UPDATES)

    syncChannel.bind(EVENTS.DATA_SYNC_COMPLETE, (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('data-sync-complete', { detail: data })
        window.dispatchEvent(event)
      }
    })

    adminChannel.bind('*', (data: any) => {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('admin-update', { detail: data })
        window.dispatchEvent(event)
      }
    })

    return () => {
      syncChannel.unbind_all()
      adminChannel.unbind_all()
      pusher.unsubscribe(CHANNELS.PLATFORM_SYNC)
      pusher.unsubscribe(CHANNELS.ADMIN_UPDATES)
    }
  }, [pusher, user])
}

// Generic hook for custom channel subscriptions
export function useRealtimeChannel(channelName: string, events: Record<string, (data: any) => void>) {
  const { pusher } = usePusher()

  useEffect(() => {
    if (!pusher || !channelName) return

    const channel = pusher.subscribe(channelName)

    Object.entries(events).forEach(([eventName, handler]) => {
      channel.bind(eventName, handler)
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
    }
  }, [pusher, channelName, events])
}
