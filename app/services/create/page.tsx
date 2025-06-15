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
  // Property & Building Services
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HVAC", label: "HVAC (Heating, Ventilation, Air Conditioning)" },
  { value: "ROOFING", label: "Roofing" },
  { value: "SIDING", label: "Siding" },
  { value: "WINDOWS_DOORS", label: "Windows & Doors" },
  { value: "INSULATION", label: "Insulation" },
  { value: "FLOORING_INSTALLATION", label: "Flooring Installation" },
  { value: "CARPET_INSTALLATION", label: "Carpet Installation" },
  { value: "TILE_GROUT", label: "Tile & Grout Services" },
  { value: "FOUNDATION_REPAIR", label: "Foundation Repair" },
  { value: "DRYWALL", label: "Drywall Installation & Repair" },
  { value: "MASONRY_CONCRETE", label: "Masonry & Concrete" },
  { value: "FRAMING_STRUCTURAL", label: "Framing & Structural Work" },
  { value: "WATERPROOFING", label: "Waterproofing" },
  { value: "CHIMNEY", label: "Chimney Cleaning & Repair" },
  { value: "GUTTER", label: "Gutter Installation & Cleaning" },
  // Maintenance & Repair
  { value: "APPLIANCE_REPAIR", label: "Appliance Repair" },
  { value: "HANDYMAN", label: "General Handyman Services" },
  { value: "PEST_CONTROL", label: "Pest Control" },
  { value: "MOLD_REMEDIATION", label: "Mold Remediation" },
  { value: "PROPERTY_CLEANING", label: "Property Cleaning (Pre/Post Sale)" },
  { value: "PRESSURE_WASHING", label: "Pressure Washing" },
  { value: "POOL_SPA", label: "Pool & Spa Maintenance" },
  { value: "SEPTIC_TANK", label: "Septic Tank Services" },
  { value: "LOCKSMITH", label: "Locksmith Services" },
  { value: "FURNACE_REPAIR", label: "Furnace Repair" },
  { value: "WATER_HEATER", label: "Water Heater Installation" },
  { value: "GARAGE_DOOR", label: "Garage Door Installation & Repair" },
  // Interior & Exterior Design
  { value: "INTERIOR_DESIGN", label: "Interior Design" },
  { value: "EXTERIOR_DESIGN", label: "Exterior Design" },
  { value: "HOME_STAGING", label: "Home Staging" },
  { value: "PAINTING_INTERIOR", label: "Painting (Interior)" },
  { value: "PAINTING_EXTERIOR", label: "Painting (Exterior)" },
  { value: "WALLPAPER", label: "Wallpaper Installation" },
  { value: "LIGHTING_DESIGN", label: "Lighting Design & Installation" },
  { value: "CABINETRY_COUNTERTOPS", label: "Cabinetry & Countertops" },
  { value: "SMART_HOME", label: "Smart Home Design & Integration" },
  { value: "CLOSET_STORAGE", label: "Closet & Storage Design" },
  // Outdoor & Landscaping
  { value: "LANDSCAPING", label: "Landscaping" },
  { value: "LAWN_CARE", label: "Lawn Care & Sod Installation" },
  { value: "TREE_SERVICES", label: "Tree Trimming & Removal" },
  { value: "IRRIGATION", label: "Irrigation Systems" },
  { value: "FENCE", label: "Fence Installation & Repair" },
  { value: "DECK_PATIO", label: "Deck & Patio Construction" },
  { value: "OUTDOOR_KITCHEN", label: "Outdoor Kitchen/BBQ Design" },
  { value: "DRIVEWAY_PAVING", label: "Driveway Paving" },
  { value: "RETAINING_WALLS", label: "Retaining Walls" },
  { value: "OUTDOOR_LIGHTING", label: "Outdoor Lighting" },
  // Construction & Renovation
  { value: "GENERAL_CONTRACTING", label: "General Contracting" },
  { value: "KITCHEN_REMODELING", label: "Kitchen Remodeling" },
  { value: "BATHROOM_REMODELING", label: "Bathroom Remodeling" },
  { value: "BASEMENT_FINISHING", label: "Basement Finishing" },
  { value: "ROOM_ADDITIONS", label: "Room Additions" },
  { value: "ADU_BUILDS", label: "ADU (Accessory Dwelling Unit) Builds" },
  { value: "DEMOLITION", label: "Demolition Services" },
  // Inspections & Assessments
  { value: "HOME_INSPECTION", label: "Home Inspection" },
  { value: "TERMITE_INSPECTION", label: "Termite Inspection" },
  { value: "ROOF_INSPECTION", label: "Roof Inspection" },
  { value: "HVAC_INSPECTION", label: "HVAC Inspection" },
  { value: "SEWER_INSPECTION", label: "Sewer Line Inspection" },
  { value: "STRUCTURAL_ENGINEERING", label: "Structural Engineering Reports" },
  { value: "ENERGY_ASSESSMENT", label: "Energy Efficiency Assessment" },
  { value: "APPRAISAL", label: "Appraisal Services" },
  { value: "ENVIRONMENTAL_TESTING", label: "Environmental Testing (Asbestos, Radon, Lead)" },
  // Legal, Closing & Administrative
  { value: "NOTARY", label: "Notary Services" },
  { value: "TITLE_SERVICES", label: "Title Search & Title Insurance" },
  { value: "ESCROW", label: "Escrow Services" },
  { value: "DEED_PREPARATION", label: "Deed Preparation" },
  { value: "LEGAL_CONSULTING", label: "Real Estate Legal Consulting" },
  { value: "LIEN_SERVICES", label: "Lien Searches & Resolution" },
  { value: "PERMIT_FILING", label: "Permit Filing" },
  { value: "ZONING_COMPLIANCE", label: "Zoning & Code Compliance" },
  { value: "CONTRACT_SERVICES", label: "Contract Drafting & Review" },
  // Transaction & Listing Support
  { value: "PHOTOGRAPHY", label: "Real Estate Photography" },
  { value: "DRONE_PHOTOGRAPHY", label: "Drone Photography" },
  { value: "VIRTUAL_TOURS", label: "3D Virtual Tours" },
  { value: "MLS_LISTING", label: "MLS Listing Services" },
  { value: "PROPERTY_MARKETING", label: "Property Marketing" },
  { value: "SIGNAGE", label: "Signage Installation" },
  { value: "OPEN_HOUSE", label: "Open House Setup" },
  { value: "LEAD_GENERATION", label: "Lead Generation & CRM Setup" },
  { value: "COPYWRITING", label: "Real Estate Copywriting" },
  { value: "MARKET_ANALYSIS", label: "Comparative Market Analysis (CMA)" },
  { value: "VIRTUAL_STAGING", label: "Virtual Staging" },
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
