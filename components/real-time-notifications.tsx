"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCachedData, cacheData } from "@/lib/redis"

// Create a singleton Supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Notification = {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  user_id: string
  read: boolean
  created_at: string
}

interface RealTimeNotificationsProps {
  userId: string
}

export default function RealTimeNotifications({ userId }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications and set up realtime subscription
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Try to get notifications from cache first
        const cachedNotifications = await getCachedData<Notification[]>(`notifications:${userId}`)

        if (cachedNotifications) {
          setNotifications(cachedNotifications)
          setUnreadCount(cachedNotifications.filter((n) => !n.read).length)
        }

        // Fetch notifications from Supabase
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) {
          console.error("Error fetching notifications:", error)
          return
        }

        if (data) {
          setNotifications(data)
          setUnreadCount(data.filter((n) => !n.read).length)
          // Cache the notifications for 5 minutes
          await cacheData(`notifications:${userId}`, data, 300)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }

    loadNotifications()

    // Subscribe to new notifications
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((current) => [newNotification, ...current])
          setUnreadCount((count) => count + 1)

          // Update cache
          getCachedData<Notification[]>(`notifications:${userId}`).then((cached) => {
            if (cached) {
              cacheData(`notifications:${userId}`, [newNotification, ...cached], 300)
            }
          })
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

      if (error) {
        console.error("Error marking notification as read:", error)
        return
      }

      setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((count) => count - 1)

      // Update cache
      getCachedData<Notification[]>(`notifications:${userId}`).then((cached) => {
        if (cached) {
          const updatedCache = cached.map((n) => (n.id === id ? { ...n, read: true } : n))
          cacheData(`notifications:${userId}`, updatedCache, 300)
        }
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false)

      if (error) {
        console.error("Error marking all notifications as read:", error)
        return
      }

      setNotifications((current) => current.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)

      // Update cache
      getCachedData<Notification[]>(`notifications:${userId}`).then((cached) => {
        if (cached) {
          const updatedCache = cached.map((n) => ({ ...n, read: true }))
          cacheData(`notifications:${userId}`, updatedCache, 300)
        }
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b last:border-0 ${!notification.read ? "bg-muted/50" : ""}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex gap-2 items-start">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${
                          notification.type === "info"
                            ? "bg-blue-500"
                            : notification.type === "success"
                              ? "bg-green-500"
                              : notification.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
