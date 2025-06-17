'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRealtimeNotifications } from '@/hooks/use-realtime'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'REMINDER'
  category: 'LEARNING' | 'TEAM' | 'INVESTMENT' | 'KPI' | 'SYSTEM' | 'ACHIEVEMENT'
  actionUrl?: string
  actionText?: string
  createdAt: string
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Subscribe to real-time notifications
  useRealtimeNotifications()

  useEffect(() => {
    // Listen for notification events
    const handleNotification = (event: CustomEvent) => {
      const notification = event.detail
      showNotificationToast(notification)
      setNotifications(prev => [notification, ...prev.slice(0, 49)]) // Keep last 50
    }

    const handleFeatureUnlock = (event: CustomEvent) => {
      const { features, source } = event.detail
      showFeatureUnlockToast(features, source)
    }

    const handleCourseCompletion = (event: CustomEvent) => {
      const { course, unlockedFeatures } = event.detail
      showCourseCompletionToast(course, unlockedFeatures)
    }

    const handleCertificationEarned = (event: CustomEvent) => {
      const { certification } = event.detail
      showCertificationToast(certification)
    }

    const handleKPIAlert = (event: CustomEvent) => {
      const { alert } = event.detail
      showKPIAlertToast(alert)
    }

    // Add event listeners
    window.addEventListener('notification', handleNotification as EventListener)
    window.addEventListener('feature-unlocked', handleFeatureUnlock as EventListener)
    window.addEventListener('course-completed', handleCourseCompletion as EventListener)
    window.addEventListener('certification-earned', handleCertificationEarned as EventListener)
    window.addEventListener('kpi-alert', handleKPIAlert as EventListener)

    return () => {
      window.removeEventListener('notification', handleNotification as EventListener)
      window.removeEventListener('feature-unlocked', handleFeatureUnlock as EventListener)
      window.removeEventListener('course-completed', handleCourseCompletion as EventListener)
      window.removeEventListener('certification-earned', handleCertificationEarned as EventListener)
      window.removeEventListener('kpi-alert', handleKPIAlert as EventListener)
    }
  }, [])

  const showNotificationToast = (notification: Notification) => {
    const icon = getNotificationIcon(notification.type, notification.category)
    const action = notification.actionUrl ? {
      label: notification.actionText || 'View',
      onClick: () => window.location.href = notification.actionUrl!
    } : undefined

    switch (notification.type) {
      case 'SUCCESS':
        toast.success(notification.title, {
          description: notification.message,
          icon,
          action
        })
        break
      case 'WARNING':
        toast.warning(notification.title, {
          description: notification.message,
          icon,
          action
        })
        break
      case 'ERROR':
        toast.error(notification.title, {
          description: notification.message,
          icon,
          action
        })
        break
      default:
        toast(notification.title, {
          description: notification.message,
          icon,
          action
        })
    }
  }

  const showFeatureUnlockToast = (features: any[], source: string) => {
    features.forEach(feature => {
      toast.success('🎉 Feature Unlocked!', {
        description: `You've unlocked "${feature.description}"`,
        duration: 5000,
        action: {
          label: 'Explore',
          onClick: () => {
            if (feature.platform === 'HBH2') {
              window.location.href = '/'
            } else {
              window.location.href = '/portal'
            }
          }
        }
      })
    })
  }

  const showCourseCompletionToast = (course: any, unlockedFeatures: any[]) => {
    toast.success('🎓 Course Completed!', {
      description: `Congratulations on completing "${course.title}"`,
      duration: 5000,
      action: {
        label: 'View Certificate',
        onClick: () => window.location.href = `/portal/learning/courses/${course.id}/certificate`
      }
    })

    // Show feature unlocks separately
    if (unlockedFeatures.length > 0) {
      setTimeout(() => {
        showFeatureUnlockToast(unlockedFeatures, 'course_completion')
      }, 1000)
    }
  }

  const showCertificationToast = (certification: any) => {
    toast.success('🏆 Certification Earned!', {
      description: `You've earned the "${certification.name}" certification`,
      duration: 6000,
      action: {
        label: 'View Certificate',
        onClick: () => window.location.href = `/portal/certifications/${certification.id}`
      }
    })
  }

  const showKPIAlertToast = (alert: any) => {
    toast.warning('📊 KPI Alert', {
      description: alert.message,
      duration: 8000,
      action: {
        label: 'View KPI',
        onClick: () => window.location.href = `/portal/kpis/${alert.kpiId}`
      }
    })
  }

  const getNotificationIcon = (type: string, category: string) => {
    // Category-specific icons
    switch (category) {
      case 'LEARNING':
        return <AcademicCapIcon className="h-5 w-5" />
      case 'INVESTMENT':
        return <CurrencyDollarIcon className="h-5 w-5" />
      case 'ACHIEVEMENT':
        return <TrophyIcon className="h-5 w-5" />
      default:
        // Type-specific icons
        switch (type) {
          case 'SUCCESS':
            return <CheckCircleIcon className="h-5 w-5 text-green-500" />
          case 'WARNING':
            return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          case 'ERROR':
            return <XCircleIcon className="h-5 w-5 text-red-500" />
          default:
            return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
        }
    }
  }

  return null // This component only handles notifications, no UI
}

// Hook to access notification history
export function useNotificationHistory() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notification history from API
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/shared/notifications?limit=50')
        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }

    loadNotifications()
  }, [])

  return notifications
}
