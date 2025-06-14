import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SupabaseProviderWrapper } from "@/components/supabase-provider-wrapper"
import { LayoutClient } from "@/components/layout-client"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HBH - Homes in Better Hands",
  description: "All-in-One Real Estate Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SupabaseProviderWrapper>
            <LayoutClient>
              {children}
            </LayoutClient>
          </SupabaseProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
