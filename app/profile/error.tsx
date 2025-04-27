"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        We encountered an error while loading your profile. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
