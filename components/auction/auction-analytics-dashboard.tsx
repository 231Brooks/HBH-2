"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  DollarSign, 
  Download,
  BarChart3,
  Activity
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AuctionAnalyticsProps {
  propertyId: string
}

interface AnalyticsData {
  totalBids: number
  uniqueBidders: number
  highestBid: number
  averageBid: number
  viewCount: number
  watchListCount: number
  reservePriceMet: boolean
  extensionCount: number
  finalSalePrice?: number
  performanceScore: number
  bidsByHour: { hour: number; count: number }[]
  bidderActivity: { bidderId: string; bidderName: string; bidCount: number; totalAmount: number; averageBid: number }[]
  extensions: any[]
  property: any
}

export function AuctionAnalyticsDashboard({ propertyId }: AuctionAnalyticsProps) {
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [propertyId])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/auction/analytics?propertyId=${propertyId}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        throw new Error(data.error || "Failed to fetch analytics")
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load auction analytics.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    try {
      setIsExporting(true)
      
      if (format === "csv") {
        const response = await fetch(`/api/auction/export-bids?propertyId=${propertyId}&format=csv`)
        
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `auction-bids-${propertyId}.csv`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          toast({
            title: "Export Successful",
            description: "Bid history has been downloaded as CSV.",
          })
        } else {
          throw new Error("Export failed")
        }
      } else {
        const response = await fetch("/api/auction/export-bids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, includeAnalytics: true })
        })
        
        const data = await response.json()
        
        if (data.success) {
          const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `auction-data-${propertyId}.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          toast({
            title: "Export Successful",
            description: "Complete auction data has been downloaded as JSON.",
          })
        } else {
          throw new Error(data.error || "Export failed")
        }
      }
    } catch (error: any) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export auction data.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No analytics data available.</p>
        </CardContent>
      </Card>
    )
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Auction Analytics</h2>
          <p className="text-gray-600">{analytics.property?.title}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold">{analytics.totalBids}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Bidders</p>
                <p className="text-2xl font-bold">{analytics.uniqueBidders}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Watchers</p>
                <p className="text-2xl font-bold">{analytics.watchListCount}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${getPerformanceColor(analytics.performanceScore)}`}>
                    {analytics.performanceScore}%
                  </p>
                  {getPerformanceBadge(analytics.performanceScore)}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Highest Bid</p>
                <p className="text-xl font-bold">${analytics.highestBid?.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Bid</p>
                <p className="text-xl font-bold">${analytics.averageBid?.toLocaleString()}</p>
              </div>
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Extensions</p>
                <p className="text-xl font-bold">{analytics.extensionCount}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reserve Price Status */}
      {analytics.property?.reservePrice && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reserve Price Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-semibold">
                    ${analytics.property.reservePrice.toLocaleString()}
                  </p>
                  <Badge variant={analytics.reservePriceMet ? "default" : "secondary"}>
                    {analytics.reservePriceMet ? "Met" : "Not Met"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
