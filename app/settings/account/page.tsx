"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Briefcase,
  Shield,
  Crown
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
import { ProtectedRoute } from "@/components/protected-route"
import { AccountTypeSelector } from "@/components/account-type-selector"
import { ROLE_DESCRIPTIONS, type UserRole } from "@/lib/user-roles"

function AccountSettingsContent() {
  const { supabase, user } = useSupabase()
  const { userRole, permissions } = usePermissions()
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  // Initialize form data
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || user.user_metadata?.full_name || "")
      setEmail(user.email || "")
      setPhone(user.user_metadata?.phone || "")
      setLocation(user.user_metadata?.location || "")
      setBio(user.user_metadata?.bio || "")
      setSelectedRole((user.user_metadata?.role || 'USER') as UserRole)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    if (!supabase || !user) {
      setError("Authentication system is not available. Please try again later.")
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          name,
          full_name: name,
          phone,
          location,
          bio
        },
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (newRole: UserRole) => {
    setRoleLoading(true)
    setError("")
    setSuccess(false)

    if (!supabase || !user) {
      setError("Authentication system is not available. Please try again later.")
      setRoleLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          role: newRole
        },
      })

      if (updateError) {
        throw updateError
      }

      setSelectedRole(newRole)
      setShowRoleSelector(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error("Role update error:", err)
      setError(err.message || "Failed to update account type. Please try again.")
    } finally {
      setRoleLoading(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'USER':
        return <User className="h-5 w-5" />
      case 'PROFESSIONAL':
        return <Briefcase className="h-5 w-5" />
      case 'ADMIN':
        return <Crown className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
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
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account preferences
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Settings updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Account Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon(userRole)}
                Account Type
              </CardTitle>
              <CardDescription>Your current account type and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {ROLE_DESCRIPTIONS[userRole].title}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ROLE_DESCRIPTIONS[userRole].description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  disabled={roleLoading}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Change Type
                </Button>
              </div>

              {showRoleSelector && (
                <div className="border-t pt-4">
                  <AccountTypeSelector
                    selectedRole={selectedRole}
                    onRoleSelect={handleRoleUpdate}
                    disabled={roleLoading}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRoleSelector(false)}
                      disabled={roleLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Your Permissions:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(permissions).filter(([_, value]) => value).slice(0, 8).map(([key, _]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="name" 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="pl-10"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        className="pl-10"
                        disabled 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here. Use security settings to update your email.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="pl-10"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="location" 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="pl-10"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>

                <Button type="submit" disabled={loading || !supabase}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Account Created</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Last Sign In</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Related Settings</CardTitle>
              <CardDescription>Quick access to related settings</CardDescription>
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
                    <Mail className="h-4 w-4 mr-2" />
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

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      <AccountSettingsContent />
    </ProtectedRoute>
  )
}
