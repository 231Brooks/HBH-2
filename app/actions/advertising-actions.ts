"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { AdLocation } from "@prisma/client"
import {
  calculateAdPricing,
  getAvailableAdSlots,
  createAdvertisement,
  purchaseAdSlots,
  getActiveAds,
  trackAdImpression,
  trackAdClick,
  type AdPricingOptions,
} from "@/lib/advertising"

export interface CreateAdData {
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  serviceId?: string
}

export interface PurchaseAdData {
  advertisementId: string
  location: AdLocation
  duration: number
  slots: number
  startDate: string
  endDate: string
}

export async function createAd(data: CreateAdData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const advertisement = await createAdvertisement({
      ...data,
      advertiserId: session.user.id,
    })

    revalidatePath("/advertising")
    return { success: true, advertisement }
  } catch (error) {
    console.error("Failed to create advertisement:", error)
    return { success: false, error: "Failed to create advertisement" }
  }
}

export async function getAdPricing(options: AdPricingOptions) {
  try {
    const pricing = calculateAdPricing(options)
    return { success: true, pricing }
  } catch (error) {
    console.error("Failed to calculate pricing:", error)
    return { success: false, error: "Failed to calculate pricing" }
  }
}

export async function checkAdSlotAvailability(
  location: AdLocation,
  startDate: string,
  endDate: string
) {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const availableSlots = await getAvailableAdSlots(location, start, end)
    return { success: true, availableSlots }
  } catch (error) {
    console.error("Failed to check slot availability:", error)
    return { success: false, error: "Failed to check availability" }
  }
}

export async function purchaseAd(data: PurchaseAdData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    const result = await purchaseAdSlots({
      ...data,
      purchaserId: session.user.id,
      startDate,
      endDate,
    })

    revalidatePath("/advertising")
    return { success: true, ...result }
  } catch (error) {
    console.error("Failed to purchase ad:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to purchase ad" }
  }
}

export async function getMyAdvertisements() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const advertisements = await prisma.advertisement.findMany({
      where: { advertiserId: session.user.id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        purchases: {
          include: {
            adSlots: {
              include: {
                placement: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        analytics: {
          orderBy: { date: "desc" },
          take: 30, // Last 30 days
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, advertisements }
  } catch (error) {
    console.error("Failed to get advertisements:", error)
    return { success: false, error: "Failed to load advertisements" }
  }
}

export async function getAdsByLocation(location: AdLocation) {
  try {
    const ads = await getActiveAds(location, 5)
    return { success: true, ads }
  } catch (error) {
    console.error("Failed to get ads by location:", error)
    return { success: false, error: "Failed to load ads" }
  }
}

export async function recordAdImpression(advertisementId: string, location: AdLocation) {
  try {
    await trackAdImpression(advertisementId, location)
    return { success: true }
  } catch (error) {
    console.error("Failed to record impression:", error)
    return { success: false, error: "Failed to record impression" }
  }
}

export async function recordAdClick(advertisementId: string, location: AdLocation) {
  try {
    await trackAdClick(advertisementId, location)
    return { success: true }
  } catch (error) {
    console.error("Failed to record click:", error)
    return { success: false, error: "Failed to record click" }
  }
}

export async function getAdAnalytics(advertisementId: string, days: number = 30) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Verify ownership
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id: advertisementId,
        advertiserId: session.user.id,
      },
    })

    if (!advertisement) {
      return { success: false, error: "Advertisement not found" }
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await prisma.adAnalytics.findMany({
      where: {
        advertisementId,
        date: { gte: startDate },
      },
      orderBy: { date: "asc" },
    })

    // Calculate totals
    const totals = analytics.reduce(
      (acc, day) => ({
        impressions: acc.impressions + day.impressions,
        clicks: acc.clicks + day.clicks,
        conversions: acc.conversions + day.conversions,
        cost: acc.cost + day.cost,
      }),
      { impressions: 0, clicks: 0, conversions: 0, cost: 0 }
    )

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
    const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0
    const cpm = totals.impressions > 0 ? (totals.cost / totals.impressions) * 1000 : 0

    return {
      success: true,
      analytics,
      totals,
      metrics: {
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        cpm: Number(cpm.toFixed(2)),
      },
    }
  } catch (error) {
    console.error("Failed to get analytics:", error)
    return { success: false, error: "Failed to load analytics" }
  }
}

export async function updateAdvertisement(
  advertisementId: string,
  data: Partial<CreateAdData>
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Verify ownership
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id: advertisementId,
        advertiserId: session.user.id,
      },
    })

    if (!advertisement) {
      return { success: false, error: "Advertisement not found" }
    }

    const updatedAd = await prisma.advertisement.update({
      where: { id: advertisementId },
      data,
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    })

    revalidatePath("/advertising")
    return { success: true, advertisement: updatedAd }
  } catch (error) {
    console.error("Failed to update advertisement:", error)
    return { success: false, error: "Failed to update advertisement" }
  }
}

export async function deleteAdvertisement(advertisementId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Verify ownership
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id: advertisementId,
        advertiserId: session.user.id,
      },
    })

    if (!advertisement) {
      return { success: false, error: "Advertisement not found" }
    }

    await prisma.advertisement.delete({
      where: { id: advertisementId },
    })

    revalidatePath("/advertising")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete advertisement:", error)
    return { success: false, error: "Failed to delete advertisement" }
  }
}
