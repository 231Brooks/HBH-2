"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  Building2,
  Calendar,
  User,
  BarChart,
  MessageSquare,
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
import { ClientOnly } from "@/components/client-only"

// Navigation items for bottom navbar
const getBottomNavItems = (isProfessional: boolean) => [
  {
    name: "Progress",
    href: "/progress",
    icon: FileText,
    requiresAuth: true,
  },
  {
    name: isProfessional ? "Service Requests" : "Services",
    href: "/services",
    icon: isProfessional ? MessageSquare : Building2,
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
  const { isProfessional } = usePermissions()

  // Don't show bottom navbar on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null
  }

  // Get navigation items based on user type
  const bottomNavItems = getBottomNavItems(isProfessional)

  // Filter navigation items based on authentication
  const navItems = bottomNavItems.filter(item => {
    if (item.public) return true
    if (item.requiresAuth && !user) return false
    return true
  })

  return (
    <ClientOnly>
      {/* Fixed bottom navigation with responsive design and safe area support */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-inset-bottom">
        <nav className="flex items-center justify-around h-16 px-2 max-w-full overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-all duration-200 max-w-[20%]",
                  isActive
                    ? "text-primary scale-105"
                    : "text-gray-500 hover:text-gray-700 active:scale-95"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 mb-1 transition-colors flex-shrink-0",
                  isActive ? "text-primary" : "text-gray-500"
                )} />
                <span className={cn(
                  "text-[10px] sm:text-xs leading-none truncate transition-colors w-full text-center",
                  isActive ? "text-primary font-semibold" : "text-gray-500"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Spacer to prevent content from being hidden behind bottom navbar with safe area support */}
      <div className="h-16 md:hidden pb-safe" />
    </ClientOnly>
  )
}
