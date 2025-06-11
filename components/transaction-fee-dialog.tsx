"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { calculateTransactionFee } from "@/lib/fee-calculator"
import { processTransactionFee } from "@/app/actions/transaction-actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface TransactionFeeDialogProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string
  propertyAddress: string
  onSuccess?: () => void
}

export function TransactionFeeDialog({
  isOpen,
  onClose,
  transactionId,
  propertyAddress,
  onSuccess,
}: TransactionFeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const { feeAmount, description } = calculateTransactionFee()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      const result = await processTransactionFee({
        transactionId,
        amount: feeAmount,
        description,
      })

      if (result.success) {
        setIsComplete(true)
        toast({
          title: "Payment successful",
          description: "Your transaction fee has been processed.",
          variant: "default",
        })

        // Wait a moment before closing to show success state
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          }
          onClose()
          setIsComplete(false)
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to process payment")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred during payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Processing Fee</DialogTitle>
          <DialogDescription>A $100 fee is required to process this transaction.</DialogDescription>
        </DialogHeader>

        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Successful</h3>
              <p className="text-sm text-muted-foreground">Your transaction is now being processed.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mt-1">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Transaction Details</h3>
                  <p className="text-sm text-muted-foreground mb-2">Property: {propertyAddress}</p>
                  <p className="text-sm text-muted-foreground">
                    This fee covers processing costs for your real estate transaction.
                  </p>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between items-center">
                  <span>Processing Fee:</span>
                  <span className="font-bold">${feeAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${feeAmount.toFixed(2)}`
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
