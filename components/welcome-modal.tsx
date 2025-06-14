"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Building2,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Shield,
  Play,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"
import { usePermissions } from "@/hooks/use-permissions"
import { useTour } from "@reactour/tour"

interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const { user } = useSupabase()
  const { userRole, isProfessional } = usePermissions()
  const { setIsOpen: setTourOpen } = useTour()
  const [currentStep, setCurrentStep] = useState(0)

  const handleStartTour = () => {
    onOpenChange(false)
    setTimeout(() => {
      setTourOpen(true)
    }, 500)
  }

  const handleSkip = () => {
    onOpenChange(false)
    // Mark as seen in localStorage
    localStorage.setItem('hbh-welcome-seen', 'true')
  }

  const getWelcomeContent = () => {
    if (isProfessional) {
      return {
        title: "Welcome to HBH, Professional! 💼",
        description: "You're all set to grow your real estate service business",
        features: [
          {
            icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
            title: "Find Service Requests",
            description: "Browse and respond to client requests for your services"
          },
          {
            icon: <TrendingUp className="h-6 w-6 text-green-600" />,
            title: "Advertise Your Services",
            description: "Create targeted ads to reach more potential clients"
          },
          {
            icon: <Calendar className="h-6 w-6 text-purple-600" />,
            title: "Manage Appointments",
            description: "Schedule and track all your client meetings and services"
          },
          {
            icon: <FileText className="h-6 w-6 text-orange-600" />,
            title: "Track Projects",
            description: "Monitor progress on active projects and transactions"
          }
        ]
      }
    } else if (userRole === 'TITLE_COMPANY') {
      return {
        title: "Welcome to HBH, Title Company! 🏛️",
        description: "Streamline your closing process and transaction management",
        features: [
          {
            icon: <FileText className="h-6 w-6 text-blue-600" />,
            title: "Manage Transactions",
            description: "View and coordinate all assigned real estate transactions"
          },
          {
            icon: <Calendar className="h-6 w-6 text-green-600" />,
            title: "Schedule Closings",
            description: "Coordinate closing appointments with all parties"
          },
          {
            icon: <Shield className="h-6 w-6 text-purple-600" />,
            title: "Document Management",
            description: "Upload and manage title commitments and closing documents"
          },
          {
            icon: <Users className="h-6 w-6 text-orange-600" />,
            title: "Communication Hub",
            description: "Stay connected with buyers, sellers, and agents"
          }
        ]
      }
    } else {
      return {
        title: "Welcome to HBH! 🏠",
        description: "Your all-in-one platform for real estate transactions",
        features: [
          {
            icon: <Home className="h-6 w-6 text-blue-600" />,
            title: "Browse Properties",
            description: "Find your dream home in our comprehensive marketplace"
          },
          {
            icon: <Building2 className="h-6 w-6 text-green-600" />,
            title: "Find Services",
            description: "Connect with trusted real estate professionals"
          },
          {
            icon: <FileText className="h-6 w-6 text-purple-600" />,
            title: "Track Progress",
            description: "Monitor your transaction from offer to closing"
          },
          {
            icon: <Calendar className="h-6 w-6 text-orange-600" />,
            title: "Schedule Appointments",
            description: "Book viewings, inspections, and meetings easily"
          }
        ]
      }
    }
  }

  const content = getWelcomeContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Quick Tips to Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {isProfessional ? (
                  <>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Complete your professional profile to attract more clients
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Create your first service listing to start receiving requests
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Consider advertising to boost your visibility
                    </li>
                  </>
                ) : userRole === 'TITLE_COMPANY' ? (
                  <>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Set up your company profile and contact information
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Review assigned transactions and upcoming closings
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Upload required documents and title commitments
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Complete your profile to get personalized recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Save properties you're interested in for easy access
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      Connect with professionals early in your home buying journey
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleStartTour} className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Take the Tour
            </Button>
            <Button variant="outline" onClick={handleSkip} className="flex-1 gap-2">
              <X className="h-4 w-4" />
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always access the tour later from the navigation menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useWelcomeModal() {
  const { user } = useSupabase()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (user && !localStorage.getItem('hbh-welcome-seen')) {
      // Show welcome modal for new users
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 1000) // Delay to ensure page is loaded

      return () => clearTimeout(timer)
    }
  }, [user])

  return {
    showWelcome,
    setShowWelcome
  }
}
