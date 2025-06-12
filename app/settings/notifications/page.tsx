"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Calendar,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  Clock
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface NotificationSetting {
  id: string
  title: string
  description: string
  category: string
  email: boolean
  push: boolean
  inApp: boolean
  sms?: boolean
}

function NotificationSettingsContent() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    // Account & Security
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "When someone logs into your account",
      category: "Security",
      email: true,
      push: true,
      inApp: true,
      sms: true
    },
    {
      id: "password-changes",
      title: "Password Changes",
      description: "When your password is changed",
      category: "Security",
      email: true,
      push: true,
      inApp: true,
      sms: true
    },
    {
      id: "account-updates",
      title: "Account Updates",
      description: "Changes to your account settings",
      category: "Account",
      email: true,
      push: false,
      inApp: true
    },

    // Transactions & Progress
    {
      id: "transaction-updates",
      title: "Transaction Updates",
      description: "Status changes in your transactions",
      category: "Transactions",
      email: true,
      push: true,
      inApp: true,
      sms: false
    },
    {
      id: "milestone-reached",
      title: "Milestone Reached",
      description: "When you reach transaction milestones",
      category: "Transactions",
      email: true,
      push: true,
      inApp: true
    },
    {
      id: "closing-reminders",
      title: "Closing Reminders",
      description: "Reminders about upcoming closing dates",
      category: "Transactions",
      email: true,
      push: true,
      inApp: true,
      sms: true
    },

    // Services & Marketplace
    {
      id: "service-requests",
      title: "Service Requests",
      description: "New requests for your services",
      category: "Services",
      email: true,
      push: true,
      inApp: true
    },
    {
      id: "property-inquiries",
      title: "Property Inquiries",
      description: "Inquiries about your property listings",
      category: "Marketplace",
      email: true,
      push: true,
      inApp: true
    },
    {
      id: "new-listings",
      title: "New Listings",
      description: "Properties matching your saved searches",
      category: "Marketplace",
      email: false,
      push: true,
      inApp: true
    },

    // Calendar & Appointments
    {
      id: "appointment-reminders",
      title: "Appointment Reminders",
      description: "Reminders about upcoming appointments",
      category: "Calendar",
      email: true,
      push: true,
      inApp: true,
      sms: true
    },
    {
      id: "appointment-changes",
      title: "Appointment Changes",
      description: "When appointments are rescheduled or cancelled",
      category: "Calendar",
      email: true,
      push: true,
      inApp: true
    },

    // Messages & Communication
    {
      id: "new-messages",
      title: "New Messages",
      description: "When you receive new messages",
      category: "Messages",
      email: false,
      push: true,
      inApp: true
    },
    {
      id: "message-replies",
      title: "Message Replies",
      description: "Replies to your messages",
      category: "Messages",
      email: false,
      push: true,
      inApp: true
    },

    // Marketing & Updates
    {
      id: "platform-updates",
      title: "Platform Updates",
      description: "New features and platform announcements",
      category: "Updates",
      email: true,
      push: false,
      inApp: true
    },
    {
      id: "tips-recommendations",
      title: "Tips & Recommendations",
      description: "Helpful tips and personalized recommendations",
      category: "Updates",
      email: false,
      push: false,
      inApp: true
    }
  ])

  // Global notification settings
  const [globalSettings, setGlobalSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    smsEnabled: false,
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00"
  })

  const updateNotification = (id: string, type: 'email' | 'push' | 'inApp' | 'sms', value: boolean) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, [type]: value } : notif
    ))
  }

  const updateGlobalSetting = (key: string, value: boolean | string) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock API call - in real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Notification settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save notification settings. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(notifications.map(n => n.category))]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <AlertTriangle className="h-4 w-4" />
      case 'Account':
        return <Users className="h-4 w-4" />
      case 'Transactions':
        return <CheckCircle className="h-4 w-4" />
      case 'Services':
        return <Building2 className="h-4 w-4" />
      case 'Marketplace':
        return <Building2 className="h-4 w-4" />
      case 'Calendar':
        return <Calendar className="h-4 w-4" />
      case 'Messages':
        return <MessageSquare className="h-4 w-4" />
      case 'Updates':
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="text-muted-foreground">
            Manage how and when you receive notifications
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Global Notification Settings
              </CardTitle>
              <CardDescription>Control all notifications at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={globalSettings.emailEnabled}
                    onCheckedChange={(value) => updateGlobalSetting('emailEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={globalSettings.pushEnabled}
                    onCheckedChange={(value) => updateGlobalSetting('pushEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label>In-App Notifications</Label>
                  </div>
                  <Switch
                    checked={globalSettings.inAppEnabled}
                    onCheckedChange={(value) => updateGlobalSetting('inAppEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label>SMS Notifications</Label>
                  </div>
                  <Switch
                    checked={globalSettings.smsEnabled}
                    onCheckedChange={(value) => updateGlobalSetting('smsEnabled', value)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Label>Quiet Hours</Label>
                  </div>
                  <Switch
                    checked={globalSettings.quietHours}
                    onCheckedChange={(value) => updateGlobalSetting('quietHours', value)}
                  />
                </div>
                {globalSettings.quietHours && (
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <Label className="text-xs">From</Label>
                      <input
                        type="time"
                        value={globalSettings.quietStart}
                        onChange={(e) => updateGlobalSetting('quietStart', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">To</Label>
                      <input
                        type="time"
                        value={globalSettings.quietEnd}
                        onChange={(e) => updateGlobalSetting('quietEnd', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Categories */}
          {categories.map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category} Notifications
                </CardTitle>
                <CardDescription>
                  Manage {category.toLowerCase()} notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter(n => n.category === category).map(notification => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Email</Label>
                          <Switch
                            checked={notification.email && globalSettings.emailEnabled}
                            onCheckedChange={(value) => updateNotification(notification.id, 'email', value)}
                            disabled={!globalSettings.emailEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Push</Label>
                          <Switch
                            checked={notification.push && globalSettings.pushEnabled}
                            onCheckedChange={(value) => updateNotification(notification.id, 'push', value)}
                            disabled={!globalSettings.pushEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm">In-App</Label>
                          <Switch
                            checked={notification.inApp && globalSettings.inAppEnabled}
                            onCheckedChange={(value) => updateNotification(notification.id, 'inApp', value)}
                            disabled={!globalSettings.inAppEnabled}
                          />
                        </div>

                        {notification.sms !== undefined && (
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">SMS</Label>
                            <Switch
                              checked={notification.sms && globalSettings.smsEnabled}
                              onCheckedChange={(value) => updateNotification(notification.id, 'sms', value)}
                              disabled={!globalSettings.smsEnabled}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? "Saving..." : "Save Notification Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationSettingsPage() {
  return (
    <ProtectedRoute>
      <NotificationSettingsContent />
    </ProtectedRoute>
  )
}
