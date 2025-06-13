"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CreditCard,
  TrendingUp,
  Info,
} from "lucide-react"
import { getAdPricing, checkAdSlotAvailability, purchaseAd } from "@/app/actions/advertising-actions"
import { AdLocation } from "@prisma/client"
import { AD_PRICING_CONFIG } from "@/lib/ad-pricing"
import { ProtectedRoute } from "@/components/protected-route"

const adLocations = [
  { value: "BOTTOM_GLOBAL", label: "Bottom of All Pages", description: "Visible on every page", multiplier: 1.5 },
  { value: "FRONTPAGE", label: "Front Page", description: "Homepage premium placement", multiplier: 2.0 },
  { value: "SERVICES", label: "Services Section", description: "Services page and listings", multiplier: 1.2 },
  { value: "MARKETPLACE", label: "Marketplace", description: "Property and service marketplace", multiplier: 1.3 },
]

export default function PurchaseAdPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [pricing, setPricing] = useState<any>(null)
  const [availableSlots, setAvailableSlots] = useState<number[]>([])
  
  const [formData, setFormData] = useState({
    location: "" as AdLocation | "",
    duration: "24",
    slots: "1",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    // Set default start date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const startDate = tomorrow.toISOString().split('T')[0]
    
    // Set default end date to day after tomorrow
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)
    const endDate = dayAfter.toISOString().split('T')[0]
    
    setFormData(prev => ({ ...prev, startDate, endDate }))
  }, [])

  useEffect(() => {
    if (formData.location && formData.startDate && formData.endDate && formData.duration && formData.slots) {
      calculatePricing()
      checkAvailability()
    }
  }, [formData])

  const calculatePricing = async () => {
    try {
      const result = await getAdPricing({
        location: formData.location as AdLocation,
        duration: parseInt(formData.duration),
        slots: parseInt(formData.slots),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      })

      if (result.success) {
        setPricing(result.pricing)
      }
    } catch (error) {
      console.error("Failed to calculate pricing:", error)
    }
  }

  const checkAvailability = async () => {
    try {
      const result = await checkAdSlotAvailability(
        formData.location as AdLocation,
        formData.startDate,
        formData.endDate
      )

      if (result.success) {
        setAvailableSlots(result.availableSlots || [])
      }
    } catch (error) {
      console.error("Failed to check availability:", error)
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
      const result = await purchaseAd({
        advertisementId: params.id as string,
        location: formData.location as AdLocation,
        duration: parseInt(formData.duration),
        slots: parseInt(formData.slots),
        startDate: formData.startDate,
        endDate: formData.endDate,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/advertising")
        }, 3000)
      } else {
        setError(result.error || "Failed to purchase ad slots. Please try again.")
      }
    } catch (err: any) {
      console.error("Ad purchase error:", err)
      setError(err.message || "Failed to purchase ad slots. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectedLocation = adLocations.find(loc => loc.value === formData.location)
  const canPurchase = formData.location && formData.startDate && formData.endDate && 
                     availableSlots.length >= parseInt(formData.slots)

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Purchase Ad Slots</h1>
            <p className="text-muted-foreground">
              Select your preferred ad placement, timing, and duration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Ad Placement Options
                  </CardTitle>
                  <CardDescription>
                    Configure your advertising campaign
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
                        Ad slots purchased successfully! Redirecting to dashboard...
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Ad Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select where your ad will appear" />
                        </SelectTrigger>
                        <SelectContent>
                          {adLocations.map((location) => (
                            <SelectItem key={location.value} value={location.value}>
                              <div>
                                <div className="font-medium">{location.label}</div>
                                <div className="text-sm text-muted-foreground">{location.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          min={formData.startDate}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (hours) *</Label>
                        <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="6">6 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours (1 day)</SelectItem>
                            <SelectItem value="72">72 hours (3 days)</SelectItem>
                            <SelectItem value="168">168 hours (1 week)</SelectItem>
                            <SelectItem value="720">720 hours (1 month)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slots">Number of Slots *</Label>
                        <Select value={formData.slots} onValueChange={(value) => handleInputChange("slots", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 slot</SelectItem>
                            <SelectItem value="2">2 slots</SelectItem>
                            <SelectItem value="3">3 slots</SelectItem>
                            <SelectItem value="4">4 slots</SelectItem>
                            <SelectItem value="5">5 slots (all)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Availability Check */}
                    {formData.location && formData.startDate && formData.endDate && (
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">Slot Availability</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={availableSlots.length >= parseInt(formData.slots) ? "default" : "destructive"}>
                            {availableSlots.length} of 5 slots available
                          </Badge>
                          {availableSlots.length < parseInt(formData.slots) && (
                            <span className="text-sm text-red-600">
                              Not enough slots available for selected period
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button type="submit" disabled={loading || !canPurchase}>
                        {loading ? "Processing..." : "Purchase Ad Slots"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-6">
              {/* Pricing Breakdown */}
              {pricing && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Base Cost:</span>
                      <span>${pricing.breakdown.baseCost.toFixed(2)}</span>
                    </div>
                    {pricing.breakdown.locationAdjustment > 0 && (
                      <div className="flex justify-between">
                        <span>Location Premium:</span>
                        <span>+${pricing.breakdown.locationAdjustment.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.breakdown.durationDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discounts:</span>
                        <span>-${pricing.breakdown.durationDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${pricing.totalCost.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Info */}
              {selectedLocation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">{selectedLocation.label}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {selectedLocation.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span>${AD_PRICING_CONFIG?.baseHourlyRate ?? 5}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location Multiplier:</span>
                        <span>{selectedLocation.multiplier}x</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Effective Rate:</span>
                        <span>${((AD_PRICING_CONFIG?.baseHourlyRate ?? 5) * selectedLocation.multiplier).toFixed(2)}/hour</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Discounts Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Available Discounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium">Duration Discounts:</h5>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• 24+ hours: 5% off</li>
                      <li>• 3+ days: 10% off</li>
                      <li>• 1+ week: 15% off</li>
                      <li>• 1+ month: 20% off</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium">Bulk Discounts:</h5>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• 2 slots: 5% off</li>
                      <li>• 3 slots: 10% off</li>
                      <li>• 4 slots: 15% off</li>
                      <li>• 5 slots: 20% off</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
