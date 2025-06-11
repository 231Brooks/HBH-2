"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create or update an advertisement
export async function saveAdvertisement(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const id = formData.get("id") as string
  const isUpdate = !!id

  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      slotId: formData.get("slotId") as string,
      content: formData.get("content") as string,
      imageUrl: formData.get("imageUrl") as string,
      linkUrl: formData.get("linkUrl") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      isActive: formData.get("isActive") === "true",
      priority: Number.parseInt(formData.get("priority") as string) || 0,
    }

    let ad

    if (isUpdate) {
      ad = await prisma.advertisement.update({
        where: { id },
        data,
      })
    } else {
      ad = await prisma.advertisement.create({
        data,
      })
    }

    revalidatePath("/admin/ads")
    return { success: true, adId: ad.id }
  } catch (error) {
    console.error("Failed to save advertisement:", error)
    return { success: false, error: "Failed to save advertisement" }
  }
}

// Get all advertisements
export async function getAdvertisements(options: {
  slotId?: string
  isActive?: boolean
  limit?: number
  offset?: number
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { ads: [], total: 0, hasMore: false }
  }

  const isAdmin = session.user.role === "ADMIN"
  const { slotId, isActive, limit = isAdmin ? 50 : 10, offset = 0 } = options

  // For non-admins, only return active ads
  const where: any = {}

  if (slotId) where.slotId = slotId
  if (isActive !== undefined) where.isActive = isActive

  // For non-admins, only show active ads within the date range
  if (!isAdmin) {
    const now = new Date()
    where.isActive = true
    where.startDate = { lte: now }
    where.OR = [{ endDate: null }, { endDate: { gte: now } }]
  }

  try {
    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: [{ priority: "desc" }, { startDate: "desc" }],
      take: limit,
      skip: offset,
    })

    const total = await prisma.advertisement.count({ where })

    return {
      ads,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch advertisements:", error)
    return { ads: [], total: 0, hasMore: false }
  }
}

// Get a single advertisement by ID
export async function getAdvertisementById(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { ad: null }
  }

  const isAdmin = session.user.role === "ADMIN"

  try {
    const ad = await prisma.advertisement.findUnique({
      where: { id },
    })

    // For non-admins, only return active ads within the date range
    if (!isAdmin && ad) {
      const now = new Date()
      if (!ad.isActive || ad.startDate > now || (ad.endDate && ad.endDate < now)) {
        return { ad: null }
      }
    }

    return { ad }
  } catch (error) {
    console.error("Failed to fetch advertisement:", error)
    return { ad: null }
  }
}

// Delete an advertisement
export async function deleteAdvertisement(id: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.advertisement.delete({
      where: { id },
    })

    revalidatePath("/admin/ads")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete advertisement:", error)
    return { success: false, error: "Failed to delete advertisement" }
  }
}

// Track ad event (impression or click)
export async function trackAdEvent(data: {
  adId: string
  type: "IMPRESSION" | "CLICK" | "CONVERSION"
  sessionId?: string
  referrer?: string
  metadata?: any
}) {
  try {
    const { adId, type, sessionId, referrer, metadata } = data

    // Create the event
    await prisma.adEvent.create({
      data: {
        adId,
        type: type as any,
        sessionId,
        referrer,
        metadata: metadata || {},
        timestamp: new Date(),
      },
    })

    // Update the ad metrics
    await prisma.advertisement.update({
      where: { id: adId },
      data: {
        [type === "IMPRESSION" ? "impressions" : "clicks"]: {
          increment: 1,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to track ad event:", error)
    return { success: false }
  }
}

// Get ad analytics
export async function getAdAnalytics(options: {
  adId?: string
  slotId?: string
  startDate?: Date
  endDate?: Date
}) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { analytics: null, error: "Unauthorized" }
  }

  const { adId, slotId, startDate, endDate } = options

  try {
    // Build the where clause
    const where: any = {}

    if (adId) where.adId = adId
    if (slotId) where.ad = { slotId }

    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    // Get event counts
    const [impressions, clicks] = await Promise.all([
      prisma.adEvent.count({
        where: {
          ...where,
          type: "IMPRESSION",
        },
      }),
      prisma.adEvent.count({
        where: {
          ...where,
          type: "CLICK",
        },
      }),
    ])

    // Get daily stats
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', timestamp) as date,
        type,
        COUNT(*) as count
      FROM "AdEvent"
      WHERE ${where}
      GROUP BY DATE_TRUNC('day', timestamp), type
      ORDER BY date ASC
    `

    return {
      analytics: {
        impressions,
        clicks,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        dailyStats,
      },
    }
  } catch (error) {
    console.error("Failed to get ad analytics:", error)
    return { analytics: null, error: "Failed to get analytics" }
  }
}
