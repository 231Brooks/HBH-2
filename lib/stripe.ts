import Stripe from "stripe"

// Initialize Stripe with the API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest API version
})

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
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata,
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
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata,
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
