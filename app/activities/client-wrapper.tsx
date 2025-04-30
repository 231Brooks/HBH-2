"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component with SSR disabled
const ActivitiesClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => <LoadingActivities />,
})

function LoadingActivities() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ClientWrapper() {
  return (
    <Suspense fallback={<LoadingActivities />}>
      <ActivitiesClientPage />
    </Suspense>
  )
}
