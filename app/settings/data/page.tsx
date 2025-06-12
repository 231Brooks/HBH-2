"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Database, 
  Download, 
  Trash2, 
  Shield,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Users,
  Globe,
  Settings,
  Bell
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { ProtectedRoute } from "@/components/protected-route"

function DataPrivacySettingsContent() {
  const { supabase, user } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState("public") // public, private, contacts
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [allowMessages, setAllowMessages] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)
  const [analyticsTracking, setAnalyticsTracking] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Data management state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleExportData = async () => {
    setExportLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock data export - in real app, this would generate comprehensive data export
      const userData = {
        profile: {
          id: user?.id,
          email: user?.email,
          name: user?.user_metadata?.name,
          created_at: user?.created_at,
          last_sign_in: user?.last_sign_in_at
        },
        settings: {
          profileVisibility,
          showEmail,
          showPhone,
          allowMessages,
          dataCollection,
          analyticsTracking,
          marketingEmails
        },
        // Mock additional data
        transactions: [],
        messages: [],
        properties: [],
        services: [],
        calendar_events: []
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hbh-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Data export completed successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to export data. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setError("")

    try {
      // In a real app, this would:
      // 1. Delete user data from all tables
      // 2. Anonymize or delete associated records
      // 3. Send confirmation email
      // 4. Log the user out
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, we'll just show a success message
      // In reality, this would redirect to a goodbye page
      alert("Account deletion initiated. You will receive a confirmation email.")
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete account. Please contact support.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSavePrivacySettings = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock API call - in real app, this would save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Privacy settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save privacy settings. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const dataCategories = [
    {
      name: "Profile Information",
      description: "Name, email, phone, profile picture",
      size: "2.3 KB",
      lastUpdated: "2 days ago"
    },
    {
      name: "Transaction Data",
      description: "Property transactions, progress tracking",
      size: "45.7 KB",
      lastUpdated: "1 hour ago"
    },
    {
      name: "Messages & Communications",
      description: "Chat messages, notifications, emails",
      size: "12.1 KB",
      lastUpdated: "3 hours ago"
    },
    {
      name: "Calendar & Appointments",
      description: "Scheduled events, reminders, availability",
      size: "8.9 KB",
      lastUpdated: "1 day ago"
    },
    {
      name: "Usage Analytics",
      description: "Page views, feature usage, performance data",
      size: "156.2 KB",
      lastUpdated: "5 minutes ago"
    }
  ]

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
          <h1 className="text-3xl font-bold mb-2">Data & Privacy</h1>
          <p className="text-muted-foreground">
            Manage your data, privacy settings, and account deletion
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
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control who can see your information and how it's used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <div className="grid gap-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={profileVisibility === "public"}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-muted-foreground">Anyone can see your profile</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="contacts"
                        checked={profileVisibility === "contacts"}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Contacts Only</div>
                        <div className="text-xs text-muted-foreground">Only people you've interacted with</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={profileVisibility === "private"}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-muted-foreground">Only you can see your profile</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Email Address</Label>
                      <p className="text-xs text-muted-foreground">Display email on your profile</p>
                    </div>
                    <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Phone Number</Label>
                      <p className="text-xs text-muted-foreground">Display phone on your profile</p>
                    </div>
                    <Switch checked={showPhone} onCheckedChange={setShowPhone} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Allow Messages</Label>
                      <p className="text-xs text-muted-foreground">Let others send you messages</p>
                    </div>
                    <Switch checked={allowMessages} onCheckedChange={setAllowMessages} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Receive promotional emails</p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Data Collection & Analytics</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Usage Analytics</Label>
                      <p className="text-xs text-muted-foreground">Help improve our platform</p>
                    </div>
                    <Switch checked={analyticsTracking} onCheckedChange={setAnalyticsTracking} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Data Collection</Label>
                      <p className="text-xs text-muted-foreground">Collect data for personalization</p>
                    </div>
                    <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePrivacySettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Your Data
              </CardTitle>
              <CardDescription>Overview of data we store about you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{category.size}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {category.lastUpdated}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Export or delete your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Export Your Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download a copy of all your data in JSON format
                  </p>
                  <Button 
                    onClick={handleExportData} 
                    disabled={exportLoading}
                    className="w-full"
                  >
                    {exportLoading ? "Preparing Export..." : "Export Data"}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Delete Account
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Warning:</strong> All your transactions, messages, calendar events, and other data will be permanently deleted.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <h4 className="font-medium">What will be deleted:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Your profile and account information</li>
                            <li>• All transaction and progress data</li>
                            <li>• Messages and communications</li>
                            <li>• Calendar events and appointments</li>
                            <li>• Property listings and services</li>
                            <li>• Custom settings and preferences</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : "Delete Account"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Data Retention Policy</h4>
                <p className="text-sm text-blue-700">
                  We retain your data for as long as your account is active. After account deletion, 
                  some data may be retained for legal compliance for up to 7 years, but will be 
                  anonymized and not linked to your identity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <CardTitle>Related Settings</CardTitle>
              <CardDescription>Quick access to related privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" asChild>
                  <Link href="/settings/security">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/settings/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
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

export default function DataPrivacySettingsPage() {
  return (
    <ProtectedRoute>
      <DataPrivacySettingsContent />
    </ProtectedRoute>
  )
}
