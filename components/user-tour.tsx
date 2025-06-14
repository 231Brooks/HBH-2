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
  
  if (!isOpen || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <Card className="max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{currentStep + 1} of {steps.length}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>{step.content}</div>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={isFirst}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip Tour
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (isLast) {
                setIsOpen(false)
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
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
      className="tour-mask"
      styles={{
        popover: (base) => ({
          ...base,
          padding: 0,
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }),
        mask: (base) => ({
          ...base,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="gap-2"
    >
      <Play className="h-4 w-4" />
      Take Tour
    </Button>
  )
}
