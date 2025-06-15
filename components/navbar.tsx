"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Bell,
  MessageSquare,
  FileText,
  Building2,
  Calendar,
  User,
  Home,
  Settings,
  LogOut,
  BarChart,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
import { ClientOnly } from "@/components/client-only"
import { StartTourButton } from "@/components/user-tour"

// Desktop navigation items - these will be filtered based on user permissions
const getDesktopNavItems = (isProfessional: boolean) => [
  { name: "Progress", href: "/progress", icon: <FileText className="h-5 w-5" />, requiresAuth: true },
  {
    name: isProfessional ? "Service Requests" : "Services",
    href: "/services",
    icon: isProfessional ? <MessageSquare className="h-5 w-5" /> : <Building2 className="h-5 w-5" />,
    public: true
  },
  { name: "Marketplace", href: "/marketplace", icon: <BarChart className="h-5 w-5" />, public: true },
  { name: "Calendar", href: "/calendar", icon: <Calendar className="h-5 w-5" />, requiresAuth: true },
  { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" />, requiresAuth: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, supabase, loading, isHydrated } = useSupabase()
  const { permissions, isProfessional } = usePermissions()

  // Get navigation items based on user type
  const desktopNavItems = getDesktopNavItems(isProfessional)

  // Filter navigation items based on authentication and permissions
  const navItems = desktopNavItems.filter(item => {
    if (item.public) return true
    if (item.requiresAuth && !user) return false
    return true
  })

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // The auth state change will be handled by the context
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b shadow-sm" : "bg-white border-b",
      )}
    >
      {/* Responsive container with proper padding and overflow handling */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0 flex-shrink-0">
          <Link href="/" className="font-bold text-lg sm:text-xl flex items-center gap-2 flex-shrink-0">
            <Home className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden sm:inline">HBH</span>
          </Link>

          {/* Desktop navigation with responsive spacing */}
          {!isMobile && (
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tour={`${item.name.toLowerCase().replace(/\s+/g, '-')}-nav`}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-md whitespace-nowrap",
                    pathname?.startsWith(item.href) ? "text-primary bg-muted" : "text-muted-foreground",
                  )}
                  title={item.name}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right side actions with responsive spacing */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ClientOnly
            fallback={
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            }
          >
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : user ? (
              <>
                {/* Tour button for authenticated users */}
                <StartTourButton />

                {/* Notifications button */}
                <Button variant="outline" size="icon" asChild>
                  <Link href="/notifications">
                    <div className="relative">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </div>
                    <span className="sr-only">Notifications</span>
                  </Link>
                </Button>

                {/* Messages button */}
                <Button variant="outline" size="icon" asChild>
                  <Link href="/messages">
                    <div className="relative">
                      <MessageSquare className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </div>
                    <span className="sr-only">Messages</span>
                  </Link>
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                      <span className="sr-only">Profile menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {permissions.canAccessAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </header>
  )
}
