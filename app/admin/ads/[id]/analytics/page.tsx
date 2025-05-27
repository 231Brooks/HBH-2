import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdvertisementById, getAdAnalytics } from "@/app/actions/ad-actions"
import { AdPerformanceChart } from "@/components/ad-management/ad-performance-chart"
import { AdPerformanceMetrics } from "@/components/ad-management/ad-performance-metrics"
import { AdEventsList } from "@/components/ad-management/ad-events-list"

export const dynamic = "force-dynamic"

interface AdminAdAnalyticsPageProps {
  params: {
    id: string
  }
}

export default async function AdminAdAnalyticsPage({ params }: AdminAdAnalyticsPageProps) {
  const [adResult, analyticsResult] = await Promise.all([
    getAdvertisementById(params.id),
    getAdAnalytics({ adId: params.id }),
  ])

  const { ad } = adResult
  const { analytics } = analyticsResult

  if (!ad) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">{ad.name}</h1>
      <p className="text-muted-foreground mb-6">Performance analytics and insights</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AdPerformanceMetrics analytics={analytics} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Performance</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Impressions and clicks over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AdPerformanceChart analytics={analytics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Day-by-day breakdown of ad performance</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Daily performance table would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Daily performance data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest impressions and clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <AdEventsList adId={ad.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
