"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create a new property listing
export async function createProperty(formData: FormData) {
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
  const beds = Number.parseInt(formData.get("beds") as string)
  const baths = Number.parseFloat(formData.get("baths") as string)
  const sqft = Number.parseInt(formData.get("sqft") as string)
  const type = formData.get("type") as string
  const status = formData.get("status") as string
  const features = formData.getAll("features") as string[]

  // Validate required fields
  if (!title || !address || !city || !state || !zipCode || !price || !type || !status) {
    throw new Error("Missing required fields")
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        address,
        city,
        state,
        zipCode,
        price,
        beds: beds || null,
        baths: baths || null,
        sqft: sqft || null,
        type: type as any,
        status: status as any,
        features,
        ownerId: session.user.id,
      },
    })

    revalidatePath("/marketplace")
    return { success: true, propertyId: property.id }
  } catch (error) {
    console.error("Failed to create property:", error)
    return { success: false, error: "Failed to create property" }
  }
}

// Get all properties with optional filters
export async function getProperties(options: {
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  limit?: number
  offset?: number
}) {
  const { status, type, minPrice, maxPrice, beds, baths, limit = 10, offset = 0 } = options

  const where: any = {}

  if (status) where.status = status
  if (type) where.type = type
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = minPrice
    if (maxPrice) where.price.lte = maxPrice
  }
  if (beds) where.beds = { gte: beds }
  if (baths) where.baths = { gte: baths }

  try {
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

    const total = await prisma.property.count({ where })

    return {
      properties,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error)
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
      },
    })

    return { property }
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return { property: null }
  }
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
