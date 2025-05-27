"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Log error to monitoring service
    if (error && onError) {
      const errorInfo = { componentStack: error.stack || "" } as React.ErrorInfo
      onError(error, errorInfo)
    }
  }, [error, onError])

  if (error) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 border border-red-100 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
        <p className="text-red-600 mb-4 text-center max-w-md">
          We encountered an error while rendering this component. Our team has been notified.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null)
            window.location.reload()
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  try {
    return <>{children}</>
  } catch (e) {
    if (e instanceof Error) {
      setError(e)
    } else {
      setError(new Error(String(e)))
    }
    return null
  }
}

// Fallback UI components for different scenarios
export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading content...</p>
      </div>
    </div>
  )
}

export function DataFetchFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-amber-50 border border-amber-100 rounded-lg">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold text-amber-700 mb-2">Unable to load data</h2>
      <p className="text-amber-600 mb-4 text-center max-w-md">
        We couldn't retrieve the data you requested. This could be due to a network issue or server problem.
      </p>
      <Button
        variant="outline"
        onClick={() => {
          window.location.reload()
        }}
      >
        Retry
      </Button>
    </div>
  )
}
