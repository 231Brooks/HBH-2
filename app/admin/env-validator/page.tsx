import { Suspense } from "react"
import type { Metadata } from "next"
import EnvValidatorClient from "./env-validator-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Environment Variables Validator",
  description: "Validate all environment variables and test service connections",
}

export default function EnvValidatorPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Validator</h1>
      <p className="text-muted-foreground mb-8">
        This tool validates all environment variables and tests connections to external services.
      </p>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-48" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        }
      >
        <EnvValidatorClient />
      </Suspense>
    </div>
  )
}
