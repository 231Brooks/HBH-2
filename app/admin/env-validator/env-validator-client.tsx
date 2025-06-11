"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Lock, ExternalLink } from "lucide-react"

interface EnvVariable {
  name: string
  category: string
  description: string
  required: boolean
  exists: boolean
  formatValid: boolean
  message?: string
  sensitive: boolean
}

interface ConnectionResult {
  success: boolean
  message: string
}

interface ValidationResult {
  variables: EnvVariable[]
  connections: Record<string, ConnectionResult>
}

export default function EnvValidatorClient() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchValidation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/env-validator")

      if (!response.ok) {
        throw new Error(`Failed to validate environment variables: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchValidation()
  }, [])

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      database: "bg-blue-50 text-blue-700 border-blue-200",
      auth: "bg-purple-50 text-purple-700 border-purple-200",
      storage: "bg-amber-50 text-amber-700 border-amber-200",
      messaging: "bg-green-50 text-green-700 border-green-200",
      payment: "bg-pink-50 text-pink-700 border-pink-200",
      other: "bg-gray-50 text-gray-700 border-gray-200",
    }

    return (
      <Badge variant="outline" className={colors[category] || colors.other}>
        {category}
      </Badge>
    )
  }

  const getStatusIcon = (variable: EnvVariable) => {
    if (!variable.exists) {
      return variable.required ? (
        <XCircle className="h-5 w-5 text-red-500" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      )
    }

    if (!variable.formatValid) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }

    return <CheckCircle className="h-5 w-5 text-green-500" />
  }

  const getConnectionStatusIcon = (result: ConnectionResult) => {
    if (result.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  if (loading && !result) {
    return (
      <div className="flex justify-center items-center p-12">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Validating environment variables...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!result) {
    return null
  }

  const { variables, connections } = result

  // Calculate statistics
  const requiredMissing = variables.filter((v) => v.required && !v.exists).length
  const formatInvalid = variables.filter((v) => v.exists && !v.formatValid).length
  const connectionsFailed = Object.values(connections).filter((c) => !c.success).length

  // Group variables by category
  const categorizedVariables: Record<string, EnvVariable[]> = {}
  variables.forEach((variable) => {
    if (!categorizedVariables[variable.category]) {
      categorizedVariables[variable.category] = []
    }
    categorizedVariables[variable.category].push(variable)
  })

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Validation Summary</CardTitle>
          <CardDescription>Overview of environment variable validation results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{variables.length}</div>
              <div className="text-sm text-muted-foreground">Total Variables</div>
            </div>
            <div className={`p-4 rounded-lg ${requiredMissing > 0 ? "bg-red-50" : "bg-green-50"}`}>
              <div className={`text-2xl font-bold ${requiredMissing > 0 ? "text-red-700" : "text-green-700"}`}>
                {requiredMissing}
              </div>
              <div className="text-sm text-muted-foreground">Required Variables Missing</div>
            </div>
            <div className={`p-4 rounded-lg ${formatInvalid > 0 ? "bg-amber-50" : "bg-green-50"}`}>
              <div className={`text-2xl font-bold ${formatInvalid > 0 ? "text-amber-700" : "text-green-700"}`}>
                {formatInvalid}
              </div>
              <div className="text-sm text-muted-foreground">Format Validation Issues</div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Service Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(connections).map(([service, result]) => (
                <div key={service} className={`p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
                  <div className="flex items-center">
                    {getConnectionStatusIcon(result)}
                    <span className="ml-2 font-medium capitalize">{service}</span>
                  </div>
                  <div className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                    {result.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Variables</TabsTrigger>
          {Object.keys(categorizedVariables).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Environment Variables</CardTitle>
              <CardDescription>
                {requiredMissing > 0 ? (
                  <span className="text-red-600">{requiredMissing} required variables missing!</span>
                ) : (
                  <span className="text-green-600">All required variables are set</span>
                )}
                {formatInvalid > 0 && (
                  <span className="text-amber-600 ml-2">({formatInvalid} format validation issues)</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variables.map((variable) => (
                    <TableRow key={variable.name}>
                      <TableCell>{getStatusIcon(variable)}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {variable.name}
                          {variable.required && <span className="text-red-500 ml-1">*</span>}
                          {variable.sensitive && <Lock className="inline h-3 w-3 text-amber-500 ml-1" />}
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(variable.category)}</TableCell>
                      <TableCell>{variable.description}</TableCell>
                      <TableCell>
                        {variable.message && (
                          <span className={variable.exists ? "text-amber-600" : "text-red-600"}>
                            {variable.message}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <span className="text-red-500">*</span> Required variable
                  <span className="ml-4">
                    <Lock className="inline h-3 w-3 text-amber-500 mr-1" /> Sensitive variable
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(categorizedVariables).map(([category, categoryVariables]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>{category.charAt(0).toUpperCase() + category.slice(1)} Variables</CardTitle>
                <CardDescription>
                  {categoryVariables.filter((v) => v.required && !v.exists).length > 0 ? (
                    <span className="text-red-600">
                      {categoryVariables.filter((v) => v.required && !v.exists).length} required variables missing!
                    </span>
                  ) : (
                    <span className="text-green-600">All required variables are set</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryVariables.map((variable) => (
                      <TableRow key={variable.name}>
                        <TableCell>{getStatusIcon(variable)}</TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {variable.name}
                            {variable.required && <span className="text-red-500 ml-1">*</span>}
                            {variable.sensitive && <Lock className="inline h-3 w-3 text-amber-500 ml-1" />}
                          </div>
                        </TableCell>
                        <TableCell>{variable.description}</TableCell>
                        <TableCell>
                          {variable.message && (
                            <span className={variable.exists ? "text-amber-600" : "text-red-600"}>
                              {variable.message}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={fetchValidation} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Validate Again
            </>
          )}
        </Button>

        <Button variant="outline" asChild>
          <a href="/admin/diagnostics" className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Diagnostics
          </a>
        </Button>
      </div>
    </>
  )
}
