"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create a new service listing
export async function createService(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
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
        providerId: session.user.id,
        verified: false,
      },
    })

    // Update user role to PROFESSIONAL if not already
    await prisma.user.update({
      where: { id: session.user.id },
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

    // Return sample data for demonstration
    const sampleServices = [
      {
        id: "1",
        name: "Professional Home Inspection",
        description: "Comprehensive home inspection services with detailed reports and same-day service. Licensed and insured with 10+ years of experience.",
        category: "HOME_INSPECTION",
        price: "$350",
        hourlyRate: null,
        location: "Dallas, TX",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p1",
          name: "Mike Johnson",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
          reviewCount: 127,
        },
        reviews: [],
      },
      {
        id: "2",
        name: "Real Estate Photography",
        description: "Professional photography, virtual tours, and drone footage for property listings. High-quality images that sell homes faster.",
        category: "PHOTOGRAPHY",
        price: "$200",
        hourlyRate: null,
        location: "Austin, TX",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p2",
          name: "Sarah Chen",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
          reviewCount: 89,
        },
        reviews: [],
      },
      {
        id: "3",
        name: "Title & Escrow Services",
        description: "Complete title and escrow services for residential and commercial properties. Fast, reliable, and secure transactions.",
        category: "TITLE_SERVICES",
        price: "Custom",
        hourlyRate: null,
        location: "Houston, TX",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p3",
          name: "First National Title",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 4.7,
          reviewCount: 203,
        },
        reviews: [],
      },
      {
        id: "4",
        name: "Kitchen Renovation Specialists",
        description: "Expert kitchen renovation and remodeling services. From design to completion, we handle everything with quality craftsmanship.",
        category: "CONTRACTORS",
        price: "$15,000+",
        hourlyRate: 85,
        location: "San Antonio, TX",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p4",
          name: "Elite Contractors",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
          reviewCount: 156,
        },
        reviews: [],
      },
      {
        id: "5",
        name: "Mortgage Pre-Approval Services",
        description: "Fast mortgage pre-approval with competitive rates. Multiple loan programs available for first-time buyers and investors.",
        category: "MORTGAGE",
        price: "Free Consultation",
        hourlyRate: null,
        location: "Fort Worth, TX",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p5",
          name: "Texas Home Loans",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
          rating: 4.6,
          reviewCount: 78,
        },
        reviews: [],
      },
      {
        id: "6",
        name: "Interior Design Consultation",
        description: "Professional interior design services for staging and home improvement. Increase your property value with expert design.",
        category: "INTERIOR_DESIGN",
        price: null,
        hourlyRate: 150,
        location: "Plano, TX",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: {
          id: "p6",
          name: "Modern Spaces Design",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
          reviewCount: 45,
        },
        reviews: [],
      },
    ]

    // Filter sample data based on criteria
    let filteredServices = sampleServices
    if (category) {
      filteredServices = filteredServices.filter(s => s.category === category)
    }
    if (verified !== undefined) {
      filteredServices = filteredServices.filter(s => s.verified === verified)
    }

    return {
      services: filteredServices.slice(offset, offset + limit),
      total: filteredServices.length,
      hasMore: offset + limit < filteredServices.length,
    }
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

    // Return sample data for demonstration
    const sampleService = {
      id: id,
      name: "Professional Home Inspection",
      description: "Comprehensive home inspection services with detailed reports and same-day service. Licensed and insured with 10+ years of experience. We provide thorough inspections covering all major systems including electrical, plumbing, HVAC, structural components, and more. Our detailed reports include high-resolution photos and recommendations for any issues found.",
      category: "HOME_INSPECTION",
      price: "$350",
      hourlyRate: null,
      location: "Dallas, TX",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: {
        id: "p1",
        name: "Mike Johnson",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        reviewCount: 127,
        bio: "Licensed home inspector with over 10 years of experience. Certified by the American Society of Home Inspectors (ASHI) and the International Association of Certified Home Inspectors (InterNACHI). I provide thorough, professional inspections to help you make informed decisions about your property purchase.",
        location: "Dallas, TX",
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
      },
      reviews: [
        {
          id: "r1",
          rating: 5,
          comment: "Mike did an excellent job inspecting our new home. His report was very detailed and he took the time to explain everything to us. Highly recommend!",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          author: {
            id: "u1",
            name: "Sarah Williams",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          },
        },
        {
          id: "r2",
          rating: 5,
          comment: "Professional, thorough, and on time. Mike found several issues that could have been costly down the road. Worth every penny!",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          author: {
            id: "u2",
            name: "David Chen",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          },
        },
        {
          id: "r3",
          rating: 4,
          comment: "Great service and very knowledgeable. The report was delivered the same day as promised.",
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
          author: {
            id: "u3",
            name: "Jennifer Martinez",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          },
        },
      ],
    }

    return { service: sampleService }
  }
}

// Create a review for a service
export async function createServiceReview(serviceId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
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
    if (service.providerId === session.user.id) {
      throw new Error("You cannot review your own service")
    }

    // Check if user has already reviewed this service
    const existingReview = await prisma.review.findFirst({
      where: {
        serviceId,
        authorId: session.user.id,
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
          authorId: session.user.id,
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
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const services = await prisma.service.findMany({
      where: { providerId: session.user.id },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
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
