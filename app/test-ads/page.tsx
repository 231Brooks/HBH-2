"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react"
import { createAd, getAdPricing, getAdsByLocation } from "@/app/actions/advertising-actions"
import { AdLocation } from "@prisma/client"
import { AD_PRICING_CONFIG } from "@/lib/ad-pricing"
import { ProtectedRoute } from "@/components/protected-route"

export default function TestAdsPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results = []

    // Test 1: Check pricing calculation
    try {
      const pricingResult = await getAdPricing({
        location: AdLocation.FRONTPAGE,
        duration: 24,
        slots: 2,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })

      results.push({
        name: "Pricing Calculation",
        status: pricingResult.success ? "success" : "error",
        message: pricingResult.success 
          ? `Front page, 24h, 2 slots: $${pricingResult.pricing?.totalCost.toFixed(2)}`
          : pricingResult.error,
      })
    } catch (error) {
      results.push({
        name: "Pricing Calculation",
        status: "error",
        message: "Failed to calculate pricing",
      })
    }

    // Test 2: Create test advertisement
    try {
      const adResult = await createAd({
        title: "Test Professional Service",
        description: "This is a test advertisement to verify the advertising system is working correctly.",
        imageUrl: "https://via.placeholder.com/400x300/0066cc/ffffff?text=Test+Ad",
        linkUrl: "https://example.com",
      })

      results.push({
        name: "Advertisement Creation",
        status: adResult.success ? "success" : "error",
        message: adResult.success 
          ? `Created ad: ${adResult.advertisement?.title}`
          : adResult.error,
      })
    } catch (error) {
      results.push({
        name: "Advertisement Creation",
        status: "error",
        message: "Failed to create advertisement",
      })
    }

    // Test 3: Check ad retrieval for different locations
    const locations = [AdLocation.FRONTPAGE, AdLocation.SERVICES, AdLocation.MARKETPLACE, AdLocation.BOTTOM_GLOBAL]
    
    for (const location of locations) {
      try {
        const adsResult = await getAdsByLocation(location)
        results.push({
          name: `Ads for ${location}`,
          status: adsResult.success ? "success" : "error",
          message: adsResult.success 
            ? `Found ${adsResult.ads?.length || 0} ads`
            : adsResult.error,
        })
      } catch (error) {
        results.push({
          name: `Ads for ${location}`,
          status: "error",
          message: "Failed to retrieve ads",
        })
      }
    }

    setTestResults(results)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Advertising System Test</h1>
            <p className="text-muted-foreground">
              Test the advertising system implementation and pricing algorithm
            </p>
          </div>

          {/* Pricing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Base Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${AD_PRICING_CONFIG?.baseHourlyRate ?? 5}/hour</div>
                <p className="text-sm text-muted-foreground">per ad slot</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Front Page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${((AD_PRICING_CONFIG?.baseHourlyRate ?? 5) * (AD_PRICING_CONFIG?.locationMultipliers?.FRONTPAGE ?? 2)).toFixed(0)}/hour
                </div>
                <p className="text-sm text-muted-foreground">premium location</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ad Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">spots per location</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Max Discount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">40%</div>
                <p className="text-sm text-muted-foreground">bulk + duration</p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Algorithm Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pricing Algorithm</CardTitle>
              <CardDescription>How our advertising pricing works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Location Multipliers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bottom Global:</span>
                      <Badge variant="outline">1.5x</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Front Page:</span>
                      <Badge variant="outline">2.0x</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <Badge variant="outline">1.2x</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketplace:</span>
                      <Badge variant="outline">1.3x</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Discount Structure</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Duration Discounts:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• 24+ hours: 5% off</li>
                        <li>• 3+ days: 10% off</li>
                        <li>• 1+ week: 15% off</li>
                        <li>• 1+ month: 20% off</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Bulk Discounts:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• 2 slots: 5% off</li>
                        <li>• 3 slots: 10% off</li>
                        <li>• 4 slots: 15% off</li>
                        <li>• 5 slots: 20% off</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>System Tests</CardTitle>
              <CardDescription>
                Run tests to verify the advertising system is working correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runTests} disabled={testing} className="mb-6">
                {testing ? "Running Tests..." : "Run Advertising Tests"}
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(result.status)}
                        <h4 className="font-medium">{result.name}</h4>
                      </div>
                      <p className="text-sm">{result.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Pricing Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Example Pricing Scenarios</CardTitle>
              <CardDescription>Common advertising packages and their costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Starter Package</h4>
                  <div className="text-2xl font-bold mb-2">$6/day</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Services section</li>
                    <li>• 1 slot, 24 hours</li>
                    <li>• 5% duration discount</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Professional Package</h4>
                  <div className="text-2xl font-bold mb-2">$38/day</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Front page premium</li>
                    <li>• 2 slots, 24 hours</li>
                    <li>• 10% combined discount</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Enterprise Package</h4>
                  <div className="text-2xl font-bold mb-2">$672/month</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All locations</li>
                    <li>• 5 slots, 720 hours</li>
                    <li>• 40% maximum discount</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="/advertising">
                <TrendingUp className="h-4 w-4 mr-2" />
                Advertising Dashboard
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/advertising/create">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Advertisement
              </a>
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
