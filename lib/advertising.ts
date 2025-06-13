"use server"

import prisma from "@/lib/prisma"
import { AdLocation, AdStatus, AdPurchaseStatus } from "@prisma/client"

export interface AdPricingOptions {
  location: AdLocation
  duration: number // in hours
  slots: number // number of ad slots (1-5)
  startDate: Date
  endDate: Date
}

export interface AdPricingResult {
  basePrice: number
  locationMultiplier: number
  durationDiscount: number
  slotMultiplier: number
  totalCost: number
  breakdown: {
    baseCost: number
    locationAdjustment: number
    durationDiscount: number
    slotCost: number
    finalTotal: number
  }
}

// Base pricing configuration
export const AD_PRICING_CONFIG = {
  baseHourlyRate: 5, // $5 per hour per slot
  locationMultipliers: {
    BOTTOM_GLOBAL: 1.5, // 50% premium for global bottom ads
    FRONTPAGE: 2.0, // 100% premium for front page
    SERVICES: 1.2, // 20% premium for services section
    MARKETPLACE: 1.3, // 30% premium for marketplace
    SIDEBAR: 1.0, // Base rate for sidebar
  },
  durationDiscounts: {
    // Discounts based on total duration
    24: 0.05, // 5% discount for 24+ hours
    72: 0.10, // 10% discount for 72+ hours (3 days)
    168: 0.15, // 15% discount for 168+ hours (1 week)
    720: 0.20, // 20% discount for 720+ hours (1 month)
  },
  slotDiscounts: {
    // Discounts for buying multiple slots
    1: 0, // No discount for single slot
    2: 0.05, // 5% discount for 2 slots
    3: 0.10, // 10% discount for 3 slots
    4: 0.15, // 15% discount for 4 slots
    5: 0.20, // 20% discount for all 5 slots
  },
  maxSlotsPerLocation: 5,
}

export function calculateAdPricing(options: AdPricingOptions): AdPricingResult {
  const { location, duration, slots, startDate, endDate } = options
  const config = AD_PRICING_CONFIG

  // Validate inputs
  if (slots < 1 || slots > config.maxSlotsPerLocation) {
    throw new Error(`Slots must be between 1 and ${config.maxSlotsPerLocation}`)
  }

  if (duration < 1) {
    throw new Error("Duration must be at least 1 hour")
  }

  // Base calculation
  const basePrice = config.baseHourlyRate
  const locationMultiplier = config.locationMultipliers[location] || 1.0

  // Calculate duration discount
  let durationDiscount = 0
  const discountTiers = Object.entries(config.durationDiscounts)
    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort descending

  for (const [hours, discount] of discountTiers) {
    if (duration >= parseInt(hours)) {
      durationDiscount = discount as number
      break
    }
  }

  // Calculate slot discount
  const slotDiscount = config.slotDiscounts[slots as keyof typeof config.slotDiscounts] || 0

  // Pricing breakdown
  const baseCost = basePrice * duration * slots
  const locationAdjustment = baseCost * (locationMultiplier - 1)
  const durationDiscountAmount = baseCost * durationDiscount
  const slotDiscountAmount = baseCost * slotDiscount
  
  const subtotal = baseCost + locationAdjustment
  const totalDiscounts = durationDiscountAmount + slotDiscountAmount
  const finalTotal = Math.max(subtotal - totalDiscounts, basePrice) // Minimum of base price

  return {
    basePrice,
    locationMultiplier,
    durationDiscount,
    slotMultiplier: 1 - slotDiscount,
    totalCost: finalTotal,
    breakdown: {
      baseCost,
      locationAdjustment,
      durationDiscount: totalDiscounts,
      slotCost: baseCost,
      finalTotal,
    },
  }
}

export async function getAvailableAdSlots(
  location: AdLocation,
  startDate: Date,
  endDate: Date
): Promise<number[]> {
  // Get all occupied slots for the time period
  const occupiedSlots = await prisma.adSlot.findMany({
    where: {
      placement: {
        location,
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startDate } },
            { endTime: { gt: startDate } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endDate } },
            { endTime: { gte: endDate } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startDate } },
            { endTime: { lte: endDate } },
          ],
        },
      ],
      isActive: true,
    },
    include: {
      placement: true,
    },
  })

  // Extract occupied positions
  const occupiedPositions = new Set(
    occupiedSlots.map(slot => slot.placement.position)
  )

  // Return available positions (0-4)
  const allPositions = [0, 1, 2, 3, 4]
  return allPositions.filter(pos => !occupiedPositions.has(pos))
}

export async function createAdvertisement(data: {
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  advertiserId: string
  serviceId?: string
}) {
  return await prisma.advertisement.create({
    data: {
      ...data,
      status: AdStatus.PENDING,
    },
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
}

export async function purchaseAdSlots(data: {
  advertisementId: string
  purchaserId: string
  location: AdLocation
  duration: number
  slots: number
  startDate: Date
  endDate: Date
}) {
  const { advertisementId, purchaserId, location, duration, slots, startDate, endDate } = data

  // Calculate pricing
  const pricing = calculateAdPricing({ location, duration, slots, startDate, endDate })

  // Check available slots
  const availableSlots = await getAvailableAdSlots(location, startDate, endDate)
  if (availableSlots.length < slots) {
    throw new Error(`Only ${availableSlots.length} slots available for the selected time period`)
  }

  // Create ad purchase
  const adPurchase = await prisma.adPurchase.create({
    data: {
      advertisementId,
      purchaserId,
      totalCost: pricing.totalCost,
      duration,
      startDate,
      endDate,
      status: AdPurchaseStatus.PENDING,
    },
  })

  // Create ad placements and slots
  const selectedSlots = availableSlots.slice(0, slots)
  
  for (const position of selectedSlots) {
    // Create or get placement
    const placement = await prisma.adPlacement.upsert({
      where: {
        advertisementId_location_position: {
          advertisementId,
          location,
          position,
        },
      },
      update: {},
      create: {
        advertisementId,
        location,
        position,
        priority: 0,
      },
    })

    // Create ad slot
    await prisma.adSlot.create({
      data: {
        adPurchaseId: adPurchase.id,
        placementId: placement.id,
        startTime: startDate,
        endTime: endDate,
        isActive: false, // Will be activated after payment
      },
    })
  }

  return {
    adPurchase,
    pricing,
    selectedSlots,
  }
}

export async function getActiveAds(location: AdLocation, limit: number = 5) {
  const now = new Date()

  return await prisma.adSlot.findMany({
    where: {
      placement: {
        location,
      },
      startTime: { lte: now },
      endTime: { gt: now },
      isActive: true,
      adPurchase: {
        status: AdPurchaseStatus.ACTIVE,
      },
    },
    include: {
      placement: {
        include: {
          advertisement: {
            include: {
              advertiser: {
                select: {
                  id: true,
                  name: true,
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
          },
        },
      },
    },
    orderBy: [
      { placement: { priority: 'desc' } },
      { startTime: 'asc' },
    ],
    take: limit,
  })
}

export async function trackAdImpression(advertisementId: string, location: AdLocation) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.adAnalytics.upsert({
    where: {
      advertisementId_date_location: {
        advertisementId,
        date: today,
        location,
      },
    },
    update: {
      impressions: {
        increment: 1,
      },
    },
    create: {
      advertisementId,
      date: today,
      location,
      impressions: 1,
      clicks: 0,
      conversions: 0,
      cost: 0,
    },
  })
}

export async function trackAdClick(advertisementId: string, location: AdLocation) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.adAnalytics.upsert({
    where: {
      advertisementId_date_location: {
        advertisementId,
        date: today,
        location,
      },
    },
    update: {
      clicks: {
        increment: 1,
      },
    },
    create: {
      advertisementId,
      date: today,
      location,
      clicks: 1,
      impressions: 0,
      conversions: 0,
      cost: 0,
    },
  })
}
