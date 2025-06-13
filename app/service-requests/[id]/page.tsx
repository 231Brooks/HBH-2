"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  User,
  Star,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getServiceRequestById, respondToServiceRequest, acceptServiceResponse } from "@/app/actions/service-request-actions"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
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
  createdAt: Date
  client: {
    id: string
    name: string
    image?: string
    rating?: number
    reviewCount: number
    email?: string
    phone?: string
  }
  provider?: {
    id: string
    name: string
    image?: string
    rating?: number
    reviewCount: number
  }
  responses: Array<{
    id: string
    message: string
    proposedPrice?: number
    estimatedDuration?: string
    createdAt: Date
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
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

export default function ServiceRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useSupabase()
  const { isProfessional } = usePermissions()
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [responding, setResponding] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  
  const [responseForm, setResponseForm] = useState({
    message: "",
    proposedPrice: "",
    estimatedDuration: "",
  })

  useEffect(() => {
    if (params.id) {
      loadServiceRequest()
    }
  }, [params.id])

  const loadServiceRequest = async () => {
    try {
      const result = await getServiceRequestById(params.id as string)
      if (result.success) {
        setServiceRequest(result.serviceRequest)
      } else {
        setError(result.error || "Failed to load service request")
      }
    } catch (error) {
      console.error("Failed to load service request:", error)
      setError("Failed to load service request")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceRequest || !user) return

    setResponding(true)
    try {
      const result = await respondToServiceRequest(
        serviceRequest.id,
        responseForm.message,
        responseForm.proposedPrice ? parseFloat(responseForm.proposedPrice) : undefined,
        responseForm.estimatedDuration || undefined
      )

      if (result.success) {
        setShowResponseForm(false)
        setResponseForm({ message: "", proposedPrice: "", estimatedDuration: "" })
        await loadServiceRequest() // Reload to show new response
      } else {
        setError(result.error || "Failed to submit response")
      }
    } catch (error) {
      console.error("Failed to submit response:", error)
      setError("Failed to submit response")
    } finally {
      setResponding(false)
    }
  }

  const handleAcceptResponse = async (responseId: string) => {
    if (!serviceRequest) return

    try {
      const result = await acceptServiceResponse(serviceRequest.id, responseId)
      if (result.success) {
        await loadServiceRequest() // Reload to show updated status
      } else {
        setError(result.error || "Failed to accept response")
      }
    } catch (error) {
      console.error("Failed to accept response:", error)
      setError("Failed to accept response")
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error || !serviceRequest) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Service request not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const isOwner = user?.id === serviceRequest.client.id
  const hasResponded = serviceRequest.responses.some(r => r.provider.id === user?.id)
  const canRespond = isProfessional && !isOwner && !hasResponded && serviceRequest.status === ServiceRequestStatus.OPEN

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Service Requests
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Request Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {serviceRequest.location}
                    </div>
                    {serviceRequest.budget && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {serviceRequest.budget}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(serviceRequest.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={urgencyColors[serviceRequest.urgency]}>
                    {serviceRequest.urgency}
                  </Badge>
                  <Badge variant={serviceRequest.status === ServiceRequestStatus.OPEN ? "default" : "secondary"}>
                    {serviceRequest.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">{serviceRequest.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Response Form for Professionals */}
          {canRespond && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit Your Response
                </CardTitle>
                <CardDescription>
                  Provide details about how you can help with this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showResponseForm ? (
                  <Button onClick={() => setShowResponseForm(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Respond to Request
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitResponse} className="space-y-4">
                    <div>
                      <Label htmlFor="message">Your Response *</Label>
                      <Textarea
                        id="message"
                        value={responseForm.message}
                        onChange={(e) => setResponseForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Describe how you can help, your experience, and approach..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="proposedPrice">Proposed Price</Label>
                        <Input
                          id="proposedPrice"
                          type="number"
                          value={responseForm.proposedPrice}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, proposedPrice: e.target.value }))}
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                        <Input
                          id="estimatedDuration"
                          value={responseForm.estimatedDuration}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                          placeholder="e.g., 2-3 days"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={responding || !responseForm.message}>
                        {responding ? "Submitting..." : "Submit Response"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowResponseForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Responses ({serviceRequest.responses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {serviceRequest.responses.length > 0 ? (
                <div className="space-y-4">
                  {serviceRequest.responses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {response.provider.image ? (
                              <img src={response.provider.image} alt={response.provider.name} className="w-10 h-10 rounded-full" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{response.provider.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                              {response.provider.rating?.toFixed(1) || "New"} ({response.provider.reviewCount} reviews)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                          </p>
                          {response.proposedPrice && (
                            <p className="font-medium text-green-600">${response.proposedPrice}</p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{response.message}</p>
                      
                      {response.estimatedDuration && (
                        <p className="text-sm text-muted-foreground mb-3">
                          <strong>Duration:</strong> {response.estimatedDuration}
                        </p>
                      )}

                      {isOwner && serviceRequest.status === ServiceRequestStatus.OPEN && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptResponse(response.id)}
                          className="mt-2"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Response
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No responses yet. Be the first to respond!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {serviceRequest.client.image ? (
                    <img src={serviceRequest.client.image} alt={serviceRequest.client.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{serviceRequest.client.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                    {serviceRequest.client.rating?.toFixed(1) || "New"} ({serviceRequest.client.reviewCount} reviews)
                  </div>
                </div>
              </div>
              
              {(isOwner || serviceRequest.provider?.id === user?.id) && (
                <div className="space-y-2 text-sm">
                  {serviceRequest.client.email && (
                    <p><strong>Email:</strong> {serviceRequest.client.email}</p>
                  )}
                  {serviceRequest.client.phone && (
                    <p><strong>Phone:</strong> {serviceRequest.client.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-sm">{serviceRequest.category.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgency</p>
                <Badge className={urgencyColors[serviceRequest.urgency]} variant="outline">
                  {serviceRequest.urgency}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={serviceRequest.status === ServiceRequestStatus.OPEN ? "default" : "secondary"}>
                  {serviceRequest.status.replace("_", " ")}
                </Badge>
              </div>
              {serviceRequest.budget && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="text-sm">{serviceRequest.budget}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
