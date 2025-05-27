import { Suspense } from "react"
import type { Metadata } from "next"
import DiagnosticsClient from "./diagnostics-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "System Diagnostics",
  description: "Verify all environment variables and integrations are working properly",
}

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
      <p className="text-muted-foreground mb-8">
        This page tests all environment variables and integrations to ensure they are functioning properly.
      </p>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2">
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
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              }
            >
              <DiagnosticsClient />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <DiagnosticsClient category="database" />
          </Suspense>
        </TabsContent>

        <TabsContent value="auth">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <DiagnosticsClient category="auth" />
          </Suspense>
        </TabsContent>

        <TabsContent value="storage">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <DiagnosticsClient category="storage" />
          </Suspense>
        </TabsContent>

        <TabsContent value="messaging">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <DiagnosticsClient category="messaging" />
          </Suspense>
        </TabsContent>

        <TabsContent value="payment">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <DiagnosticsClient category="payment" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
