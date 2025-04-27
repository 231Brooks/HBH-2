"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher-server"
import { logger } from "@/lib/logger"

// Create a new property
export async function createProperty(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("You must be logged in to create a property")
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const zipCode = formData.get("zipCode") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const beds = formData.get("beds") ? Number.parseInt(formData.get("beds") as string) : null
    const baths = formData.get("baths") ? Number.parseFloat(formData.get("baths") as string) : null
    const sqft = formData.get("sqft") ? Number.parseInt(formData.get("sqft") as string) : null
    const type = formData.get("type") as string
    const status = (formData.get("status") as string) || "FOR_SALE"
    const features = formData.getAll("features") as string[]
    const latitude = formData.get("latitude") ? Number.parseFloat(formData.get("latitude") as string) : null
    const longitude = formData.get("longitude") ? Number.parseFloat(formData.get("longitude") as string) : null
    const imagesJson = formData.get("images") as string

    // Validate required fields
    if (!title || !address || !city || !state || !zipCode || !price || !type) {
      throw new Error("Missing required fields")
    }

    // Parse images JSON
    let images: { url: string; isPrimary: boolean }[] = []
    try {
      if (imagesJson) {
        images = JSON.parse(imagesJson)
      }
    } catch (error) {
      logger.error("Failed to parse images JSON", error)
    }

    // Create property with transaction to ensure all operations succeed or fail together
    const property = await prisma.$transaction(async (tx) => {
      // Create the property
      const newProperty = await tx.property.create({
        data: {
          title,
          description,
          address,
          city,
          state,
          zipCode,
          price,
          beds,
          baths,
          sqft,
          type: type as any,
          status: status as any,
          features,
          latitude,
          longitude,
          ownerId: session.user.id,
        },
      })

      // Add images if provided
      if (images.length > 0) {
        await tx.propertyImage.createMany({
          data: images.map((image) => ({
            url: image.url,
            isPrimary: image.isPrimary,
            propertyId: newProperty.id,
          })),
        })
      }

      // Create activity
      await tx.activity.create({
        data: {
          type: "property",
          title: "Property created",
          description: `New property "${title}" was created`,
          userId: session.user.id,
          entityId: newProperty.id,
          entityType: "property",
        },
      })

      return newProperty
    })

    // Trigger real-time notification
    await pusherServer.trigger("global-activities", "new-activity", {
      type: "property",
      title: "New property listed",
      description: `${title} is now available`,
      timestamp: new Date().toISOString(),
    })

    revalidatePath("/marketplace")
    return { success: true, propertyId: property.id }
  } catch (error) {
    logger.error("Failed to create property:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create property" }
  }
}

// Get all properties with filtering and pagination
export async function getProperties(options: {
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  city?: string
  state?: string
  limit?: number
  offset?: number
}) {
  try {
    const { status, type, minPrice, maxPrice, beds, baths, city, state, limit = 10, offset = 0 } = options

    // Build filter conditions
    const where: any = {}

    if (status) where.status = status
    if (type) where.type = type
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice }
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice }
    if (beds !== undefined) where.beds = { gte: beds }
    if (baths !== undefined) where.baths = { gte: baths }
    if (city) where.city = { contains: city, mode: "insensitive" }
    if (state) where.state = state

    // Get properties with pagination
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const total = await prisma.property.count({ where })

    return {
      properties,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    logger.error("Failed to fetch properties:", error)
    return { properties: [], total: 0, hasMore: false }
  }
}

// Get a single property by ID
export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            phone: true,
          },
        },
        transactions: {
          where: {
            status: {
              not: "CANCELLED",
            },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!property) {
      return { property: null }
    }

    // Track property view (could be expanded to only count unique views)
    await prisma.activity.create({
      data: {
        type: "property_view",
        title: "Property viewed",
        userId: (await auth())?.user?.id || "anonymous",
        entityId: property.id,
        entityType: "property",
      },
    })

    return { property }
  } catch (error) {
    logger.error("Failed to fetch property:", error)
    return { property: null }
  }
}

export async function updateProperty(id, formData) {
  // Similar to createProperty but with UPDATE query
  // ...

  revalidatePath(`/marketplace/property/${id}`)
}

export async function deleteProperty(id) {
  // await query("DELETE FROM property_images WHERE property_id = $1", [id])
  // await query("DELETE FROM properties WHERE id = $1", [id])

  revalidatePath("/marketplace")
}

// Save/unsave a property
export async function toggleSaveProperty(propertyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to save a property")
  }

  try {
    // Check if property is already saved
    const existingSave = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    })

    if (existingSave) {
      // Unsave the property
      await prisma.savedProperty.delete({
        where: {
          userId_propertyId: {
            userId: session.user.id,
            propertyId,
          },
        },
      })
      return { success: true, saved: false }
    } else {
      // Save the property
      await prisma.savedProperty.create({
        data: {
          userId: session.user.id,
          propertyId,
        },
      })
      return { success: true, saved: true }
    }
  } catch (error) {
    console.error("Failed to toggle save property:", error)
    return { success: false, error: "Failed to toggle save property" }
  }
}

// Get saved properties for the current user
export async function getSavedProperties() {
  const session = await auth()
  if (!session?.user?.id) {
    return { properties: [] }
  }

  try {
    const savedProperties = await prisma.savedProperty.findMany({
      where: { userId: session.user.id },
      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      properties: savedProperties.map((sp) => sp.property),
    }
  } catch (error) {
    console.error("Failed to fetch saved properties:", error)
    return { properties: [] }
  }
}
