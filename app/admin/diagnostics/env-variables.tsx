"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnvVariableStatus {
  name: string
  description: string
  category: string
  required: boolean
  isSet: boolean
  sensitive: boolean
}

interface EnvVariablesProps {
  category?: string
}

export default function EnvVariables({ category }: EnvVariablesProps) {
  const [variables, setVariables] = useState<EnvVariableStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnvStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/env-status${category ? `?category=${category}` : ""}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch environment variables: ${response.statusText}`)
      }

      const data = await response.json()
      setVariables(data.variables)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvStatus()
  }, [category])

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

  const getStatusIcon = (variable: EnvVariableStatus) => {
    if (variable.isSet) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    if (variable.required) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }

    return <AlertTriangle className="h-5 w-5 text-amber-500" />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading environment variables...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchEnvStatus} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const requiredMissing = variables.filter((v) => v.required && !v.isSet).length
  const optionalMissing = variables.filter((v) => !v.required && !v.isSet).length
  const totalSet = variables.filter((v) => v.isSet).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>
          {requiredMissing > 0 ? (
            <span className="text-red-600">{requiredMissing} required variables missing!</span>
          ) : (
            <span className="text-green-600">All required variables are set</span>
          )}
          {optionalMissing > 0 && (
            <span className="text-amber-600 ml-2">({optionalMissing} optional variables missing)</span>
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
                    {variable.sensitive && <span className="text-amber-500 ml-1">🔒</span>}
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(variable.category)}</TableCell>
                <TableCell>{variable.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <span className="text-red-500">*</span> Required variable
            <span className="ml-4 text-amber-500">🔒</span> Sensitive variable
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={fetchEnvStatus} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
