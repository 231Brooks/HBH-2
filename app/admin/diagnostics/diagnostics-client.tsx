"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EnvVariables from "./env-variables"

type DiagnosticStatus = "idle" | "loading" | "success" | "error"

interface DiagnosticResult {
  name: string
  description: string
  status: DiagnosticStatus
  message?: string
  details?: any
  category: string
}

interface DiagnosticsClientProps {
  category?: string
}

export default function DiagnosticsClient({ category }: DiagnosticsClientProps) {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEnvVariables, setShowEnvVariables] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/diagnostics${category ? `?category=${category}` : ""}`)

      if (!response.ok) {
        throw new Error(`Failed to run diagnostics: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [category])

  const getStatusIcon = (status: DiagnosticStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "loading":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DiagnosticStatus) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Working
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      case "loading":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Testing...
          </Badge>
        )
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const filteredResults = category ? results.filter((result) => result.category === category) : results

  return (
    <>
      <div className="mb-6">
        <EnvVariables category={category} />
      </div>

      {loading && results.length === 0 ? (
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Running diagnostics...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredResults.map((result) => (
              <Card key={result.name} className={result.status === "error" ? "border-red-300" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {getStatusIcon(result.status)}
                        <span className="ml-2">{result.name}</span>
                      </CardTitle>
                      <CardDescription>{result.description}</CardDescription>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {result.message && (
                    <p className={`text-sm ${result.status === "error" ? "text-red-600" : "text-muted-foreground"}`}>
                      {result.message}
                    </p>
                  )}
                  {result.details && (
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={runDiagnostics} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Tests Again
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
