"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock document data - replace with actual API call
const mockDocuments = [
  {
    id: "1",
    name: "Purchase Agreement",
    type: "Contract",
    uploadedBy: "John Doe",
    uploadedAt: "2023-07-01",
    status: "approved",
    size: "2.4 MB"
  },
  {
    id: "2", 
    name: "Property Inspection Report",
    type: "Report",
    uploadedBy: "Jane Smith",
    uploadedAt: "2023-07-05",
    status: "pending",
    size: "1.8 MB"
  },
  {
    id: "3",
    name: "Title Insurance Policy",
    type: "Insurance",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2023-07-10",
    status: "approved",
    size: "3.2 MB"
  }
]

export default function TransactionDocumentsPage() {
  const params = useParams()
  const router = useRouter()
  const [documents, setDocuments] = useState(mockDocuments)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const transactionId = params.id as string

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/progress/${transactionId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transaction
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Transaction Documents</h1>
          <p className="text-muted-foreground">
            Manage all documents related to this transaction
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Documents ({documents.length})</h2>
            <p className="text-sm text-muted-foreground">
              Upload and manage transaction documents
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{document.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{document.type}</span>
                        <span>•</span>
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>Uploaded by {document.uploadedBy}</span>
                        <span>•</span>
                        <span>{document.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(document.status)}>
                      {getStatusIcon(document.status)}
                      <span className="ml-1 capitalize">{document.status}</span>
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {documents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
              <p className="text-gray-500 mb-4">
                Upload documents related to this transaction to keep everything organized.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload First Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
