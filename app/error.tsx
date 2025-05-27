"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    logger.error("Client-side error occurred", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified and is working on a solution.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-left max-w-lg overflow-auto">
          <p className="font-mono text-sm text-red-600">{error.message}</p>
          <p className="font-mono text-xs text-gray-500 mt-2">{error.stack}</p>
        </div>
      )}
    </div>
  )
}
