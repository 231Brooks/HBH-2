"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  Calendar,
  Users,
  Settings
} from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

function ProfessionalSettingsContent() {
  const { userRole, permissions } = usePermissions()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Business Information
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")
  const [businessWebsite, setBusinessWebsite] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")

  // Service Settings
  const [serviceCategories, setServiceCategories] = useState<string[]>([])
  const [serviceRadius, setServiceRadius] = useState("25")
  const [hourlyRate, setHourlyRate] = useState("")
  const [minimumProject, setMinimumProject] = useState("")
  const [acceptsEmergency, setAcceptsEmergency] = useState(false)
  const [emergencyRate, setEmergencyRate] = useState("")

  // Availability Settings
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" }
  })

  // Professional Preferences
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false)
  const [requireDeposit, setRequireDeposit] = useState(true)
  const [depositPercentage, setDepositPercentage] = useState("25")
  const [cancellationPolicy, setCancellationPolicy] = useState("24hours")
  const [showRealTimeAvailability, setShowRealTimeAvailability] = useState(true)

  const businessTypes = [
    "Real Estate Agency",
    "Property Management",
    "Construction Company",
    "Home Inspection",
    "Mortgage Brokerage",
    "Legal Services",
    "Insurance Agency",
    "Cleaning Services",
    "Landscaping",
    "Home Repair",
    "Interior Design",
    "Architecture",
    "Other"
  ]

  const availableCategories = [
    // Property & Building Services
    "Plumbing",
    "Electrical",
    "HVAC (Heating, Ventilation, Air Conditioning)",
    "Roofing",
    "Siding",
    "Windows & Doors",
    "Insulation",
    "Flooring Installation",
    "Carpet Installation",
    "Tile & Grout Services",
    "Foundation Repair",
    "Drywall Installation & Repair",
    "Masonry & Concrete",
    "Framing & Structural Work",
    "Waterproofing",
    "Chimney Cleaning & Repair",
    "Gutter Installation & Cleaning",
    // Maintenance & Repair
    "Appliance Repair",
    "General Handyman Services",
    "Pest Control",
    "Mold Remediation",
    "Property Cleaning (Pre/Post Sale)",
    "Pressure Washing",
    "Pool & Spa Maintenance",
    "Septic Tank Services",
    "Locksmith Services",
    "Furnace Repair",
    "Water Heater Installation",
    "Garage Door Installation & Repair",
    // Interior & Exterior Design
    "Interior Design",
    "Exterior Design",
    "Home Staging",
    "Painting (Interior)",
    "Painting (Exterior)",
    "Wallpaper Installation",
    "Lighting Design & Installation",
    "Cabinetry & Countertops",
    "Smart Home Design & Integration",
    "Closet & Storage Design",
    // Outdoor & Landscaping
    "Landscaping",
    "Lawn Care & Sod Installation",
    "Tree Trimming & Removal",
    "Irrigation Systems",
    "Fence Installation & Repair",
    "Deck & Patio Construction",
    "Outdoor Kitchen/BBQ Design",
    "Driveway Paving",
    "Retaining Walls",
    "Outdoor Lighting",
    // Construction & Renovation
    "General Contracting",
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Basement Finishing",
    "Room Additions",
    "ADU (Accessory Dwelling Unit) Builds",
    "Demolition Services",
    // Inspections & Assessments
    "Home Inspection",
    "Termite Inspection",
    "Roof Inspection",
    "HVAC Inspection",
    "Sewer Line Inspection",
    "Structural Engineering Reports",
    "Energy Efficiency Assessment",
    "Appraisal Services",
    "Environmental Testing (Asbestos, Radon, Lead)",
    // Legal, Closing & Administrative
    "Notary Services",
    "Title Search & Title Insurance",
    "Escrow Services",
    "Deed Preparation",
    "Real Estate Legal Consulting",
    "Lien Searches & Resolution",
    "Permit Filing",
    "Zoning & Code Compliance",
    "Contract Drafting & Review",
    // Transaction & Listing Support
    "Real Estate Photography",
    "Drone Photography",
    "3D Virtual Tours",
    "MLS Listing Services",
    "Property Marketing",
    "Signage Installation",
    "Open House Setup",
    "Lead Generation & CRM Setup",
    "Real Estate Copywriting",
    "Comparative Market Analysis (CMA)",
    "Virtual Staging"
  ]

  const handleSaveSettings = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock API call - in real app, this would save professional settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Professional settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save professional settings. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceCategory = (category: string) => {
    setServiceCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <RoleGuard requiredRole="PROFESSIONAL">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Professional Settings</h1>
            <p className="text-muted-foreground">
              Manage your business information, services, and professional preferences
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>Your business details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input 
                      id="licenseNumber" 
                      value={licenseNumber} 
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Professional license number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input 
                      id="businessPhone" 
                      value={businessPhone} 
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input 
                    id="businessAddress" 
                    value={businessAddress} 
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Website</Label>
                  <Input 
                    id="businessWebsite" 
                    value={businessWebsite} 
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea 
                    id="businessDescription" 
                    value={businessDescription} 
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe your business and services..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Service Settings
                </CardTitle>
                <CardDescription>Configure your services and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Service Categories</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {availableCategories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceCategories.includes(category)}
                          onChange={() => toggleServiceCategory(category)}
                          className="rounded"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                    <Select value={serviceRadius} onValueChange={setServiceRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="100">100 miles</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number"
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="150"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumProject">Minimum Project Value ($)</Label>
                    <Input 
                      id="minimumProject" 
                      type="number"
                      value={minimumProject} 
                      onChange={(e) => setMinimumProject(e.target.value)}
                      placeholder="500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRate">Emergency Rate ($)</Label>
                    <Input 
                      id="emergencyRate" 
                      type="number"
                      value={emergencyRate} 
                      onChange={(e) => setEmergencyRate(e.target.value)}
                      placeholder="200"
                      disabled={!acceptsEmergency}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Accept Emergency Calls</Label>
                    <p className="text-xs text-muted-foreground">Available for urgent/emergency services</p>
                  </div>
                  <Switch checked={acceptsEmergency} onCheckedChange={setAcceptsEmergency} />
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </CardTitle>
                <CardDescription>Set your availability schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20">
                        <Switch
                          checked={hours.enabled}
                          onCheckedChange={(enabled) => updateWorkingHours(day, 'enabled', enabled)}
                        />
                      </div>
                      <div className="w-24 capitalize font-medium">
                        {day}
                      </div>
                      {hours.enabled ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                            className="p-1 border rounded text-sm"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                            className="p-1 border rounded text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Professional Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Professional Preferences
                </CardTitle>
                <CardDescription>Configure booking and payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-Accept Bookings</Label>
                      <p className="text-xs text-muted-foreground">Automatically accept new bookings</p>
                    </div>
                    <Switch checked={autoAcceptBookings} onCheckedChange={setAutoAcceptBookings} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require Deposit</Label>
                      <p className="text-xs text-muted-foreground">Require upfront payment</p>
                    </div>
                    <Switch checked={requireDeposit} onCheckedChange={setRequireDeposit} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Real-Time Availability</Label>
                      <p className="text-xs text-muted-foreground">Display live calendar availability</p>
                    </div>
                    <Switch checked={showRealTimeAvailability} onCheckedChange={setShowRealTimeAvailability} />
                  </div>
                </div>

                {requireDeposit && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                      <Select value={depositPercentage} onValueChange={setDepositPercentage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="25">25%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="100">100% (Full Payment)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                      <Select value={cancellationPolicy} onValueChange={setCancellationPolicy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24hours">24 hours notice</SelectItem>
                          <SelectItem value="48hours">48 hours notice</SelectItem>
                          <SelectItem value="1week">1 week notice</SelectItem>
                          <SelectItem value="strict">No cancellations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Professional Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

export default function ProfessionalSettingsPage() {
  return (
    <ProtectedRoute>
      <ProfessionalSettingsContent />
    </ProtectedRoute>
  )
}
