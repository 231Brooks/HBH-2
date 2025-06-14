"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Create a new service listing
export async function createService(formData: FormData) {
  const user = await getCurrentUser()
  if (!user?.id) {
    throw new Error("You must be logged in to create a service")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = formData.get("price") as string
  const hourlyRate = formData.get("hourlyRate") ? Number.parseFloat(formData.get("hourlyRate") as string) : null
  const location = formData.get("location") as string
  const image = formData.get("image") as string

  // Validate required fields
  if (!name || !category) {
    throw new Error("Missing required fields")
  }

  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        category: category as any,
        price,
        hourlyRate,
        location,
        image,
        providerId: user.id,
        verified: false,
      },
    })

    // Update user role to PROFESSIONAL if not already
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "PROFESSIONAL" },
    })

    revalidatePath("/services")
    return { success: true, serviceId: service.id }
  } catch (error) {
    console.error("Failed to create service:", error)
    return { success: false, error: "Failed to create service" }
  }
}

// Get all services with optional filters
export async function getServices(options: {
  category?: string
  verified?: boolean
  location?: string
  limit?: number
  offset?: number
}) {
  const { category, verified, location, limit = 10, offset = 0 } = options

  const where: any = {}

  if (category) where.category = category
  if (verified !== undefined) where.verified = verified
  if (location) where.location = { contains: location, mode: "insensitive" }

  try {
    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
          },
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.service.count({ where })

    return {
      services,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return { services: [], total: 0, hasMore: false }

  }
}

// Get a single service by ID
export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
            bio: true,
            location: true,
            emailVerified: true,
            phoneVerified: true,
            identityVerified: true,
          },
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return { service }
  } catch (error) {
    console.error("Failed to fetch service:", error)
    return { service: null }
  }
}

// Get admin fee report
export async function getAdminFeeReport(startDate?: Date, endDate?: Date) {
  const user = await getCurrentUser()
  if (!user?.id || user.role !== 'ADMIN') {
    throw new Error("Admin access required")
  }

  try {
    // This would calculate fees from actual transactions
    // For now, return empty data structure
    return {
      totalFees: 0,
      transactionCount: 0,
      averageFee: 0,
      feesByCategory: [],
      recentTransactions: [],
    }
  } catch (error) {
    console.error("Failed to fetch admin fee report:", error)
    return {
      totalFees: 0,
      transactionCount: 0,
      averageFee: 0,
      feesByCategory: [],
      recentTransactions: [],
    }
  }
}

// Create a review for a service
export async function createServiceReview(serviceId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user?.id) {
    throw new Error("You must be logged in to leave a review")
  }

  const rating = Number.parseFloat(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Invalid rating")
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { providerId: true },
    })

    if (!service) {
      throw new Error("Service not found")
    }

    // Prevent reviewing your own service
    if (service.providerId === user.id) {
      throw new Error("You cannot review your own service")
    }

    // Check if user has already reviewed this service
    const existingReview = await prisma.review.findFirst({
      where: {
        serviceId,
        authorId: user.id,
      },
    })

    if (existingReview) {
      // Update existing review
      await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment,
        },
      })
    } else {
      // Create new review
      await prisma.review.create({
        data: {
          rating,
          comment,
          serviceId,
          authorId: user.id,
          receiverId: service.providerId,
        },
      })
    }

    // Update provider's average rating
    const reviews = await prisma.review.findMany({
      where: { receiverId: service.providerId },
      select: { rating: true },
    })

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    await prisma.user.update({
      where: { id: service.providerId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    })

    revalidatePath(`/services/${serviceId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to create review:", error)
    return { success: false, error: "Failed to create review" }
  }
}

export async function getMyServices() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const services = await prisma.service.findMany({
      where: { providerId: user.id },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, services }
  } catch (error) {
    console.error("Failed to get my services:", error)
    return { success: false, error: "Failed to load services" }
  }
}
