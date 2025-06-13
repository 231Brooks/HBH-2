"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  MapPin,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { getMyAdvertisements } from "@/app/actions/advertising-actions"
import { ProtectedRoute } from "@/components/protected-route"
import { formatDistanceToNow } from "date-fns"
import { AD_PRICING_CONFIG } from "@/lib/advertising"

interface Advertisement {
  id: string
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  status: string
  createdAt: Date
  service?: {
    id: string
    name: string
    category: string
  }
  purchases: Array<{
    id: string
    totalCost: number
    duration: number
    startDate: Date
    endDate: Date
    status: string
    adSlots: Array<{
      placement: {
        location: string
        position: number
      }
    }>
  }>
  analytics: Array<{
    date: Date
    impressions: number
    clicks: number
    conversions: number
    cost: number
    location: string
  }>
}

export default function AdvertisingPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAdvertisements()
  }, [])

  const loadAdvertisements = async () => {
    try {
      const result = await getMyAdvertisements()
      if (result.success) {
        setAdvertisements(result.advertisements || [])
      }
    } catch (error) {
      console.error("Failed to load advertisements:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totals = advertisements.reduce(
    (acc, ad) => {
      const adTotals = ad.analytics.reduce(
        (adAcc, analytics) => ({
          impressions: adAcc.impressions + analytics.impressions,
          clicks: adAcc.clicks + analytics.clicks,
          conversions: adAcc.conversions + analytics.conversions,
          cost: adAcc.cost + analytics.cost,
        }),
        { impressions: 0, clicks: 0, conversions: 0, cost: 0 }
      )
      
      return {
        impressions: acc.impressions + adTotals.impressions,
        clicks: acc.clicks + adTotals.clicks,
        conversions: acc.conversions + adTotals.conversions,
        cost: acc.cost + adTotals.cost,
      }
    },
    { impressions: 0, clicks: 0, conversions: 0, cost: 0 }
  )

  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Advertising Dashboard</h1>
            <p className="text-muted-foreground">Manage your ads and track performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/advertising/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Ad
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                  <p className="text-2xl font-bold">{totals.impressions.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
                </div>
                <MousePointer className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                  <p className="text-2xl font-bold">{ctr.toFixed(2)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${totals.cost.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Advertising Pricing</CardTitle>
            <CardDescription>Our competitive advertising rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Base Rate</h4>
                <p className="text-2xl font-bold text-primary">${AD_PRICING_CONFIG.baseHourlyRate}/hour</p>
                <p className="text-sm text-muted-foreground">per ad slot</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Front Page</h4>
                <p className="text-2xl font-bold text-primary">
                  ${(AD_PRICING_CONFIG.baseHourlyRate * AD_PRICING_CONFIG.locationMultipliers.FRONTPAGE).toFixed(0)}/hour
                </p>
                <p className="text-sm text-muted-foreground">premium location</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Bulk Discount</h4>
                <p className="text-2xl font-bold text-primary">Up to 20%</p>
                <p className="text-sm text-muted-foreground">for 5 slots</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Duration Discount</h4>
                <p className="text-2xl font-bold text-primary">Up to 20%</p>
                <p className="text-sm text-muted-foreground">for 1 month+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advertisements List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">All Ads ({advertisements.length})</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : advertisements.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {advertisements.map((ad) => (
                  <AdCard key={ad.id} advertisement={ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements yet</h3>
                <p className="text-gray-500 mb-4">Create your first ad to start promoting your services.</p>
                <Button asChild>
                  <Link href="/advertising/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Ad
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Active ads will appear here</h3>
              <p className="text-gray-500">Ads that are currently running and visible to users.</p>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pending ads will appear here</h3>
              <p className="text-gray-500">Ads waiting for approval or payment.</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed analytics coming soon</h3>
              <p className="text-gray-500">View comprehensive performance metrics for your ads.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

interface AdCardProps {
  advertisement: Advertisement
}

function AdCard({ advertisement }: AdCardProps) {
  const latestPurchase = advertisement.purchases[0]
  const totalImpressions = advertisement.analytics.reduce((sum, a) => sum + a.impressions, 0)
  const totalClicks = advertisement.analytics.reduce((sum, a) => sum + a.clicks, 0)
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{advertisement.title}</CardTitle>
            {advertisement.description && (
              <CardDescription className="text-base">{advertisement.description}</CardDescription>
            )}
          </div>
          <Badge variant={advertisement.status === "ACTIVE" ? "default" : "secondary"}>
            {advertisement.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Impressions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{ctr.toFixed(2)}%</p>
            <p className="text-sm text-muted-foreground">CTR</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              ${latestPurchase ? latestPurchase.totalCost.toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Spent</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Created {formatDistanceToNow(new Date(advertisement.createdAt), { addSuffix: true })}</span>
            {advertisement.service && (
              <Badge variant="outline">{advertisement.service.category.replace('_', ' ')}</Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/advertising/${advertisement.id}`}>
                View Details
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/advertising/${advertisement.id}/purchase`}>
                <DollarSign className="h-4 w-4 mr-2" />
                Buy Slots
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
