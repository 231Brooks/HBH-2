"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import RealTimeNotifications from "@/components/real-time-notifications"

export default function RealtimeNotificationsDemo() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [sendingStatus, setSendingStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"info" | "success" | "warning" | "error">("info")
  const [userId, setUserId] = useState("demo-user-1")

  // Setup notifications table
  const setupNotificationsTable = async () => {
    setSetupStatus("loading")
    setError(null)

    try {
      // First, ensure the exec_sql function exists
      await fetch("/api/setup-exec-sql", {
        method: "POST",
      })

      // Then set up the notifications table
      const response = await fetch("/api/setup-notifications", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up notifications table")
      }

      setSetupStatus("success")
    } catch (err: any) {
      console.error("Setup error:", err)
      setSetupStatus("error")
      setError(err.message || "An error occurred during setup")
    }
  }

  // Send a test notification
  const sendTestNotification = async () => {
    if (!message.trim()) return

    setSendingStatus("loading")
    setError(null)

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
          type: notificationType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification")
      }

      setSendingStatus("success")
      setMessage("")

      // Reset success status after 2 seconds
      setTimeout(() => {
        setSendingStatus("idle")
      }, 2000)
    } catch (err: any) {
      console.error("Send notification error:", err)
      setSendingStatus("error")
      setError(err.message || "An error occurred while sending the notification")
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Real-time Notifications Demo</h1>
          <p className="text-muted-foreground mt-2">
            This demo showcases real-time notifications using Supabase's realtime capabilities and Redis for caching.
          </p>
        </div>
        <RealTimeNotifications userId={userId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup Notifications</CardTitle>
            <CardDescription>
              First, we need to set up the notifications table in Supabase for our real-time functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && setupStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="prose max-w-none">
              <p>This setup will create the following:</p>
              <ul>
                <li>
                  <code>notifications</code> table with appropriate columns
                </li>
                <li>Row Level Security policies for the table</li>
                <li>Realtime subscription configuration</li>
              </ul>
            </div>

            <Button onClick={setupNotificationsTable} disabled={setupStatus === "loading" || setupStatus === "success"}>
              {setupStatus === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up...
                </>
              ) : setupStatus === "success" ? (
                "Setup Complete"
              ) : (
                "Setup Notifications Table"
              )}
            </Button>

            {setupStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Notifications table has been created successfully. You can now send test notifications.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Notification</CardTitle>
            <CardDescription>
              Send a test notification to see real-time updates in the notification bell icon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && sendingStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo-user-1">Demo User 1</SelectItem>
                    <SelectItem value="demo-user-2">Demo User 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notification Type</label>
                <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                />
              </div>

              <Button
                onClick={sendTestNotification}
                disabled={!message.trim() || sendingStatus === "loading" || setupStatus !== "success"}
              >
                {sendingStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : sendingStatus === "success" ? (
                  "Notification Sent!"
                ) : (
                  "Send Notification"
                )}
              </Button>

              {sendingStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Notification has been sent successfully. Check the notification bell icon in the top right.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the real-time notification system with Supabase and Redis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3>Architecture</h3>
              <p>
                This demo uses a combination of Supabase's realtime capabilities and Redis caching to create an
                efficient real-time notification system:
              </p>

              <ol>
                <li>
                  <strong>Supabase Realtime:</strong> Provides WebSocket connections to receive instant updates when new
                  notifications are added to the database.
                </li>
                <li>
                  <strong>Redis Caching:</strong> Stores notification data to reduce database load and improve
                  performance.
                </li>
              </ol>

              <h3>Data Flow</h3>
              <ol>
                <li>When a notification is sent, it's stored in the Supabase database.</li>
                <li>Supabase's realtime system broadcasts the new notification to subscribed clients.</li>
                <li>
                  The client receives the notification and updates both the UI and the Redis cache to keep them in sync.
                </li>
                <li>
                  When a user loads the page, notifications are first fetched from Redis cache for instant loading.
                </li>
                <li>The cache is then refreshed with the latest data from Supabase.</li>
              </ol>

              <h3>Benefits</h3>
              <ul>
                <li>Instant notifications without polling</li>
                <li>Reduced database load through caching</li>
                <li>Improved performance and user experience</li>
                <li>Scalable architecture for high-traffic applications</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
