"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { 
  ArrowLeft, 
  Crown, 
  Shield, 
  Database,
  Users,
  Settings,
  BarChart,
  Mail,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  Server,
  Activity,
  FileText,
  Clock,
  Zap
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

function AdminSettingsContent() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // System Settings
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(true)
  const [maxFileUploadSize, setMaxFileUploadSize] = useState([10]) // MB
  const [sessionTimeout, setSessionTimeout] = useState("30") // minutes
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5")

  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [passwordMinLength, setPasswordMinLength] = useState([8])
  const [passwordComplexity, setPasswordComplexity] = useState("medium")
  const [ipWhitelisting, setIpWhitelisting] = useState(false)
  const [auditLogging, setAuditLogging] = useState(true)

  // Email Settings
  const [emailProvider, setEmailProvider] = useState("sendgrid")
  const [emailFromName, setEmailFromName] = useState("HBH Platform")
  const [emailFromAddress, setEmailFromAddress] = useState("noreply@hbh.com")
  const [emailRateLimit, setEmailRateLimit] = useState("100") // per hour

  // Performance Settings
  const [cacheEnabled, setCacheEnabled] = useState(true)
  const [cacheTtl, setCacheTtl] = useState("3600") // seconds
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [cdnEnabled, setCdnEnabled] = useState(false)

  // Feature Flags
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(true)
  const [calendarEnabled, setCalendarEnabled] = useState(true)
  const [messagesEnabled, setMessagesEnabled] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(false)

  // System Stats (mock data)
  const systemStats = {
    totalUsers: 1234,
    activeUsers: 456,
    totalTransactions: 789,
    systemUptime: "99.9%",
    avgResponseTime: "245ms",
    storageUsed: "2.3 GB",
    bandwidthUsed: "45.2 GB"
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock API call - in real app, this would save admin settings
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess("Admin settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save admin settings. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSystemRestart = async () => {
    if (!confirm("Are you sure you want to restart the system? This will cause temporary downtime.")) {
      return
    }

    setLoading(true)
    try {
      // Mock system restart
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess("System restart initiated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to restart system.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard requiredRole="ADMIN">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Admin Settings
            </h1>
            <p className="text-muted-foreground">
              System administration and platform configuration
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
            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Overview
                </CardTitle>
                <CardDescription>Current system status and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{systemStats.totalUsers}</p>
                    <p className="text-sm text-blue-600">Total Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{systemStats.activeUsers}</p>
                    <p className="text-sm text-green-600">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">{systemStats.totalTransactions}</p>
                    <p className="text-sm text-purple-600">Transactions</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Server className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-700">{systemStats.systemUptime}</p>
                    <p className="text-sm text-orange-600">Uptime</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-3 text-sm">
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <Badge variant="outline">{systemStats.avgResponseTime}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Used:</span>
                    <Badge variant="outline">{systemStats.storageUsed}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth Used:</span>
                    <Badge variant="outline">{systemStats.bandwidthUsed}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Core system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Maintenance Mode</Label>
                      <p className="text-xs text-muted-foreground">Disable public access</p>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">User Registration</Label>
                      <p className="text-xs text-muted-foreground">Allow new user signups</p>
                    </div>
                    <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Verification</Label>
                      <p className="text-xs text-muted-foreground">Require email verification</p>
                    </div>
                    <Switch checked={emailVerificationRequired} onCheckedChange={setEmailVerificationRequired} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Max File Upload Size</Label>
                      <Badge variant="outline">{maxFileUploadSize[0]} MB</Badge>
                    </div>
                    <Slider
                      value={maxFileUploadSize}
                      onValueChange={setMaxFileUploadSize}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Session Timeout (min)</Label>
                      <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Max Login Attempts</Label>
                      <Select value={maxLoginAttempts} onValueChange={setMaxLoginAttempts}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Platform security configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require 2FA for All Users</Label>
                      <p className="text-xs text-muted-foreground">Mandatory two-factor authentication</p>
                    </div>
                    <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">IP Whitelisting</Label>
                      <p className="text-xs text-muted-foreground">Restrict access by IP address</p>
                    </div>
                    <Switch checked={ipWhitelisting} onCheckedChange={setIpWhitelisting} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Audit Logging</Label>
                      <p className="text-xs text-muted-foreground">Log all admin actions</p>
                    </div>
                    <Switch checked={auditLogging} onCheckedChange={setAuditLogging} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Password Min Length</Label>
                      <Badge variant="outline">{passwordMinLength[0]} characters</Badge>
                    </div>
                    <Slider
                      value={passwordMinLength}
                      onValueChange={setPasswordMinLength}
                      max={20}
                      min={6}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Password Complexity</Label>
                    <Select value={passwordComplexity} onValueChange={setPasswordComplexity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (letters only)</SelectItem>
                        <SelectItem value="medium">Medium (letters + numbers)</SelectItem>
                        <SelectItem value="high">High (letters + numbers + symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Settings
                  </CardTitle>
                  <CardDescription>Email service configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Provider</Label>
                    <Select value={emailProvider} onValueChange={setEmailProvider}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="smtp">Custom SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input 
                        value={emailFromName} 
                        onChange={(e) => setEmailFromName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>From Address</Label>
                      <Input 
                        value={emailFromAddress} 
                        onChange={(e) => setEmailFromAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rate Limit (emails/hour)</Label>
                    <Select value={emailRateLimit} onValueChange={setEmailRateLimit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 per hour</SelectItem>
                        <SelectItem value="100">100 per hour</SelectItem>
                        <SelectItem value="500">500 per hour</SelectItem>
                        <SelectItem value="1000">1000 per hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Settings
                  </CardTitle>
                  <CardDescription>Optimize system performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enable Caching</Label>
                      <p className="text-xs text-muted-foreground">Cache frequently accessed data</p>
                    </div>
                    <Switch checked={cacheEnabled} onCheckedChange={setCacheEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Compression</Label>
                      <p className="text-xs text-muted-foreground">Compress responses</p>
                    </div>
                    <Switch checked={compressionEnabled} onCheckedChange={setCompressionEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">CDN</Label>
                      <p className="text-xs text-muted-foreground">Content delivery network</p>
                    </div>
                    <Switch checked={cdnEnabled} onCheckedChange={setCdnEnabled} />
                  </div>

                  {cacheEnabled && (
                    <div className="space-y-2">
                      <Label>Cache TTL (seconds)</Label>
                      <Select value={cacheTtl} onValueChange={setCacheTtl}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">5 minutes</SelectItem>
                          <SelectItem value="1800">30 minutes</SelectItem>
                          <SelectItem value="3600">1 hour</SelectItem>
                          <SelectItem value="86400">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Feature Flags
                </CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Marketplace</Label>
                    <Switch checked={marketplaceEnabled} onCheckedChange={setMarketplaceEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Calendar</Label>
                    <Switch checked={calendarEnabled} onCheckedChange={setCalendarEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Messages</Label>
                    <Switch checked={messagesEnabled} onCheckedChange={setMessagesEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Analytics</Label>
                    <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Beta Features</Label>
                    <Switch checked={betaFeaturesEnabled} onCheckedChange={setBetaFeaturesEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleSystemRestart} disabled={loading}>
                <Server className="h-4 w-4 mr-2" />
                Restart System
              </Button>
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Admin Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute>
      <AdminSettingsContent />
    </ProtectedRoute>
  )
}
