"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateServiceFee } from "@/lib/fee-calculator"
import { createServiceOrderPayment } from "@/app/actions/payment-actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { StripeElementsProvider } from "./payment/stripe-elements-provider"
import { PaymentForm } from "./payment/payment-form"

interface ServiceCheckoutProps {
  serviceId: string
  serviceName: string
  providerId: string
  providerName: string
  baseAmount: number
  description?: string
  onSuccess?: (orderId: string) => void
  onCancel?: () => void
}

export function ServiceCheckout({
  serviceId,
  serviceName,
  providerId,
  providerName,
  baseAmount,
  description,
  onSuccess,
  onCancel,
}: ServiceCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  // Calculate fee
  const { baseAmount: amount, feeAmount, total } = calculateServiceFee(baseAmount)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // First create the order
      const result = await createServiceOrderPayment(serviceId, providerId, amount, feeAmount, description)

      if (result.success && result.clientSecret && result.orderId) {
        setClientSecret(result.clientSecret)
        setOrderId(result.orderId)
      } else {
        throw new Error(result.error || "Failed to create payment")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast({
      title: "Payment successful",
      description: "Your service order has been placed.",
      variant: "default",
    })

    if (onSuccess && orderId) {
      onSuccess(orderId)
    }
  }

  // If we have a client secret, show the payment form
  if (clientSecret) {
    return (
      <StripeElementsProvider clientSecret={clientSecret}>
        <PaymentForm
          amount={total}
          onSuccess={handlePaymentSuccess}
          onCancel={onCancel}
          returnUrl={`${window.location.origin}/payment/success?payment_type=service_order&order_id=${orderId}`}
        />
      </StripeElementsProvider>
    )
  }

  // Otherwise show the checkout summary
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Service Checkout</CardTitle>
        <CardDescription>Complete your order for {serviceName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Service Provider:</span>
            <span className="font-medium">{providerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service:</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          {description && (
            <div className="flex justify-between text-sm">
              <span>Description:</span>
              <span className="font-medium">{description}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Base Amount:</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform Fee (5%):</span>
            <span className="font-medium">${feeAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleCheckout} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
