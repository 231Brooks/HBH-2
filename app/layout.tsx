import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { SupabaseProviderWrapper } from "@/components/supabase-provider-wrapper"
import { HeaderAd } from "@/components/ad-slots/header-ad"
import { FooterAd } from "@/components/ad-slots/footer-ad"
import { AdInitializer } from "@/components/ad-slots/ad-initializer"
import { PusherProvider } from "@/components/pusher-provider"

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PusherProvider>
            <SupabaseProviderWrapper>
              <div className="flex flex-col min-h-screen bg-[#EBEBEB]">
                <Navbar />

                {/* Header Ad Slot - Below Navbar */}
                <HeaderAd />

                <main className="flex-1">{children}</main>

                {/* Footer Ad Slot - Above Footer */}
                <FooterAd />

                {/* Initialize ads */}
                <AdInitializer />
              </div>
            </SupabaseProviderWrapper>
          </PusherProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
