"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  // Check if we're in a not-found page
  const isNotFoundPage =
    typeof window !== "undefined" && (window.location.pathname === "/_not-found" || window.location.pathname === "/404")

  // If we're in a not-found page, don't wrap with providers
  if (isNotFoundPage) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
