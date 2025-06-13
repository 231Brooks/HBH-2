"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Bell,
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
import { ClientOnly } from "@/components/client-only"

// Desktop navigation items - these will be filtered based on user permissions
const desktopNavItems = [
  { name: "Progress", href: "/progress", icon: <FileText className="h-5 w-5" />, requiresAuth: true },
  { name: "Services", href: "/services", icon: <Building2 className="h-5 w-5" />, public: true },
  { name: "Marketplace", href: "/marketplace", icon: <BarChart className="h-5 w-5" />, public: true },
  { name: "Calendar", href: "/calendar", icon: <Calendar className="h-5 w-5" />, requiresAuth: true },
  { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" />, requiresAuth: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, supabase, loading, isHydrated } = useSupabase()
  const { permissions } = usePermissions()

  // Filter navigation items based on authentication and permissions
  const navItems = desktopNavItems.filter(item => {
    if (item.public) return true
    if (item.requiresAuth && !user) return false
    return true
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b shadow-sm" : "bg-white border-b",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="hidden sm:inline">HBH</span>
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-md",
                    pathname?.startsWith(item.href) ? "text-primary bg-muted" : "text-muted-foreground",
                  )}
                  title={item.name}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
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
                {!isMobile && (
                  <>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/notifications">
                        <div className="relative">
                          <Bell className="h-4 w-4" />
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </div>
                        <span className="sr-only">Notifications</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/messages">
                        <div className="relative">
                          <MessageSquare className="h-4 w-4" />
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </div>
                        <span className="sr-only">Messages</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4" />
                        <span className="sr-only">Profile</span>
                      </Link>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </ClientOnly>

          {isMobile && user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="text-sm font-medium text-muted-foreground mb-4">
                    Quick Actions
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/messages">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    {permissions.canAccessAdmin && (
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
