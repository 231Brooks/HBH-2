"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const description = searchParams.get("description")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "config":
        return "Authentication configuration error. Please contact support."
      case "session_exchange":
        return "Failed to complete sign in. Please try again."
      case "callback":
        return "Authentication callback error. Please try again."
      case "access_denied":
        return "Access was denied. You may have cancelled the sign in process."
      default:
        return description || "An authentication error occurred. Please try again."
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-red-600">Authentication Error</CardTitle>
            <CardDescription className="text-center">
              There was a problem signing you in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
