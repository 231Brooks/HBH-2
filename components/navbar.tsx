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

const navItems = [
  { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
  { name: "Progress", href: "/progress", icon: <FileText className="h-5 w-5" /> },
  { name: "Services", href: "/services", icon: <Building2 className="h-5 w-5" /> },
  { name: "Marketplace", href: "/marketplace", icon: <BarChart className="h-5 w-5" /> },
  { name: "Calendar", href: "/calendar", icon: <Calendar className="h-5 w-5" /> },
  { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
]

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)

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
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>HB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
