"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransactionFeeDialog } from "@/components/transaction-fee-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  MessageSquare,
  Upload,
  Download
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { getTransactionById, updateTransactionStatus } from "@/app/actions/transaction-actions"

function TransactionDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const transactionId = params.id as string

  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(false)
  const [showFeeDialog, setShowFeeDialog] = useState(false)

  useEffect(() => {
    loadTransaction()
  }, [transactionId])

  const loadTransaction = async () => {
    setLoading(true)
    try {
      const result = await getTransactionById(transactionId)
      if (result.success && result.transaction) {
        setTransaction(result.transaction)
      } else {
        setError("Transaction not found")
      }
    } catch (err: any) {
      console.error("Failed to load transaction:", err)
      setError("Failed to load transaction details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      const result = await updateTransactionStatus(transactionId, newStatus as any)
      if (result.success) {
        setTransaction(prev => ({ ...prev, status: newStatus }))
        toast({
          title: "Status updated",
          description: "Transaction status has been updated successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to update status")
      }
    } catch (err: any) {
      console.error("Failed to update status:", err)
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleContinueTransaction = () => {
    if (!transaction.hasPaidFee) {
      setShowFeeDialog(true)
    } else {
      toast({
        title: "Transaction in progress",
        description: "Your transaction is being processed.",
      })
    }
  }

  const handleFeeSuccess = () => {
    setTransaction(prev => ({
      ...prev,
      hasPaidFee: true,
      progress: Math.max(prev.progress || 0, 25),
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-amber-500"
      case "PENDING_APPROVAL": return "bg-blue-500"
      case "DOCUMENT_REVIEW": return "bg-purple-500"
      case "CLOSING_SOON": return "bg-green-500"
      case "COMPLETED": return "bg-green-600"
      case "CANCELLED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "In Progress"
      case "PENDING_APPROVAL": return "Pending Approval"
      case "DOCUMENT_REVIEW": return "Document Review"
      case "CLOSING_SOON": return "Closing Soon"
      case "COMPLETED": return "Completed"
      case "CANCELLED": return "Cancelled"
      default: return status
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return "Not set"
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested transaction could not be found."}</p>
          <Button asChild>
            <Link href="/progress">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Progress
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress = transaction.progress || 0

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/progress">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Progress
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {transaction.property?.address || transaction.property?.title || "Transaction Details"}
            </h1>
            <p className="text-muted-foreground">
              {transaction.type} • Created {formatDate(transaction.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(transaction.status)} text-white`}>
              {getStatusLabel(transaction.status)}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Transaction Progress
          </CardTitle>
          <CardDescription>Overall completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">
                  {transaction.property?.price ? formatPrice(transaction.property.price) : "Price TBD"}
                </div>
                <div className="text-muted-foreground">Transaction Value</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatDate(transaction.closingDate)}</div>
                <div className="text-muted-foreground">Closing Date</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{transaction.titleCompany?.name || "TBD"}</div>
                <div className="text-muted-foreground">Title Company</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{transaction.parties?.length || 0}</div>
                <div className="text-muted-foreground">Parties Involved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!transaction.hasPaidFee && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Transaction Fee Required:</strong> A $100 processing fee is required to continue.
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
                onClick={() => setShowFeeDialog(true)}
              >
                Pay Fee
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <TransactionFeeDialog
        isOpen={showFeeDialog}
        onClose={() => setShowFeeDialog(false)}
        transactionId={transaction.id}
        propertyAddress={transaction.property?.address || "Property"}
        onSuccess={handleFeeSuccess}
      />
    </div>
  )
}

export default function TransactionDetailPage() {
  return (
    <ProtectedRoute>
      <TransactionDetailContent />
    </ProtectedRoute>
  )
}
