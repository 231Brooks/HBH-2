import Stripe from "stripe"
import { paperMoneyConfig } from "./paper-money-config"
import { mockPaymentService as mockService } from "./mock-payment-service"

// Initialize Stripe only if the API key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16", // Use the latest API version
    })
  : null

// Check if we should use mock payments
const shouldUseMockPayments = paperMoneyConfig.mode.isPaperMoney && paperMoneyConfig.mode.enableMock

// Create a payment intent for service orders
export async function createServiceOrderPaymentIntent(
  amount: number,
  metadata: {
    orderId: string
    serviceId: string
    clientId: string
    providerId: string
  },
) {
  try {
    // Use mock payment service in paper money mode
    if (shouldUseMockPayments) {
      console.log(`[PAPER MONEY] Creating mock payment intent for $${(amount / 100).toFixed(2)}`)
      const mockIntent = await mockService.createPaymentIntent({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          orderId: metadata.orderId,
          serviceId: metadata.serviceId,
          clientId: metadata.clientId,
          providerId: metadata.providerId,
          paperMoney: "true",
        },
      })
      return { clientSecret: mockIntent.client_secret }
    }

    if (!stripe) {
      throw new Error("Stripe not configured")
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        ...metadata,
        environment: paperMoneyConfig.mode.isPaperMoney ? "test" : "production",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

// Create a payment intent for transaction fees
export async function createTransactionFeePaymentIntent(
  amount: number,
  metadata: {
    transactionId: string
    feeId?: string
    userId: string
  },
) {
  try {
    // Use mock payment service in paper money mode
    if (shouldUseMockPayments) {
      console.log(`[PAPER MONEY] Creating mock fee payment intent for $${(amount / 100).toFixed(2)}`)
      const mockIntent = await mockService.createPaymentIntent({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          transactionId: metadata.transactionId,
          feeId: metadata.feeId || "",
          userId: metadata.userId,
          type: "transaction_fee",
          paperMoney: "true",
        },
      })
      return { clientSecret: mockIntent.client_secret }
    }

    if (!stripe) {
      throw new Error("Stripe not configured")
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        ...metadata,
        environment: paperMoneyConfig.mode.isPaperMoney ? "test" : "production",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

// Verify a payment intent's status
export async function verifyPaymentIntent(paymentIntentId: string) {
  try {
    // Use mock payment service in paper money mode
    if (shouldUseMockPayments) {
      console.log(`[PAPER MONEY] Verifying mock payment intent: ${paymentIntentId}`)
      const mockIntent = await mockService.retrievePaymentIntent(paymentIntentId)
      return {
        status: mockIntent.status,
        metadata: mockIntent.metadata,
      }
    }

    if (!stripe) {
      throw new Error("Stripe not configured")
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    }
  } catch (error) {
    console.error("Error verifying payment intent:", error)
    throw new Error("Failed to verify payment")
  }
}

// Paper money utility functions
export function getPaperMoneyTestCards() {
  return paperMoneyConfig.payments.testCards
}

export function isPaperMoneyMode() {
  return paperMoneyConfig.mode.isPaperMoney
}

export function formatPaperMoneyAmount(amountInCents: number) {
  return paperMoneyConfig.utils.formatAmount(amountInCents)
}
