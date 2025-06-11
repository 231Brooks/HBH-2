import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

async function getDeploymentStatus() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/deployment-check`, {
      cache: "no-store",
    })
    return await response.json()
  } catch (error) {
    return {
      deploymentReady: false,
      issues: ["Failed to fetch deployment status"],
      warnings: [],
      recommendations: [],
    }
  }
}

export default async function DeploymentStatusPage() {
  const status = await getDeploymentStatus()

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Deployment Status</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status.deploymentReady ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Deployment Readiness
            </CardTitle>
            <CardDescription>Overall status of your deployment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={status.deploymentReady ? "default" : "destructive"}>
              {status.deploymentReady ? "Ready to Deploy" : "Not Ready"}
            </Badge>
          </CardContent>
        </Card>

        {/* Issues */}
        {status.issues && status.issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Critical Issues ({status.issues.length})
              </CardTitle>
              <CardDescription>These issues must be resolved before deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {status.issues.map((issue: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warnings */}
        {status.warnings && status.warnings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                Warnings ({status.warnings.length})
              </CardTitle>
              <CardDescription>These should be addressed for optimal deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {status.warnings.map((warning: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {status.recommendations && status.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                Recommendations ({status.recommendations.length})
              </CardTitle>
              <CardDescription>Suggestions to improve your deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {status.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        {status.environment && (
          <Card>
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Node Version:</strong> {status.environment.nodeVersion}
                </div>
                <div>
                  <strong>Platform:</strong> {status.environment.platform}
                </div>
                <div>
                  <strong>Vercel Deployment ID:</strong> {status.environment.vercelDeploymentId || "Not deployed"}
                </div>
                <div>
                  <strong>Vercel URL:</strong> {status.environment.vercelUrl || "Not available"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
