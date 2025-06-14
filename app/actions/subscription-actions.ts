"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { SubscriptionTier, FeeType, FeeStatus } from "@prisma/client"
import {
  getUserSubscription,
  canCreateListing,
  calculateServiceFee,
  createStripeSubscription,
  cancelSubscription,
  reactivateSubscription,
} from "@/lib/subscription"

export async function getMySubscription() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const subscription = await getUserSubscription(session.user.id)
    return { success: true, subscription }
  } catch (error) {
    console.error("Failed to get subscription:", error)
    return { success: false, error: "Failed to load subscription" }
  }
}

export async function checkListingPermission() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const result = await canCreateListing(user.id)
    return { success: true, ...result }
  } catch (error) {
    console.error("Failed to check listing permission:", error)
    return { success: false, error: "Failed to check permissions" }
  }
}

export async function upgradeSubscription(tier: SubscriptionTier, paymentMethodId?: string) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // For monthly subscriptions, we need Stripe integration
    if (tier === SubscriptionTier.PROFESSIONAL_MONTHLY && paymentMethodId) {
      const result = await createStripeSubscription(user.id, tier, paymentMethodId)
      revalidatePath("/settings/subscription")
      return { success: true, ...result }
    }

    // For pay-per-listing or free, just update the database
    const subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { tier },
      create: {
        userId: user.id,
        tier,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    })

    revalidatePath("/settings/subscription")
    return { success: true, subscription }
  } catch (error) {
    console.error("Failed to upgrade subscription:", error)
    return { success: false, error: "Failed to upgrade subscription" }
  }
}

export async function cancelMySubscription() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    await cancelSubscription(user.id)
    revalidatePath("/settings/subscription")
    return { success: true }
  } catch (error) {
    console.error("Failed to cancel subscription:", error)
    return { success: false, error: "Failed to cancel subscription" }
  }
}

export async function reactivateMySubscription() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    await reactivateSubscription(user.id)
    revalidatePath("/settings/subscription")
    return { success: true }
  } catch (error) {
    console.error("Failed to reactivate subscription:", error)
    return { success: false, error: "Failed to reactivate subscription" }
  }
}

export async function createListingFee(serviceId: string) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const subscription = await getUserSubscription(user.id)

    // Check if user needs to pay per listing
    if (subscription.tier === SubscriptionTier.PAY_PER_LISTING) {
      const fee = await prisma.fee.create({
        data: {
          userId: user.id,
          type: FeeType.LISTING_FEE,
          amount: 10, // $10 per listing
          description: `Listing fee for service ${serviceId}`,
          status: FeeStatus.PENDING,
        },
      })

      return { success: true, fee, requiresPayment: true }
    }

    // No fee required for monthly subscribers or free users (who can't create listings)
    return { success: true, requiresPayment: false }
  } catch (error) {
    console.error("Failed to create listing fee:", error)
    return { success: false, error: "Failed to process listing fee" }
  }
}

export async function createTransactionFee(serviceOrderId: string, amount: number) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const feeAmount = await calculateServiceFee(amount, user.id)

    if (feeAmount > 0) {
      const fee = await prisma.fee.create({
        data: {
          userId: user.id,
          type: FeeType.TRANSACTION_FEE,
          amount: feeAmount,
          description: `Transaction fee for service order ${serviceOrderId}`,
          status: FeeStatus.PENDING,
          serviceOrderId,
        },
      })

      return { success: true, fee, amount: feeAmount }
    }

    return { success: true, amount: 0 }
  } catch (error) {
    console.error("Failed to create transaction fee:", error)
    return { success: false, error: "Failed to calculate transaction fee" }
  }
}

export async function getMyBillingHistory() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const fees = await prisma.fee.findMany({
      where: { userId: user.id },
      include: {
        serviceOrder: {
          include: {
            service: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return { success: true, fees }
  } catch (error) {
    console.error("Failed to get billing history:", error)
    return { success: false, error: "Failed to load billing history" }
  }
}

export async function updateSubscriptionUsage(userId: string, listingIncrement: number = 1) {
  try {
    await prisma.subscription.update({
      where: { userId },
      data: {
        listingsUsed: {
          increment: listingIncrement,
        },
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to update subscription usage:", error)
    return { success: false, error: "Failed to update usage" }
  }
}

export async function getSubscriptionStats(userId: string) {
  try {
    const subscription = await getUserSubscription(userId)
    
    const [totalListings, activeListings, totalEarnings, thisMonthEarnings] = await Promise.all([
      prisma.service.count({
        where: { providerId: userId },
      }),
      prisma.service.count({
        where: { 
          providerId: userId,
          // Add any active status filter if you have one
        },
      }),
      prisma.fee.aggregate({
        where: {
          userId,
          type: FeeType.TRANSACTION_FEE,
          status: FeeStatus.PAID,
        },
        _sum: { amount: true },
      }),
      prisma.fee.aggregate({
        where: {
          userId,
          type: FeeType.TRANSACTION_FEE,
          status: FeeStatus.PAID,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ])

    return {
      success: true,
      stats: {
        subscription,
        totalListings,
        activeListings,
        totalEarnings: totalEarnings._sum.amount || 0,
        thisMonthEarnings: thisMonthEarnings._sum.amount || 0,
      },
    }
  } catch (error) {
    console.error("Failed to get subscription stats:", error)
    return { success: false, error: "Failed to load stats" }
  }
}
