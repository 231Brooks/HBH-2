"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, ChevronLeft, ChevronRight, Play, SkipForward, HelpCircle, ArrowRight, Home, Building2, BarChart, Calendar, User, FileText } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"
import { usePermissions } from "@/hooks/use-permissions"

interface TourStep {
  id: string
  title: string
  content: string
  icon?: React.ReactNode
  action?: () => void
}

interface TourContextType {
  isOpen: boolean
  currentStep: number
  steps: TourStep[]
  openTour: () => void
  closeTour: () => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
}

const TourContext = createContext<TourContextType | null>(null)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: React.ReactNode
}

// Tour steps for different user types
const getBuyerTourSteps = (): TourStep[] => [
  {
    id: "welcome",
    title: "Welcome to HBH! 🏠",
    content: "Your all-in-one platform for real estate transactions. Let's explore the key features to help you find and buy your dream home.",
    icon: <Home className="h-5 w-5" />
  },
  {
    id: "marketplace",
    title: "Browse Properties 🏘️",
    content: "Start by exploring the Marketplace where you can browse properties for sale, view detailed listings, and save your favorites.",
    icon: <BarChart className="h-5 w-5" />
  },
  {
    id: "services",
    title: "Find Services 🔧",
    content: "Need help with your real estate transaction? Browse professional services like inspections, appraisals, and more from trusted professionals.",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "progress",
    title: "Track Progress 📊",
    content: "Monitor your real estate transactions from offer to closing. Stay updated on important milestones and deadlines.",
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: "calendar",
    title: "Schedule Appointments 📅",
    content: "Book property viewings, inspections, and meetings with professionals all in one convenient place.",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: "profile",
    title: "Manage Your Profile 👤",
    content: "Update your preferences, manage saved properties, and customize your account settings to enhance your experience.",
    icon: <User className="h-5 w-5" />
  }
]

const getSellerTourSteps = (): TourStep[] => [
  {
    id: "welcome",
    title: "Welcome Seller! 🏡",
    content: "Ready to sell your property? HBH makes it easy to list, market, and manage your property sale from start to finish.",
    icon: <Home className="h-5 w-5" />
  },
  {
    id: "marketplace",
    title: "List Your Property 📝",
    content: "Start by creating a compelling listing in the Marketplace. Add photos, descriptions, and pricing to attract potential buyers.",
    icon: <BarChart className="h-5 w-5" />
  },
  {
    id: "services",
    title: "Professional Services 🔧",
    content: "Find photographers, staging professionals, and other services to help sell your property faster and for the best price.",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "progress",
    title: "Track Your Listings 📊",
    content: "Monitor your property listings, track offers, and manage the entire selling process from initial interest to closing.",
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: "calendar",
    title: "Schedule Showings 📅",
    content: "Coordinate property showings, open houses, and meetings with potential buyers and real estate professionals.",
    icon: <Calendar className="h-5 w-5" />
  }
]

const getProfessionalTourSteps = (): TourStep[] => [
  {
    id: "welcome",
    title: "Welcome Professional! 💼",
    content: "Your Service Dashboard is where you can find jobs, manage requests, and grow your real estate service business.",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "services",
    title: "Manage Your Services 🔧",
    content: "Create and manage your service listings, set pricing, and showcase your expertise to potential clients.",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "calendar",
    title: "Schedule Management 📅",
    content: "Keep track of all your scheduled services and client meetings in one organized place.",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: "progress",
    title: "Track Jobs 📊",
    content: "Monitor your active jobs, track payments, and manage client communications efficiently.",
    icon: <FileText className="h-5 w-5" />
  }
]

const getTitleCompanyTourSteps = (): TourStep[] => [
  {
    id: "welcome",
    title: "Welcome Title Company! 🏛️",
    content: "Your dashboard helps you monitor all transactions you're handling and track closing progress efficiently.",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "progress",
    title: "Monitor Transactions 📊",
    content: "Track all active transactions, manage documents, and coordinate with buyers, sellers, and agents.",
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: "calendar",
    title: "Schedule Closings 📅",
    content: "Coordinate closing appointments and manage your title company calendar efficiently.",
    icon: <Calendar className="h-5 w-5" />
  }
]

function TourProvider({ children }: TourProviderProps) {
  const { user } = useSupabase()
  const { userRole, isProfessional } = usePermissions()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TourStep[]>([])

  useEffect(() => {
    if (!user) return

    // Determine tour steps based on user role
    let tourSteps: TourStep[] = []

    if (isProfessional) {
      tourSteps = getProfessionalTourSteps()
    } else {
      // Default to buyer tour, but could be enhanced to detect seller intent
      tourSteps = getBuyerTourSteps()
    }

    setSteps(tourSteps)
  }, [user, userRole, isProfessional])

  const openTour = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const closeTour = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }

  const value: TourContextType = {
    isOpen,
    currentStep,
    steps,
    openTour,
    closeTour,
    nextStep,
    prevStep,
    goToStep,
  }

  return (
    <TourContext.Provider value={value}>
      {children}
      <TourModal />
    </TourContext.Provider>
  )
}

function TourModal() {
  const { isOpen, currentStep, steps, closeTour, nextStep, prevStep } = useTour()

  if (!isOpen || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <Dialog open={isOpen} onOpenChange={closeTour}>
      <DialogContent className="sm:max-w-md max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} of {steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTour}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close tour</span>
            </Button>
          </div>
          <DialogTitle className="flex items-center gap-2 text-left">
            {step.icon}
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <DialogDescription className="text-sm text-muted-foreground">
            {step.content}
          </DialogDescription>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={isFirst}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={closeTour}
                className="flex-1 sm:flex-none"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Skip Tour
              </Button>
            </div>
            <Button
              size="sm"
              onClick={nextStep}
              className="sm:min-w-[100px]"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Tour Button Component
export function TourButton() {
  const { openTour } = useTour()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-9"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Tour</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={openTour} className="gap-2">
          <Play className="h-4 w-4" />
          Start Platform Tour
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple Tour Button (alternative)
export function StartTourButton() {
  const { openTour } = useTour()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openTour}
      className="gap-2 h-9"
    >
      <HelpCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Tour</span>
    </Button>
  )
}

// Main export
export { TourProvider as UserTour }
