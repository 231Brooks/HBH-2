"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Star,
  TrendingUp,
  User,
  AlertCircle,
  CheckCircle,
  Calendar,
  Filter,
  Briefcase,
  FileText,
  Eye,
  Send,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServiceRequests, respondToServiceRequest } from "../actions/service-request-actions"
import { ServiceCategory, ServiceUrgency, ServiceRequestStatus } from "@prisma/client"
import { useSupabase } from "@/contexts/supabase-context"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface ServiceRequest {
  id: string
  title: string
  description: string
  category: ServiceCategory
  budget?: string
  location: string
  urgency: ServiceUrgency
  status: ServiceRequestStatus
  createdAt: Date
  client: {
    id: string
    name: string
    image?: string
    rating?: number
    reviewCount: number
  }
  responses: any[]
}

const urgencyColors = {
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

const urgencyIcons = {
  LOW: Clock,
  NORMAL: Clock,
  HIGH: AlertCircle,
  URGENT: AlertCircle,
}

export default function ProfessionalDashboard() {
  const { user } = useSupabase()
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "ALL">("ALL")
  const [selectedUrgency, setSelectedUrgency] = useState<ServiceUrgency | "ALL">("ALL")
  const [activeTab, setActiveTab] = useState("find-jobs")

  useEffect(() => {
    loadServiceRequests()
  }, [selectedCategory, selectedUrgency, activeTab])

  const loadServiceRequests = async () => {
    setLoading(true)
    try {
      if (activeTab === "find-jobs") {
        const filters = {
          category: selectedCategory !== "ALL" ? selectedCategory : undefined,
          urgency: selectedUrgency !== "ALL" ? selectedUrgency : undefined,
          status: ServiceRequestStatus.OPEN,
          location: searchTerm || undefined,
          limit: 20,
          offset: 0,
        }

        const result = await getServiceRequests(filters)
        if (result.success) {
          setServiceRequests(result.serviceRequests || [])
        }
      } else {
        // For other tabs, we'll implement specific loading logic later
        setServiceRequests([])
      }
    } catch (error) {
      console.error("Failed to load service requests:", error)
      setServiceRequests([])
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyIcon = (urgency: ServiceUrgency) => {
    const Icon = urgencyIcons[urgency]
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Service Requests</h1>
          <p className="text-muted-foreground">Find jobs, track completed work, and manage your service business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/services/create">
              <Plus className="mr-2 h-4 w-4" /> Create Service Listing
            </Link>
          </Button>
          <Button asChild>
            <Link href="/job-marketplace">
              <Briefcase className="mr-2 h-4 w-4" /> Browse All Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Requests</p>
                <p className="text-2xl font-bold">{serviceRequests.filter(r => r.status === ServiceRequestStatus.OPEN).length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">5.0</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ServiceCategory | "ALL")}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="TITLE_SERVICES">Title Services</SelectItem>
            <SelectItem value="HOME_INSPECTION">Home Inspection</SelectItem>
            <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
            <SelectItem value="CONTRACTORS">Contractors</SelectItem>
            <SelectItem value="LEGAL_SERVICES">Legal Services</SelectItem>
            <SelectItem value="MORTGAGE">Mortgage</SelectItem>
            <SelectItem value="INTERIOR_DESIGN">Interior Design</SelectItem>
            <SelectItem value="MOVING_SERVICES">Moving Services</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedUrgency} onValueChange={(value) => setSelectedUrgency(value as ServiceUrgency | "ALL")}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Urgency</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Service Requests Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="find-jobs">Find Jobs</TabsTrigger>
          <TabsTrigger value="completed-jobs">Completed Jobs</TabsTrigger>
          <TabsTrigger value="my-responses">My Responses</TabsTrigger>
          <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="find-jobs">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : serviceRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {serviceRequests.map((request) => (
                <ServiceRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later for new requests.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed-jobs">
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Completed jobs will appear here</h3>
            <p className="text-gray-500">Jobs that were paid through the platform will be tracked here.</p>
          </div>
        </TabsContent>

        <TabsContent value="my-responses">
          <div className="text-center py-12">
            <Send className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your responses will appear here</h3>
            <p className="text-gray-500">Service requests you've responded to will be tracked here.</p>
          </div>
        </TabsContent>

        <TabsContent value="active-projects">
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active projects will appear here</h3>
            <p className="text-gray-500">Accepted service requests will show up as active projects.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ServiceRequestCardProps {
  request: ServiceRequest
}

function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const UrgencyIcon = urgencyIcons[request.urgency]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
            <CardDescription className="text-base">{request.description}</CardDescription>
          </div>
          <Badge className={urgencyColors[request.urgency]}>
            <UrgencyIcon className="h-3 w-3 mr-1" />
            {request.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {request.location}
          </div>
          {request.budget && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              {request.budget}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {request.client.image ? (
                <img src={request.client.image} alt={request.client.name} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{request.client.name}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                {request.client.rating?.toFixed(1) || "New"} ({request.client.reviewCount} reviews)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {request.responses.length} responses
            </span>
            <Button asChild>
              <Link href={`/service-requests/${request.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
