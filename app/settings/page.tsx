"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Settings as SettingsIcon, 
  CreditCard, 
  Database, 
  Briefcase,
  Crown,
  ChevronRight,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { usePermissions } from "@/hooks/use-permissions"
import { ProtectedRoute } from "@/components/protected-route"

interface SettingsCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  badge?: string
  requiresRole?: string[]
  comingSoon?: boolean
}

function SettingsPageContent() {
  const { userRole, permissions } = usePermissions()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const settingsCategories: SettingsCategory[] = [
    {
      id: "account",
      title: "Account Settings",
      description: "Manage your profile information, account type, and basic settings",
      icon: <User className="h-6 w-6" />,
      href: "/settings/account",
    },
    {
      id: "security",
      title: "Security & Privacy",
      description: "Password, two-factor authentication, privacy settings, and security logs",
      icon: <Shield className="h-6 w-6" />,
      href: "/settings/security",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Email, push, and in-app notification preferences",
      icon: <Bell className="h-6 w-6" />,
      href: "/settings/notifications",
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Theme, custom CSS, and display preferences",
      icon: <Palette className="h-6 w-6" />,
      href: "/settings/appearance",
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Language, timezone, and dashboard layout settings",
      icon: <SettingsIcon className="h-6 w-6" />,
      href: "/settings/preferences",
    },
    {
      id: "subscription",
      title: "Subscription & Billing",
      description: "Manage your subscription plan, billing, and payment methods",
      icon: <CreditCard className="h-6 w-6" />,
      href: "/settings/subscription",
    },
    {
      id: "advertising",
      title: "Advertising",
      description: "Create and manage your advertisements across the platform",
      icon: <CreditCard className="h-6 w-6" />,
      href: "/advertising",
    },
    {
      id: "data",
      title: "Data & Privacy",
      description: "Data export, account deletion, and privacy controls",
      icon: <Database className="h-6 w-6" />,
      href: "/settings/data",
    },
    {
      id: "professional",
      title: "Professional Settings",
      description: "Service settings, business information, and professional tools",
      icon: <Briefcase className="h-6 w-6" />,
      href: "/settings/professional",
      requiresRole: ["PROFESSIONAL", "ADMIN"],
    },
    {
      id: "admin",
      title: "Admin Settings",
      description: "System settings, user management, and platform configuration",
      icon: <Crown className="h-6 w-6" />,
      href: "/settings/admin",
      requiresRole: ["ADMIN"],
      badge: "Admin Only",
    },
  ]

  // Filter categories based on user role and search query
  const filteredCategories = settingsCategories.filter(category => {
    // Check role requirements
    if (category.requiresRole && !category.requiresRole.includes(userRole)) {
      return false
    }

    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleCategoryClick = (category: SettingsCategory) => {
    if (category.comingSoon) {
      return // Don't navigate for coming soon items
    }
    router.push(category.href)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Settings Categories Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                category.comingSoon ? 'opacity-60' : 'hover:border-primary/50'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.title}
                        {category.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {category.badge}
                          </Badge>
                        )}
                        {category.comingSoon && (
                          <Badge variant="outline" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                  {!category.comingSoon && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/security">
                <Shield className="h-4 w-4 mr-2" />
                Security Check
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/appearance">
                <Palette className="h-4 w-4 mr-2" />
                Customize Theme
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/data">
                <Database className="h-4 w-4 mr-2" />
                Export Data
              </Link>
            </Button>
            {permissions.canAccessAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings/admin">
                  <Crown className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Check our{" "}
            <Link href="/help" className="text-primary hover:underline">
              Help Center
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}
