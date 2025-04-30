import { Suspense } from "react"
import { SupabaseTest } from "./supabase-test"
import { UpstashTest } from "./upstash-test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntegrationTestPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Integration Test Dashboard</h1>
        <p className="text-muted-foreground mt-2">Verify that Supabase and Upstash Redis are properly connected</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Integration Test</CardTitle>
            <CardDescription>Tests connection and basic operations with Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading Supabase test...</div>}>
              <SupabaseTest />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upstash Redis Integration Test</CardTitle>
            <CardDescription>Tests connection and basic operations with Upstash Redis</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading Upstash test...</div>}>
              <UpstashTest />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
