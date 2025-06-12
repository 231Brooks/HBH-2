"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Mail,
  Globe,
  Download,
  Trash2
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { ProtectedRoute } from "@/components/protected-route"

interface SecuritySetting {
  id: string
  title: string
  description: string
  enabled: boolean
  icon: React.ReactNode
  type: 'toggle' | 'action' | 'info'
  action?: () => void
  href?: string
}

function SecuritySettingsContent() {
  const { supabase, user } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [dataEncryption, setDataEncryption] = useState(true)

  // Recent security activity (mock data for now)
  const [recentActivity] = useState([
    {
      id: 1,
      action: "Password changed",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      location: "New York, NY",
      device: "Chrome on Windows",
      status: "success"
    },
    {
      id: 2,
      action: "Login from new device",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      location: "San Francisco, CA",
      device: "Safari on iPhone",
      status: "warning"
    },
    {
      id: 3,
      action: "Two-factor authentication enabled",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: "New York, NY",
      device: "Chrome on Windows",
      status: "success"
    }
  ])

  const securitySettings: SecuritySetting[] = [
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA",
      enabled: twoFactorEnabled,
      icon: <Smartphone className="h-5 w-5" />,
      type: "toggle",
      action: () => setTwoFactorEnabled(!twoFactorEnabled)
    },
    {
      id: "email-notifications",
      title: "Email Security Notifications",
      description: "Get notified of security events via email",
      enabled: emailNotifications,
      icon: <Mail className="h-5 w-5" />,
      type: "toggle",
      action: () => setEmailNotifications(!emailNotifications)
    },
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "Alert me when someone logs into my account",
      enabled: loginAlerts,
      icon: <AlertTriangle className="h-5 w-5" />,
      type: "toggle",
      action: () => setLoginAlerts(!loginAlerts)
    },
    {
      id: "session-timeout",
      title: "Automatic Session Timeout",
      description: "Automatically log out after period of inactivity",
      enabled: sessionTimeout,
      icon: <Clock className="h-5 w-5" />,
      type: "toggle",
      action: () => setSessionTimeout(!sessionTimeout)
    },
    {
      id: "data-encryption",
      title: "Data Encryption",
      description: "Encrypt sensitive data (always enabled)",
      enabled: dataEncryption,
      icon: <Lock className="h-5 w-5" />,
      type: "info"
    }
  ]

  const handlePasswordChange = () => {
    // Redirect to password change page
    window.location.href = "/auth/reset-password"
  }

  const handleDownloadSecurityReport = async () => {
    setLoading(true)
    try {
      // Mock download - in real app, this would generate and download a security report
      const report = {
        user_id: user?.id,
        generated_at: new Date().toISOString(),
        security_settings: securitySettings,
        recent_activity: recentActivity,
        account_created: user?.created_at,
        last_login: user?.last_sign_in_at
      }
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setSuccess("Security report downloaded successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to download security report")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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
          <h1 className="text-3xl font-bold mb-2">Security & Privacy</h1>
          <p className="text-muted-foreground">
            Manage your account security and privacy settings
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
          {/* Security Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Status
              </CardTitle>
              <CardDescription>Your account security overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-800">Strong Password</p>
                  <p className="text-sm text-green-600">Last changed 2 days ago</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-medium text-yellow-800">2FA Recommended</p>
                  <p className="text-sm text-yellow-600">Enable for better security</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium text-blue-800">Secure Connection</p>
                  <p className="text-sm text-blue-600">All traffic encrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {setting.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.type === 'toggle' && (
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={setting.action}
                      />
                    )}
                    {setting.type === 'info' && (
                      <Badge variant="secondary">Always On</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Password & Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>Manage your login credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={handlePasswordChange} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile/security">
                    <Eye className="h-4 w-4 mr-2" />
                    View Security Logs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Security Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
              <CardDescription>Your recent security-related actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getActivityIcon(activity.status)}
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.location} • {activity.device}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadSecurityReport}
                  disabled={loading}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? "Generating..." : "Download Security Report"}
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/settings/data">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Data Management
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SecuritySettingsPage() {
  return (
    <ProtectedRoute>
      <SecuritySettingsContent />
    </ProtectedRoute>
  )
}
