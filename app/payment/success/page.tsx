"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { handleServiceOrderPaymentSuccess, handleTransactionFeePaymentSuccess } from "@/app/actions/payment-actions"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentIntentId = searchParams.get("payment_intent")
        const paymentType = searchParams.get("payment_type")

        if (!paymentIntentId) {
          throw new Error("Payment information missing")
        }

        let result

        if (paymentType === "service_order") {
          result = await handleServiceOrderPaymentSuccess(paymentIntentId)
          if (result.success) {
            setRedirectUrl(`/services/orders/${result.orderId}`)
          }
        } else if (paymentType === "transaction_fee") {
          result = await handleTransactionFeePaymentSuccess(paymentIntentId)
          if (result.success) {
            const transactionId = searchParams.get("transaction_id")
            setRedirectUrl(`/progress/${transactionId}`)
          }
        } else {
          throw new Error("Invalid payment type")
        }

        if (!result.success) {
          throw new Error(result.error || "Payment processing failed")
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams])

  const handleContinue = () => {
    if (redirectUrl) {
      router.push(redirectUrl)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="container py-10 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isProcessing ? "Processing Payment" : error ? "Payment Error" : "Payment Successful"}
          </CardTitle>
          <CardDescription className="text-center">
            {isProcessing
              ? "Please wait while we confirm your payment..."
              : error
                ? "We encountered an issue with your payment"
                : "Your payment has been processed successfully"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isProcessing ? (
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          ) : error ? (
            <div className="text-red-500 text-center">
              <p className="font-medium">Error: {error}</p>
              <p className="mt-2">Please try again or contact support for assistance.</p>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Thank you for your payment!</p>
              <p className="mt-2 text-muted-foreground">A confirmation has been sent to your email address.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleContinue} disabled={isProcessing}>
            {error ? "Try Again" : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
