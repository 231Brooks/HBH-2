"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

// Base navigation items - these will be filtered based on user permissions
const baseNavItems = [
  { name: "Home", href: "/", icon: <Home className="h-5 w-5" />, public: true },
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
  const navItems = baseNavItems.filter(item => {
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
          <Link href="/" className="font-bold text-xl">
            HBH
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center text-sm font-medium transition-colors hover:text-primary",
                    pathname?.startsWith(item.href) ? "text-primary" : "text-muted-foreground",
                  )}
                  title={item.name}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.name}</span>
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
                      <Link href="/messages">
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Messages</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/notifications">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notifications</span>
                      </Link>
                    </Button>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt="User" />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {permissions.canAccessAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                        pathname?.startsWith(item.href) ? "text-primary bg-muted" : "text-muted-foreground",
                      )}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/messages">
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/notifications">
                        <Bell className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
