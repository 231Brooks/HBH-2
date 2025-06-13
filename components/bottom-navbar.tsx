"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Building2,
  Calendar,
  User,
  BarChart,
  MessageSquare,
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { ClientOnly } from "@/components/client-only"

// Navigation items for bottom navbar
const bottomNavItems = [
  {
    name: "Progress",
    href: "/progress",
    icon: FileText,
    requiresAuth: true,
  },
  {
    name: "Services",
    href: "/services",
    icon: Building2,
    public: true,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: BarChart,
    public: true,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    requiresAuth: true,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    requiresAuth: true,
  },
]

export default function BottomNavbar() {
  const pathname = usePathname()
  const { user } = useSupabase()

  // Don't show bottom navbar on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null
  }

  // Filter navigation items based on authentication
  const navItems = bottomNavItems.filter(item => {
    if (item.public) return true
    if (item.requiresAuth && !user) return false
    return true
  })

  return (
    <ClientOnly>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <nav className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-200",
                  isActive 
                    ? "text-primary scale-105" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-colors",
                  isActive ? "text-primary" : "text-gray-500"
                )} />
                <span className={cn(
                  "text-xs leading-none truncate transition-colors",
                  isActive ? "text-primary font-semibold" : "text-gray-500"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          {/* Messages icon - show if user is authenticated */}
          {user && (
            <Link
              href="/messages"
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-200",
                pathname === "/messages" 
                  ? "text-primary scale-105" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className="relative">
                <MessageSquare className={cn(
                  "h-5 w-5 mb-1 transition-colors",
                  pathname === "/messages" ? "text-primary" : "text-gray-500"
                )} />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </div>
              <span className={cn(
                "text-xs leading-none truncate transition-colors",
                pathname === "/messages" ? "text-primary font-semibold" : "text-gray-500"
              )}>
                Messages
              </span>
            </Link>
          )}
        </nav>
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom navbar */}
      <div className="h-16 md:hidden" />
    </ClientOnly>
  )
}
