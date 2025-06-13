"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  User,
  Briefcase,
  Shield,
  Settings,
  Home,
  Building2,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "@/contexts/supabase-context"
import { ProtectedRoute } from "@/components/protected-route"
import { usePermissions } from "@/hooks/use-permissions"
import { AccountTypeSelector } from "@/components/account-type-selector"
import { RoleGuard } from "@/components/role-guard"
import { ROLE_DESCRIPTIONS, type UserRole } from "@/lib/user-roles"

function ProfilePageContent() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { userRole, permissions } = usePermissions()
  const [name, setName] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole)
  const [loading, setLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  // Set initial name and role from user metadata when user is available
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "")
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
        data: { name },
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
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
    } catch (err: any) {
      console.error("Role update error:", err)
      setError(err.message || "Failed to update account type. Please try again.")
    } finally {
      setRoleLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (err) {
      console.error("Sign out error:", err)
      setError("Failed to sign out")
    }
  }

  // User is guaranteed to be available in ProtectedRoute

  // Dashboard data
  const quickActions = [
    {
      title: "Browse Properties",
      description: "Find your next home or investment",
      href: "/marketplace",
      icon: <Building2 className="h-5 w-5" />,
      show: true
    },
    {
      title: "List Property",
      description: "Add a new property listing",
      href: "/marketplace/create",
      icon: <Plus className="h-5 w-5" />,
      show: permissions.canCreateProperty
    },
    {
      title: "Create Service",
      description: "Offer your professional services",
      href: "/services/create",
      icon: <Plus className="h-5 w-5" />,
      show: permissions.canCreateService
    },
    {
      title: "Post Job",
      description: "Hire professionals for your project",
      href: "/job-marketplace/post-job",
      icon: <Plus className="h-5 w-5" />,
      show: permissions.canPostJobs
    },
    {
      title: "Find Work",
      description: "Browse available job opportunities",
      href: "/job-marketplace",
      icon: <TrendingUp className="h-5 w-5" />,
      show: permissions.canApplyToJobs
    },
    {
      title: "Admin Panel",
      description: "Manage system settings",
      href: "/admin",
      icon: <Settings className="h-5 w-5" />,
      show: permissions.canAccessAdmin
    }
  ].filter(action => action.show)

  const stats = [
    {
      title: "Active Transactions",
      value: "3",
      description: "In progress",
      icon: <FileText className="h-4 w-4" />,
      show: true
    },
    {
      title: "Properties Listed",
      value: "12",
      description: "Currently active",
      icon: <Building2 className="h-4 w-4" />,
      show: permissions.canCreateProperty
    },
    {
      title: "Services Offered",
      value: "5",
      description: "Professional services",
      icon: <Users className="h-4 w-4" />,
      show: permissions.canCreateService
    },
    {
      title: "Total Users",
      value: "1,234",
      description: "Platform members",
      icon: <Users className="h-4 w-4" />,
      show: permissions.canViewAllUsers
    }
  ].filter(stat => stat.show)

  const recentActivity = [
    {
      title: "New message from John Doe",
      time: "2 minutes ago",
      type: "message",
      show: true
    },
    {
      title: "Property inspection scheduled",
      time: "1 hour ago",
      type: "appointment",
      show: true
    },
    {
      title: "Service request received",
      time: "3 hours ago",
      type: "service",
      show: permissions.canCreateService
    },
    {
      title: "New user registered",
      time: "5 hours ago",
      type: "admin",
      show: permissions.canViewAllUsers
    }
  ].filter(activity => activity.show)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile & Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your account and see what's happening.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {userRole === 'USER' && 'Regular User'}
            {userRole === 'PROFESSIONAL' && 'Service Professional'}
            {userRole === 'ADMIN' && 'Administrator'}
          </Badge>
        </div>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your account type</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  asChild
                >
                  <Link href={action.href}>
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {/* Account Type Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {userRole === 'USER' && <User className="h-5 w-5" />}
                {userRole === 'PROFESSIONAL' && <Briefcase className="h-5 w-5" />}
                {userRole === 'ADMIN' && <Shield className="h-5 w-5" />}
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

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                  <p className="text-sm text-muted-foreground">
                    Your email address is your unique identifier and cannot be changed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <Button type="submit" disabled={loading || !supabase}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" asChild>
                <Link href="/auth/reset-password">Change Password</Link>
              </Button>

              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Need help? Contact our support team.</p>
            </CardFooter>
          </Card>
          </div>
        </div>

        {/* Role-specific sections */}
        <RoleGuard requiredRole="PROFESSIONAL" showError={false}>
          <Card>
            <CardHeader>
              <CardTitle>Professional Dashboard</CardTitle>
              <CardDescription>Manage your services and client relationships</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link href="/services">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Services
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/job-marketplace">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Find Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>

        <RoleGuard requiredRole="ADMIN" showError={false}>
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>System management and analytics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link href="/admin/diagnostics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  System Health
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/performance">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance
                </Link>
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
