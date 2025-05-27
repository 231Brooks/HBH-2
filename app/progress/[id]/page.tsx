"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFeeDialog } from "@/components/transaction-fee-dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration - in a real app, this would come from your database
const mockTransaction = {
  id: "tx123",
  propertyAddress: "123 Main Street, Phoenix, AZ 85001",
  status: "IN_PROGRESS",
  progress: 15,
  hasPaidFee: false,
}

export default function TransactionDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [showFeeDialog, setShowFeeDialog] = useState(false)
  const [transaction, setTransaction] = useState(mockTransaction)

  // In a real app, you would fetch the transaction data here

  const handleContinueTransaction = () => {
    if (!transaction.hasPaidFee) {
      setShowFeeDialog(true)
    } else {
      // Continue with transaction flow
      toast({
        title: "Transaction in progress",
        description: "Your transaction is being processed.",
      })
    }
  }

  const handleFeeSuccess = () => {
    // Update transaction state to reflect paid fee
    setTransaction({
      ...transaction,
      hasPaidFee: true,
      progress: Math.max(transaction.progress, 25),
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{transaction.propertyAddress}</CardTitle>
          <CardDescription>Transaction ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{transaction.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${transaction.progress}%` }}></div>
            </div>
          </div>

          {!transaction.hasPaidFee && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <h3 className="font-medium text-amber-800 mb-1">Transaction Fee Required</h3>
              <p className="text-sm text-amber-700 mb-2">
                A $100 processing fee is required to continue with this transaction.
              </p>
              <Button
                variant="outline"
                className="bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
                onClick={() => setShowFeeDialog(true)}
              >
                Pay Transaction Fee
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleContinueTransaction}>Continue Transaction</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction details would go here */}

      <TransactionFeeDialog
        isOpen={showFeeDialog}
        onClose={() => setShowFeeDialog(false)}
        transactionId={transaction.id}
        propertyAddress={transaction.propertyAddress}
        onSuccess={handleFeeSuccess}
      />
    </div>
  )
}
