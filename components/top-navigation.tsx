"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, ShoppingBag, TrendingUp, User, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function TopNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/investments", label: "Investments", icon: TrendingUp },
    { href: "/choirs", label: "Choirs", icon: Briefcase },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
            <span className="text-white font-bold">5S</span>
          </div>
          <div className="font-semibold text-gray-900">5Sense</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="border-gray-200">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                      isActive ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
