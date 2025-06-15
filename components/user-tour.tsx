"use client"

import { useState, useEffect } from "react"
import { TourProvider, useTour } from "@reactour/tour"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"
import { usePermissions } from "@/hooks/use-permissions"

interface TourStep {
  selector: string
  content: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  action?: () => void
}

interface UserTourProps {
  children: React.ReactNode
}

// Tour steps for different user types
const getBuyerTourSteps = (): TourStep[] => [
  {
    selector: '[data-tour="marketplace-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Welcome to HBH! 🏠</h3>
        <p>Let's start by exploring the Marketplace where you can browse properties for sale.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="services-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Find Services 🔧</h3>
        <p>Need help with your real estate transaction? Browse professional services like inspections, appraisals, and more.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="progress-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Track Progress 📊</h3>
        <p>Once you start a transaction, use the Progress section to track milestones, documents, and communicate with your team.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="calendar-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Schedule Appointments 📅</h3>
        <p>Book property viewings, inspections, and meetings with your real estate team all in one place.</p>
      </div>
    ),
    position: "bottom"
  }
]

const getSellerTourSteps = (): TourStep[] => [
  {
    selector: '[data-tour="marketplace-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Welcome Seller! 🏡</h3>
        <p>Start by listing your property in the Marketplace to reach potential buyers.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="services-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Professional Services 🔧</h3>
        <p>Find photographers, staging professionals, and other services to help sell your property faster.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="progress-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Manage Transactions 📊</h3>
        <p>Track offers, manage documents, and coordinate with buyers and title companies.</p>
      </div>
    ),
    position: "bottom"
  }
]

const getProfessionalTourSteps = (): TourStep[] => [
  {
    selector: '[data-tour="services-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Welcome Professional! 💼</h3>
        <p>This is your Service Dashboard where you can find jobs, manage requests, and grow your business.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="advertising-tab"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Advertise Your Services 📢</h3>
        <p>Boost your visibility with targeted advertising. Create ads to reach more potential clients.</p>
      </div>
    ),
    position: "top"
  },
  {
    selector: '[data-tour="calendar-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Manage Appointments 📅</h3>
        <p>Keep track of all your scheduled services and client meetings in one place.</p>
      </div>
    ),
    position: "bottom"
  }
]

const getTitleCompanyTourSteps = (): TourStep[] => [
  {
    selector: '[data-tour="progress-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Welcome Title Company! 🏛️</h3>
        <p>Monitor all transactions you're handling and track closing progress.</p>
      </div>
    ),
    position: "bottom"
  },
  {
    selector: '[data-tour="calendar-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Schedule Closings 📅</h3>
        <p>Coordinate closing appointments and manage your title company calendar.</p>
      </div>
    ),
    position: "bottom"
  }
]

function TourContent() {
  const { isOpen, currentStep, steps, setIsOpen, setCurrentStep } = useTour()

  // Manage body scroll when tour is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('tour-open')
    } else {
      document.body.classList.remove('tour-open')
    }

    return () => {
      document.body.classList.remove('tour-open')
    }
  }, [isOpen])

  if (!isOpen || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false)
        }
      }}
    >
      <Card className="max-w-xs sm:max-w-sm w-full sm:w-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">{currentStep + 1} of {steps.length}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="text-sm sm:text-base">{step.content}</div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={isFirst}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <SkipForward className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Skip
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (isLast) {
                setIsOpen(false)
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
            className="text-xs sm:text-sm"
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export function UserTour({ children }: UserTourProps) {
  const { user } = useSupabase()
  const { userRole, isProfessional } = usePermissions()
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])

  useEffect(() => {
    if (!user) return

    // Determine tour steps based on user role
    let steps: TourStep[] = []
    
    if (isProfessional) {
      steps = getProfessionalTourSteps()
    } else if (userRole === 'TITLE_COMPANY') {
      steps = getTitleCompanyTourSteps()
    } else {
      // Default to buyer tour, but could be enhanced to detect seller intent
      steps = getBuyerTourSteps()
    }

    setTourSteps(steps)
  }, [user, userRole, isProfessional])

  return (
    <TourProvider
      steps={tourSteps}
      showBadge={false}
      showCloseButton={false}
      showNavigation={false}
      showDots={false}
      disableInteraction={false}
      disableDotsNavigation={true}
      disableKeyboardNavigation={false}
      className="tour-mask"
      onClickMask={({ setIsOpen }) => setIsOpen(false)}
      styles={{
        popover: (base) => ({
          ...base,
          display: 'none', // Hide default popover since we're using custom TourContent
        }),
        mask: (base) => ({
          ...base,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }),
        maskArea: (base) => ({
          ...base,
          rx: 8,
        }),
      }}
    >
      <TourContent />
      {children}
    </TourProvider>
  )
}

export function StartTourButton() {
  const { setIsOpen } = useTour()

  const handleStartTour = () => {
    console.log('Starting tour...')
    setIsOpen(true)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleStartTour}
      className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">Take Tour</span>
      <span className="sm:hidden">Tour</span>
    </Button>
  )
}
