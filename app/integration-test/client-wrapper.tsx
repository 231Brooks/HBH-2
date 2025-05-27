"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Use dynamic imports with ssr: false to prevent server-side rendering
const SupabaseTest = dynamic(() => import("./supabase-test-client").then((mod) => mod.SupabaseTest), { ssr: false })
const UpstashTest = dynamic(() => import("./upstash-test-client").then((mod) => mod.UpstashTest), { ssr: false })

export function IntegrationTestWrapper() {
  return (
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
  )
}
