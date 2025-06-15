"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, MessageSquare } from "lucide-react"
import { createServiceRequest } from "@/app/actions/service-request-actions"
import { ServiceCategory, ServiceUrgency } from "@prisma/client"
import { ProtectedRoute } from "@/components/protected-route"

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

const urgencyLevels = [
  { value: "LOW", label: "Low - No rush", description: "Can wait a few weeks" },
  { value: "NORMAL", label: "Normal - Standard timing", description: "Within 1-2 weeks" },
  { value: "HIGH", label: "High - Soon", description: "Within a few days" },
  { value: "URGENT", label: "Urgent - ASAP", description: "Needed immediately" },
]

export default function CreateServiceRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
    urgency: "NORMAL" as ServiceUrgency,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await createServiceRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category as ServiceCategory,
        budget: formData.budget || undefined,
        location: formData.location,
        urgency: formData.urgency,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/services")
        }, 2000)
      } else {
        setError(result.error || "Failed to create service request. Please try again.")
      }
    } catch (err: any) {
      console.error("Service request creation error:", err)
      setError(err.message || "Failed to create service request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Request a Service</h1>
            <p className="text-muted-foreground">
              Describe what you need and get responses from qualified professionals.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Service Request Details
              </CardTitle>
              <CardDescription>
                Provide clear information about the service you need
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
                    Service request created successfully! Redirecting to marketplace...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Request Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Need home inspection for 3-bedroom house"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of service you need" />
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
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what you need in detail. Include property details, timeline, specific requirements, etc."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Dallas, TX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="text"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="e.g., $500-800 or Negotiable"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value as ServiceUrgency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-muted-foreground">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || !formData.title || !formData.category || !formData.description || !formData.location}>
                    {loading ? "Creating..." : "Post Service Request"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Tips for a Great Service Request:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific about what you need and when</li>
              <li>• Include property details (size, age, condition)</li>
              <li>• Mention any special requirements or preferences</li>
              <li>• Set a realistic budget range if you have one</li>
              <li>• Respond promptly to professional inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
