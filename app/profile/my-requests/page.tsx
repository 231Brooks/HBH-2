"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  MessageSquare, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Star,
  AlertCircle,
  Plus,
  Eye,
  Edit3,
  Trash2
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { ProtectedRoute } from "@/components/protected-route"
import { formatDistanceToNow } from "date-fns"
import { ServiceUrgency, ServiceRequestStatus } from "@prisma/client"

interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  budget?: string
  location: string
  urgency: ServiceUrgency
  status: ServiceRequestStatus
  createdAt: string
  responses: Array<{
    id: string
    message: string
    proposedPrice?: string
    estimatedDuration?: string
    provider: {
      id: string
      name: string
      image?: string
      rating?: number
      reviewCount: number
    }
  }>
}

const urgencyColors = {
  LOW: "bg-green-100 text-green-800 border-green-200",
  NORMAL: "bg-blue-100 text-blue-800 border-blue-200", 
  HIGH: "bg-red-100 text-red-800 border-red-200",
}

const statusColors = {
  OPEN: "bg-green-100 text-green-800 border-green-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
}

export default function MyRequestsPage() {
  const router = useRouter()
  const { user } = useSupabase()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadMyRequests()
  }, [])

  const loadMyRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/service-requests/my-requests')
      const data = await response.json()
      
      if (data.success) {
        setRequests(data.serviceRequests)
      } else {
        setError(data.error || "Failed to load your service requests")
      }
    } catch (err) {
      console.error("Failed to load service requests:", err)
      setError("Failed to load your service requests")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Service Requests</h1>
              <p className="text-muted-foreground">Manage your service requests and view responses</p>
            </div>
            <Button asChild>
              <Link href="/services/request">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid gap-6">
            {requests.map((request) => (
              <ServiceRequestCard key={request.id} request={request} onUpdate={loadMyRequests} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests yet</h3>
            <p className="text-gray-500 mb-4">Create your first service request to get started.</p>
            <Button asChild>
              <Link href="/services/request">
                <Plus className="mr-2 h-4 w-4" />
                Create Service Request
              </Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

interface ServiceRequestCardProps {
  request: ServiceRequest
  onUpdate: () => void
}

function ServiceRequestCard({ request, onUpdate }: ServiceRequestCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
            <CardDescription className="line-clamp-2">{request.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={urgencyColors[request.urgency]}>
              {request.urgency}
            </Badge>
            <Badge className={statusColors[request.status]}>
              {request.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {request.responses.length} response{request.responses.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/service-requests/${request.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
