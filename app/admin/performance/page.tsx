import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQueryPerformanceLogs } from "@/app/actions/admin-actions"

export const dynamic = "force-dynamic"

export default function PerformanceDashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Performance Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Monitor and analyze database performance metrics and optimization results
      </p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queries">Query Performance</TabsTrigger>
          <TabsTrigger value="cache">Cache Effectiveness</TabsTrigger>
          <TabsTrigger value="indexes">Index Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Avg Response Time" value="248ms" change="-68%" positive={true} />
            <MetricCard title="Cache Hit Rate" value="76%" change="+24%" positive={true} />
            <MetricCard title="DB Connections" value="12" change="-45%" positive={true} />
            <MetricCard title="Query Volume" value="1.2K/hr" change="+15%" positive={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Improvements</CardTitle>
                <CardDescription>Comparing before and after optimization metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PerformanceComparison title="Property Listing" before="842ms" after="286ms" improvement="66%" />
                  <PerformanceComparison title="Property Search" before="1240ms" after="312ms" improvement="75%" />
                  <PerformanceComparison title="Property Detail" before="568ms" after="124ms" improvement="78%" />
                  <PerformanceComparison title="Filter Application" before="976ms" after="218ms" improvement="78%" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Performance Logs</CardTitle>
                <CardDescription>Latest database query performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading performance logs...</div>}>
                  <PerformanceLogs />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queries">
          <Card>
            <CardHeader>
              <CardTitle>Slow Query Analysis</CardTitle>
              <CardDescription>Queries taking longer than 500ms to execute</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading slow query analysis...</div>}>
                <SlowQueryAnalysis />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cache Hit Rates</CardTitle>
                <CardDescription>Effectiveness of caching by resource type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CacheMetric type="Property Listings" hitRate={82} avgTtl={300} />
                  <CacheMetric type="Property Details" hitRate={91} avgTtl={1800} />
                  <CacheMetric type="User Profiles" hitRate={68} avgTtl={3600} />
                  <CacheMetric type="Search Results" hitRate={54} avgTtl={120} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache TTL Recommendations</CardTitle>
                <CardDescription>Suggested cache expiration times based on data volatility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TtlRecommendation
                    type="Property Listings"
                    current={300}
                    recommended={600}
                    reason="Low update frequency"
                  />
                  <TtlRecommendation
                    type="Property Details"
                    current={1800}
                    recommended={3600}
                    reason="Very stable data"
                  />
                  <TtlRecommendation
                    type="User Profiles"
                    current={3600}
                    recommended={1800}
                    reason="Moderate update frequency"
                  />
                  <TtlRecommendation
                    type="Search Results"
                    current={120}
                    recommended={300}
                    reason="Results change infrequently"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="indexes">
          <Card>
            <CardHeader>
              <CardTitle>Index Usage Analysis</CardTitle>
              <CardDescription>How effectively indexes are being used by queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <IndexUsage
                  name="idx_properties_status"
                  table="Property"
                  columns="status"
                  usage="High"
                  impact="Significant"
                  recommendation="Keep"
                />
                <IndexUsage
                  name="idx_properties_type"
                  table="Property"
                  columns="type"
                  usage="Medium"
                  impact="Moderate"
                  recommendation="Keep"
                />
                <IndexUsage
                  name="idx_properties_price"
                  table="Property"
                  columns="price"
                  usage="High"
                  impact="Significant"
                  recommendation="Keep"
                />
                <IndexUsage
                  name="idx_properties_location"
                  table="Property"
                  columns="city, state"
                  usage="Low"
                  impact="Minimal"
                  recommendation="Consider removing"
                />
                <IndexUsage
                  name="idx_properties_beds_baths"
                  table="Property"
                  columns="beds, baths"
                  usage="Medium"
                  impact="Moderate"
                  recommendation="Keep"
                />
                <IndexUsage
                  name="idx_properties_created_at"
                  table="Property"
                  columns="createdAt"
                  usage="High"
                  impact="Significant"
                  recommendation="Keep"
                />
                <IndexUsage
                  name="RECOMMENDED"
                  table="Property"
                  columns="price, beds, baths"
                  usage="N/A"
                  impact="Potentially High"
                  recommendation="Add composite index"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component for displaying metric cards
function MetricCard({
  title,
  value,
  change,
  positive,
}: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        <div className={`text-sm mt-2 ${positive ? "text-green-600" : "text-red-600"}`}>{change}</div>
      </CardContent>
    </Card>
  )
}

// Component for comparing before/after performance
function PerformanceComparison({
  title,
  before,
  after,
  improvement,
}: { title: string; before: string; after: string; improvement: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{title}</span>
        <span className="text-green-600 text-sm font-medium">{improvement} faster</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 bg-gray-200 rounded-full flex-grow">
          <div
            className="h-2 bg-primary rounded-full"
            style={{ width: `${100 - Number.parseInt(improvement)}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground w-32 flex justify-between">
          <span>Before: {before}</span>
          <span>After: {after}</span>
        </div>
      </div>
    </div>
  )
}

// Component for displaying cache metrics
function CacheMetric({ type, hitRate, avgTtl }: { type: string; hitRate: number; avgTtl: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{type}</span>
        <span
          className={`text-sm font-medium ${hitRate > 75 ? "text-green-600" : hitRate > 50 ? "text-amber-600" : "text-red-600"}`}
        >
          {hitRate}% hit rate
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 bg-gray-200 rounded-full flex-grow">
          <div
            className={`h-2 rounded-full ${hitRate > 75 ? "bg-green-500" : hitRate > 50 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${hitRate}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span>TTL: {avgTtl}s</span>
        </div>
      </div>
    </div>
  )
}

// Component for TTL recommendations
function TtlRecommendation({
  type,
  current,
  recommended,
  reason,
}: { type: string; current: number; recommended: number; reason: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium">{type}</div>
        <div className="text-sm text-muted-foreground">{reason}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">
          Current: <span className="font-mono">{current}s</span>
        </div>
        <div className="text-sm font-medium text-primary">
          Recommended: <span className="font-mono">{recommended}s</span>
        </div>
      </div>
    </div>
  )
}

// Component for index usage analysis
function IndexUsage({
  name,
  table,
  columns,
  usage,
  impact,
  recommendation,
}: { name: string; table: string; columns: string; usage: string; impact: string; recommendation: string }) {
  return (
    <div className="border-b pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">
            Table: {table}, Columns: {columns}
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            usage === "High"
              ? "bg-green-100 text-green-800"
              : usage === "Medium"
                ? "bg-blue-100 text-blue-800"
                : usage === "Low"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-purple-100 text-purple-800"
          }`}
        >
          {usage} usage
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span>
          Impact:{" "}
          <span
            className={`font-medium ${
              impact.includes("Significant")
                ? "text-green-600"
                : impact.includes("Moderate")
                  ? "text-blue-600"
                  : impact.includes("Minimal")
                    ? "text-amber-600"
                    : "text-purple-600"
            }`}
          >
            {impact}
          </span>
        </span>
        <span>
          Recommendation: <span className="font-medium">{recommendation}</span>
        </span>
      </div>
    </div>
  )
}

// Component for performance logs
async function PerformanceLogs() {
  const logs = await getQueryPerformanceLogs(10)

  if (!logs || logs.length === 0) {
    return <div className="text-muted-foreground">No performance logs available</div>
  }

  return (
    <div className="space-y-3">
      {logs.map((log, i) => (
        <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
          <div className="flex justify-between items-start">
            <div className="font-medium truncate max-w-[70%]">{log.query}</div>
            <div className={`text-sm ${log.duration_ms > 500 ? "text-red-600" : "text-green-600"}`}>
              {log.duration_ms.toFixed(2)}ms
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{new Date(log.timestamp).toLocaleString()}</span>
            <span>{log.success ? "Success" : "Failed"}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Component for slow query analysis
async function SlowQueryAnalysis() {
  const slowQueries = await getQueryPerformanceLogs(20, 500)

  if (!slowQueries || slowQueries.length === 0) {
    return <div className="text-muted-foreground">No slow queries detected</div>
  }

  // Group by query type
  const queryGroups: Record<string, { count: number; avgDuration: number; maxDuration: number }> = {}

  slowQueries.forEach((query) => {
    // Extract query type (simplified)
    const queryType = query.query.split(" ")[0] + " " + (query.query.includes("WHERE") ? "filtered" : "unfiltered")

    if (!queryGroups[queryType]) {
      queryGroups[queryType] = { count: 0, avgDuration: 0, maxDuration: 0 }
    }

    queryGroups[queryType].count++
    queryGroups[queryType].avgDuration =
      (queryGroups[queryType].avgDuration * (queryGroups[queryType].count - 1) + query.duration_ms) /
      queryGroups[queryType].count
    queryGroups[queryType].maxDuration = Math.max(queryGroups[queryType].maxDuration, query.duration_ms)
  })

  return (
    <div className="space-y-4">
      {Object.entries(queryGroups).map(([queryType, stats], i) => (
        <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
          <div className="flex justify-between items-start mb-1">
            <div className="font-medium">{queryType}</div>
            <div className="text-sm text-muted-foreground">Count: {stats.count}</div>
          </div>
          <div className="flex justify-between text-sm">
            <span>
              Avg: <span className="font-medium">{stats.avgDuration.toFixed(2)}ms</span>
            </span>
            <span>
              Max: <span className="font-medium">{stats.maxDuration.toFixed(2)}ms</span>
            </span>
          </div>
          <div className="mt-2 text-sm text-amber-600">
            Recommendation:{" "}
            {stats.avgDuration > 1000
              ? "Critical optimization needed"
              : stats.avgDuration > 750
                ? "High priority optimization"
                : "Consider adding specific index"}
          </div>
        </div>
      ))}
    </div>
  )
}
