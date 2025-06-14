import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import BottomNavbar from "@/components/bottom-navbar"
import { BottomGlobalAds } from "@/components/advertising/ad-banner"
import { SupabaseProviderWrapper } from "@/components/supabase-provider-wrapper"

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
            {/* Main layout container with responsive design */}
            <div className="flex flex-col min-h-screen bg-[#EBEBEB] overflow-x-hidden">
              <Navbar />
              {/* Main content area with proper responsive spacing */}
              <main className="flex-1 w-full max-w-full pb-safe pb-16 md:pb-4 px-0">
                <div className="w-full max-w-full overflow-x-hidden">
                  {children}
                </div>
              </main>
              <BottomGlobalAds />
              <BottomNavbar />
            </div>
          </SupabaseProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
