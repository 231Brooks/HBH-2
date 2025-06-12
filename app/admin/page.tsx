"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Users, 
  BarChart3, 
  Database, 
  Shield, 
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Zap
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

const adminSections = [
  {
    title: "System Diagnostics",
    description: "Check system health and environment variables",
    href: "/admin/diagnostics",
    icon: <Activity className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Database Optimizations",
    description: "Manage database performance and optimizations",
    href: "/admin/db-optimizations",
    icon: <Database className="h-6 w-6" />,
    status: "warning"
  },
  {
    title: "Performance Monitoring",
    description: "Monitor application performance metrics",
    href: "/admin/performance",
    icon: <TrendingUp className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Environment Validator",
    description: "Validate environment configuration",
    href: "/admin/env-validator",
    icon: <Shield className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Deployment Status",
    description: "Check deployment and build status",
    href: "/admin/deployment-status",
    icon: <Zap className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Git Diagnostics",
    description: "Git repository and version information",
    href: "/admin/git-diagnostics",
    icon: <FileText className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Fee Management",
    description: "Manage platform fees and pricing",
    href: "/admin/fees",
    icon: <DollarSign className="h-6 w-6" />,
    status: "healthy"
  },
  {
    title: "Ad Management",
    description: "Manage advertisements and promotions",
    href: "/admin/ads",
    icon: <BarChart3 className="h-6 w-6" />,
    status: "healthy"
  }
]

const systemStats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: <Users className="h-4 w-4" />
  },
  {
    title: "Active Properties",
    value: "456",
    change: "+8%",
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    title: "Monthly Revenue",
    value: "$12,345",
    change: "+15%",
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "Stable",
    icon: <Activity className="h-4 w-4" />
  }
]

function AdminDashboardContent() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-50 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System management and monitoring tools
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Administrator
          </Badge>
        </div>

        {/* System Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">System Management</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(section.status)}>
                      {getStatusIcon(section.status)}
                      <span className="ml-1 capitalize">{section.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={section.href}>
                      Access {section.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild>
              <Link href="/admin/diagnostics">
                <Activity className="h-4 w-4 mr-2" />
                Run System Check
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/db-optimizations">
                <Database className="h-4 w-4 mr-2" />
                Optimize Database
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/performance">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication Service</span>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Limited
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <RoleGuard 
        requiredPermission="canAccessAdmin"
        fallback={
          <div className="container py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You need Administrator privileges to access this area.
              </p>
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        }
      >
        <AdminDashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
