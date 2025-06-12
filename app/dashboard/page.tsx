"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Building2, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { usePermissions } from "@/hooks/use-permissions"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

function DashboardContent() {
  const { userRole, permissions, isUser, isProfessional, isAdmin } = usePermissions()

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
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your account.
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your account type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
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
              <CardDescription>Your latest updates and notifications</CardDescription>
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
