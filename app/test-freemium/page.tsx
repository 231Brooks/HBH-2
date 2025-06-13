"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  Crown,
  MessageSquare,
  Building2,
  DollarSign,
  Users,
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"
import { createServiceRequest } from "@/app/actions/service-request-actions"
import { checkListingPermission } from "@/app/actions/subscription-actions"
import { ServiceCategory, ServiceUrgency } from "@prisma/client"

export default function TestFreemiumPage() {
  const { user } = useSupabase()
  const { userRole, isProfessional } = usePermissions()
  const [testResults, setTestResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results = []

    // Test 1: Check user authentication
    results.push({
      name: "User Authentication",
      status: user ? "success" : "error",
      message: user ? `Logged in as ${user.email}` : "Not authenticated",
    })

    // Test 2: Check user role
    results.push({
      name: "User Role",
      status: "info",
      message: `Current role: ${userRole}`,
    })

    // Test 3: Check professional permissions
    results.push({
      name: "Professional Permissions",
      status: isProfessional ? "success" : "info",
      message: isProfessional ? "Has professional permissions" : "Regular user permissions",
    })

    if (user) {
      // Test 4: Check listing permissions
      try {
        const listingCheck = await checkListingPermission()
        results.push({
          name: "Service Listing Permission",
          status: listingCheck.allowed ? "success" : "warning",
          message: listingCheck.allowed ? "Can create service listings" : listingCheck.reason,
        })
      } catch (error) {
        results.push({
          name: "Service Listing Permission",
          status: "error",
          message: "Failed to check permissions",
        })
      }

      // Test 5: Try creating a test service request
      try {
        const testRequest = await createServiceRequest({
          title: "Test Service Request",
          description: "This is a test service request to verify the freemium model is working.",
          category: ServiceCategory.HOME_INSPECTION,
          budget: "$500-800",
          location: "Test City, TX",
          urgency: ServiceUrgency.NORMAL,
        })

        results.push({
          name: "Service Request Creation",
          status: testRequest.success ? "success" : "error",
          message: testRequest.success ? "Successfully created test service request" : testRequest.error,
        })
      } catch (error) {
        results.push({
          name: "Service Request Creation",
          status: "error",
          message: "Failed to create service request",
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
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Freemium Model Test</h1>
          <p className="text-muted-foreground">
            Test the freemium model implementation and subscription features
          </p>
        </div>

        {/* Freemium Model Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Free Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Use all services for free</li>
                <li>• Browse marketplace</li>
                <li>• Contact professionals</li>
                <li>• Create service requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Professional Monthly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">$50/month</div>
              <ul className="text-sm space-y-1">
                <li>• Unlimited service listings</li>
                <li>• No transaction fees</li>
                <li>• Professional dashboard</li>
                <li>• Priority support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pay Per Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">$10/listing</div>
              <ul className="text-sm space-y-1">
                <li>• Pay as you go</li>
                <li>• 5% transaction fees</li>
                <li>• Professional dashboard</li>
                <li>• Flexible pricing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Test Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Tests</CardTitle>
            <CardDescription>
              Run tests to verify the freemium model is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={testing} className="mb-6">
              {testing ? "Running Tests..." : "Run Tests"}
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

        {/* Current User Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Authentication</h4>
                <Badge variant={user ? "default" : "destructive"}>
                  {user ? "Authenticated" : "Not Authenticated"}
                </Badge>
                {user && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">User Role</h4>
                <Badge variant="outline">{userRole}</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {isProfessional ? "Professional account" : "Regular user account"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <a href="/settings/subscription">
              <Crown className="h-4 w-4 mr-2" />
              Subscription Settings
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/services">
              <Building2 className="h-4 w-4 mr-2" />
              Services
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/marketplace">
              <MessageSquare className="h-4 w-4 mr-2" />
              Marketplace
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
