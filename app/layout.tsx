import type React from "react"
import { Inter } from "next/font/google"
import { TopNavigation } from "@/components/top-navigation"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "5Sense Platform",
  description: "Your all-in-one platform for services, products, and investments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <TopNavigation />
          <div className="flex-1 bg-gray-50">{children}</div>
          <NotificationProvider />
        </div>
      </body>
    </html>
  )
}
