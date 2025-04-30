"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function ActivitiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Activities page error:", error)
  }, [error])

  return (
    <div className="container py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">We encountered an error loading the activities page.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
