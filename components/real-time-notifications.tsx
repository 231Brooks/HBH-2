"use client"

import { useEffect, useState, useCallback } from "react"
import { usePusher } from "@/lib/pusher-client"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Notification = {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: "transaction" | "message" | "system"
}

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const pusher = usePusher()

  const fetchNotifications = useCallback(async () => {
    // In a real app, you'd fetch from your API
    // For now, we'll use mock data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        message: "New message from John Doe",
        timestamp: new Date().toISOString(),
        read: false,
        type: "message",
      },
      {
        id: "2",
        message: "Transaction status updated",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        type: "transaction",
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  useEffect(() => {
    if (!pusher) return

    // Subscribe to user's personal channel
    // In production, you'd use a unique user ID
    const channel = pusher.subscribe("user-notifications")

    channel.bind("new-notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    // Fetch initial notifications
    fetchNotifications()

    return () => {
      pusher.unsubscribe("user-notifications")
    }
  }, [pusher, fetchNotifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    // In a real app, you'd call your API to mark as read
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)

    // In a real app, you'd call your API to mark all as read
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center w-full">
                <span className="font-medium flex-1">{notification.message}</span>
                {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()} -{" "}
                {new Date(notification.timestamp).toLocaleDateString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
