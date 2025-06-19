"use client"

import { UserTour } from "@/components/user-tour"
import { TestModeBanner } from "@/components/test-mode-banner"
import Navbar from "@/components/navbar"
import BottomNavbar from "@/components/bottom-navbar"
import { BottomGlobalAds } from "@/components/advertising/ad-banner"

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {

  return (
    <UserTour>
      {/* Main layout container with responsive design */}
      <div className="flex flex-col min-h-screen bg-[#EBEBEB] overflow-x-hidden">
        <TestModeBanner />
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
      
      {/* Welcome Modal */}
      <WelcomeModal 
        open={showWelcome} 
        onOpenChange={setShowWelcome} 
      />
    </UserTour>
  )
}
