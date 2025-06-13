"use server"

import prisma from "@/lib/prisma"
import { AdLocation, AdStatus, AdPurchaseStatus } from "@prisma/client"
import { calculateAdPricing } from "@/lib/ad-pricing"

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
        id: `${advertisementId}_${location}_${position}`,
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
