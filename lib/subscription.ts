import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client"

export interface SubscriptionLimits {
  listingsLimit: number | null // null = unlimited
  transactionFeeRate: number // percentage
  monthlyFee: number
  perListingFee: number
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  FREE: {
    listingsLimit: null, // unlimited for buying/using services
    transactionFeeRate: 0, // no fees for using services
    monthlyFee: 0,
    perListingFee: 0,
  },
  PROFESSIONAL_MONTHLY: {
    listingsLimit: null, // unlimited listings
    transactionFeeRate: 0, // no transaction fees with monthly subscription
    monthlyFee: 50,
    perListingFee: 0,
  },
  PAY_PER_LISTING: {
    listingsLimit: null, // unlimited but pay per listing
    transactionFeeRate: 5, // 5% transaction fee
    monthlyFee: 0,
    perListingFee: 10,
  },
}

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: { user: true },
  })

  if (!subscription) {
    // Create default free subscription
    return await prisma.subscription.create({
      data: {
        userId,
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      include: { user: true },
    })
  }

  return subscription
}

export async function canCreateListing(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId)
  const limits = SUBSCRIPTION_LIMITS[subscription.tier]

  // For free tier, users can only use services, not provide them
  if (subscription.tier === SubscriptionTier.FREE) {
    return {
      allowed: false,
      reason: "Free users can use services but cannot create service listings. Upgrade to Professional to start offering services.",
    }
  }

  // Check if subscription is active
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "Your subscription is not active. Please update your payment method or reactivate your subscription.",
    }
  }

  // Check listing limits (currently unlimited for paid tiers)
  if (limits.listingsLimit !== null && subscription.listingsUsed >= limits.listingsLimit) {
    return {
      allowed: false,
      reason: `You have reached your listing limit of ${limits.listingsLimit}. Upgrade your plan for more listings.`,
    }
  }

  return { allowed: true }
}

export async function calculateServiceFee(amount: number, providerId: string): Promise<number> {
  const subscription = await getUserSubscription(providerId)
  const limits = SUBSCRIPTION_LIMITS[subscription.tier]

  // No fees for monthly subscribers
  if (subscription.tier === SubscriptionTier.PROFESSIONAL_MONTHLY) {
    return 0
  }

  // 5% transaction fee for pay-per-listing tier
  if (subscription.tier === SubscriptionTier.PAY_PER_LISTING) {
    return amount * (limits.transactionFeeRate / 100)
  }

  return 0
}

export function getSubscriptionDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case SubscriptionTier.FREE:
      return "Free"
    case SubscriptionTier.PROFESSIONAL_MONTHLY:
      return "Professional ($50/month)"
    case SubscriptionTier.PAY_PER_LISTING:
      return "Pay Per Listing ($10/listing + 5% fees)"
    default:
      return "Unknown"
  }
}

export async function createStripeSubscription(
  userId: string,
  tier: SubscriptionTier,
  paymentMethodId: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.email) throw new Error("User not found")

  // Create or retrieve Stripe customer
  let customer
  const existingCustomers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0]
  } else {
    customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId },
    })
  }

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.id,
  })

  // Set as default payment method
  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })

  // Create subscription based on tier
  let priceId: string
  switch (tier) {
    case SubscriptionTier.PROFESSIONAL_MONTHLY:
      priceId = process.env.STRIPE_PROFESSIONAL_PRICE_ID!
      break
    default:
      throw new Error("Invalid subscription tier for Stripe subscription")
  }

  const stripeSubscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })

  // Update or create subscription in database
  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: {
      tier,
      status: SubscriptionStatus.INCOMPLETE,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
    create: {
      userId,
      tier,
      status: SubscriptionStatus.INCOMPLETE,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  })

  return {
    subscription,
    clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
  }
}

export async function cancelSubscription(userId: string) {
  const subscription = await getUserSubscription(userId)

  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: true,
    },
  })
}

export async function reactivateSubscription(userId: string) {
  const subscription = await getUserSubscription(userId)

  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: false,
    },
  })
}

export function getSubscriptionFeatures(tier: SubscriptionTier): string[] {
  switch (tier) {
    case SubscriptionTier.FREE:
      return [
        "Use all services",
        "Browse marketplace",
        "Contact service providers",
        "No fees for using services",
      ]
    case SubscriptionTier.PROFESSIONAL_MONTHLY:
      return [
        "Everything in Free",
        "Create unlimited service listings",
        "No transaction fees",
        "Professional dashboard",
        "Priority support",
      ]
    case SubscriptionTier.PAY_PER_LISTING:
      return [
        "Everything in Free",
        "Create service listings",
        "$10 per listing",
        "5% transaction fee",
        "Professional dashboard",
      ]
    default:
      return []
  }
}
