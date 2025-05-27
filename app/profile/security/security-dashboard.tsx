"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, Clock, Lock } from "lucide-react"

interface SecurityDashboardProps {
  userId: string
  initialLogs: any[]
}

export default function SecurityDashboard({ userId, initialLogs }: SecurityDashboardProps) {
  const [logs, setLogs] = useState(initialLogs)
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Format date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  // Get action display name
  const getActionDisplay = (action: string) => {
    const actionMap: Record<string, string> = {
      login_success: "Successful login",
      login_failure: "Failed login attempt",
      logout: "Logout",
      password_change: "Password changed",
      email_change: "Email address changed",
      account_locked: "Account locked",
      account_unlocked: "Account unlocked",
      two_factor_enabled: "Two-factor authentication enabled",
      two_factor_disabled: "Two-factor authentication disabled",
      verification_requested: "Verification requested",
      verification_completed: "Verification completed",
      admin_action: "Admin action",
      api_key_created: "API key created",
      api_key_revoked: "API key revoked",
      suspicious_activity: "Suspicious activity detected",
    }

    return actionMap[action] || action
  }

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes("login_failure") || action.includes("suspicious") || action.includes("locked")) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }

    if (action.includes("two_factor") || action.includes("password") || action.includes("api_key")) {
      return <Lock className="h-4 w-4 text-blue-500" />
    }

    return <Clock className="h-4 w-4 text-gray-500" />
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity Log</TabsTrigger>
        <TabsTrigger value="settings">Security Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Your account security overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className={twoFactorEnabled ? "text-green-500" : "text-amber-500"} />
                    <span>Two-factor authentication</span>
                  </div>
                  <span className={twoFactorEnabled ? "text-green-500" : "text-amber-500"}>
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="text-green-500" />
                    <span>Password strength</span>
                  </div>
                  <span className="text-green-500">Strong</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-green-500" />
                    <span>Last login</span>
                  </div>
                  <span>
                    {logs.find((log) => log.action === "login_success")
                      ? formatDate(logs.find((log) => log.action === "login_success").createdAt)
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                Run Security Check
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    {getActionIcon(log.action)}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{getActionDisplay(log.action)}</p>
                      <p className="text-xs text-gray-500">{formatDate(log.createdAt)}</p>
                      {log.details && <p className="text-xs">{log.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => {}}>
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>

        {!twoFactorEnabled && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Enhance Your Security</AlertTitle>
            <AlertDescription>
              Enable two-factor authentication to add an extra layer of security to your account.
              <Button variant="link" className="p-0 h-auto ml-2" onClick={() => {}}>
                Enable now
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Security Activity Log</CardTitle>
            <CardDescription>Complete history of security events for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2 pb-3 border-b border-gray-100">
                  {getActionIcon(log.action)}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{getActionDisplay(log.action)}</p>
                    <p className="text-xs text-gray-500">{formatDate(log.createdAt)}</p>
                    {log.details && <p className="text-xs">{log.details}</p>}
                    {log.ip && <p className="text-xs text-gray-500">IP: {log.ip}</p>}
                    {log.userAgent && (
                      <p className="text-xs text-gray-500">Device: {log.userAgent.substring(0, 50)}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" disabled={loading} onClick={() => {}}>
              Load More
            </Button>
            <Button variant="ghost" onClick={() => {}}>
              Export Log
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account by requiring a verification code in addition to your
                password.
              </p>
              <Button variant={twoFactorEnabled ? "destructive" : "default"} onClick={() => {}}>
                {twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-sm text-gray-500">Change your password regularly to keep your account secure.</p>
              <Button variant="outline" onClick={() => {}}>
                Change Password
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-lg font-medium">Login Sessions</h3>
              <p className="text-sm text-gray-500">Review and manage your active login sessions.</p>
              <Button variant="outline" onClick={() => {}}>
                Manage Sessions
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-lg font-medium">Security Notifications</h3>
              <p className="text-sm text-gray-500">
                Get notified about important security events related to your account.
              </p>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="security-notifications" className="rounded" />
                <label htmlFor="security-notifications">Enable security notifications</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
