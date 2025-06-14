"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createService } from "@/app/actions/service-actions"
import { checkListingPermission } from "@/app/actions/subscription-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Crown } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"
import Link from "next/link"

const serviceCategories = [
  { value: "TITLE_SERVICES", label: "Title Services" },
  { value: "HOME_INSPECTION", label: "Home Inspection" },
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "CONTRACTORS", label: "Contractors" },
  { value: "LEGAL_SERVICES", label: "Legal Services" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "INTERIOR_DESIGN", label: "Interior Design" },
  { value: "MOVING_SERVICES", label: "Moving Services" },
]

function CreateServiceContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [canCreateListing, setCanCreateListing] = useState(true)
  const [permissionReason, setPermissionReason] = useState("")
  const [checkingPermission, setCheckingPermission] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    hourlyRate: "",
    location: "",
  })

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      const result = await checkListingPermission()
      if (result.success) {
        setCanCreateListing(result.allowed)
        if (!result.allowed && result.reason) {
          setPermissionReason(result.reason)
        }
      }
    } catch (error) {
      console.error("Failed to check permissions:", error)
      setError("Failed to check subscription permissions")
    } finally {
      setCheckingPermission(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("description", formData.description)
      formDataObj.append("category", formData.category)
      formDataObj.append("price", formData.price)
      formDataObj.append("hourlyRate", formData.hourlyRate)
      formDataObj.append("location", formData.location)

      const result = await createService(formDataObj)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/services")
        }, 2000)
      } else {
        setError(result.error || "Failed to create service. Please try again.")
      }
    } catch (err: any) {
      console.error("Service creation error:", err)
      setError(err.message || "Failed to create service. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingPermission) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!canCreateListing) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Required
              </CardTitle>
              <CardDescription>
                Upgrade your account to start offering services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{permissionReason}</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To create service listings, you need either:
                </p>
                <ul className="text-sm space-y-2 ml-4">
                  <li>• Professional Monthly ($50/month) - Unlimited listings, no transaction fees</li>
                  <li>• Pay Per Listing ($10/listing + 5% transaction fees)</li>
                </ul>

                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/settings/subscription">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Subscription
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground">
            Add a new service to offer your professional expertise to clients.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Service Details
            </CardTitle>
            <CardDescription>
              Provide information about the service you want to offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>
                  Service created successfully! Redirecting to services page...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Professional Home Inspection"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your service, experience, and what clients can expect..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Fixed Price</Label>
                  <Input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $500 or Starting at $300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    placeholder="e.g., 75"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Service Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Dallas, TX or Remote"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || !formData.name || !formData.category}>
                  {loading ? "Creating..." : "Create Service"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Tips for a Great Service Listing:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use a clear, descriptive service name</li>
            <li>• Provide detailed information about what's included</li>
            <li>• Set competitive pricing based on your market</li>
            <li>• Include your service area or specify if you work remotely</li>
            <li>• Highlight your experience and qualifications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function CreateServicePage() {
  return (
    <ProtectedRoute>
      <RoleGuard 
        requiredPermission="canCreateService"
        fallback={
          <div className="container py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
              <p className="text-muted-foreground mb-6">
                You need a Professional account to create services.
              </p>
              <Button asChild>
                <Link href="/profile">Update Account Type</Link>
              </Button>
            </div>
          </div>
        }
      >
        <CreateServiceContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
