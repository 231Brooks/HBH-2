import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMyAdvertisements } from "@/app/actions/advertising-actions"
import { formatDate } from "@/lib/utils"
import { PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminAdsPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <p className="text-muted-foreground">Create and manage advertisements across the platform</p>
        </div>
        <Link href="/admin/ads/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Ad
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Ads</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Advertisements</CardTitle>
              <CardDescription>Manage all advertisements across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading advertisements...</div>}>
                <AdsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Advertisements</CardTitle>
              <CardDescription>Currently active advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading active advertisements...</div>}>
                <AdsList isActive={true} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Advertisements</CardTitle>
              <CardDescription>Paused or scheduled advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading inactive advertisements...</div>}>
                <AdsList isActive={false} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance</CardTitle>
              <CardDescription>Analytics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading analytics...</div>}>
                <AdAnalytics />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function AdsList({ isActive }: { isActive?: boolean }) {
  const { advertisements, total } = await getMyAdvertisements({ limit: 50 })
  const ads = advertisements || []

  if (ads.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No advertisements found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Slot</th>
            <th className="text-left py-2">Start Date</th>
            <th className="text-left py-2">End Date</th>
            <th className="text-center py-2">Status</th>
            <th className="text-right py-2">Impressions</th>
            <th className="text-right py-2">Clicks</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad: any) => (
            <tr key={ad.id} className="border-b last:border-0">
              <td className="py-2">{ad.title}</td>
              <td className="py-2">-</td>
              <td className="py-2">{formatDate(ad.createdAt)}</td>
              <td className="py-2">-</td>
              <td className="py-2 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ad.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {ad.status}
                </span>
              </td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/ads/${ad.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/ads/${ad.id}/analytics`}>
                    <Button variant="outline" size="sm">
                      Analytics
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-muted-foreground text-right">
        Total: {total} advertisement{total !== 1 ? "s" : ""}
      </div>
    </div>
  )
}

async function AdAnalytics() {
  // This would be implemented with charts and detailed analytics
  // For now, we'll just show a placeholder
  return (
    <div className="text-center py-8">
      <p>Ad analytics dashboard would be implemented here with charts and metrics.</p>
      <p className="text-muted-foreground mt-2">
        This would include impressions, clicks, CTR, and other performance metrics over time.
      </p>
    </div>
  )
}
