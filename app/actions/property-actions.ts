"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma-pool" // Updated import
import { auth } from "@/lib/auth"
import { withQueryPerformance } from "@/lib/db-monitoring"

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
    const createPropertyQuery = withQueryPerformance(async () => {
      return prisma.property.create({
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
    }, "createProperty")

    const property = await createPropertyQuery()

    revalidatePath("/marketplace")
    return { success: true, propertyId: property.id }
  } catch (error) {
    console.error("Failed to create property:", error)
    return { success: false, error: "Failed to create property" }
  }
}

// Get all properties with optional filters - OPTIMIZED VERSION
export async function getProperties(options: {
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  limit?: number
  page?: number
  search?: string
  sortBy?: string
}) {
  const { status, type, minPrice, maxPrice, beds, baths, limit = 10, page = 1, search, sortBy } = options
  const offset = (page - 1) * limit

  try {
    // Use raw SQL query for better performance
    const getPropertiesQuery = withQueryPerformance(async () => {
      const properties = await prisma.$queryRaw`
        SELECT
          p.id, p.title, p.description, p.address, p.city, p.state,
          p."zipCode", p.price, p.beds, p.baths, p.sqft, p.type, p.status,
          p."createdAt", p."updatedAt", p."ownerId",
          json_agg(DISTINCT pi.*) FILTER (WHERE pi.id IS NOT NULL) as images,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'image', u.image
          ) as owner
        FROM "Property" p
        LEFT JOIN "PropertyImage" pi ON pi."propertyId" = p.id
        LEFT JOIN "User" u ON u.id = p."ownerId"
        WHERE
          (${status}::text IS NULL OR p.status::text = ${status}::text) AND
          (${type}::text IS NULL OR p.type::text = ${type}::text) AND
          (${minPrice}::decimal IS NULL OR p.price >= ${minPrice}::decimal) AND
          (${maxPrice}::decimal IS NULL OR p.price <= ${maxPrice}::decimal) AND
          (${beds}::int IS NULL OR p.beds >= ${beds}::int) AND
          (${baths}::float IS NULL OR p.baths >= ${baths}::float) AND
          (${search}::text IS NULL OR
           p.title ILIKE '%' || ${search} || '%' OR
           p.address ILIKE '%' || ${search} || '%' OR
           p.city ILIKE '%' || ${search} || '%' OR
           p.description ILIKE '%' || ${search} || '%')
        GROUP BY p.id, u.id
        ORDER BY
          CASE WHEN ${sortBy} = 'price-asc' THEN p.price END ASC,
          CASE WHEN ${sortBy} = 'price-desc' THEN p.price END DESC,
          CASE WHEN ${sortBy} = 'newest' OR ${sortBy}::text IS NULL THEN p."createdAt" END DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const total = await prisma.property.count({
        where: {
          ...(status ? { status: status as any } : {}),
          ...(type ? { type: type as any } : {}),
          ...(minPrice || maxPrice
            ? {
                price: {
                  ...(minPrice ? { gte: minPrice } : {}),
                  ...(maxPrice ? { lte: maxPrice } : {}),
                },
              }
            : {}),
          ...(beds ? { beds: { gte: beds } } : {}),
          ...(baths ? { baths: { gte: baths } } : {}),
          ...(search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { city: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          } : {}),
        },
      })

      return { properties, total }
    }, "getProperties")

    const result = await getPropertiesQuery()

    return {
      properties: result.properties as any[],
      total: result.total,
      hasMore: offset + limit < result.total,
      page,
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return { properties: [], total: 0, hasMore: false, page }
  }
}

// Get property by ID - OPTIMIZED
export async function getPropertyById(id: string) {
  try {
    const getPropertyQuery = withQueryPerformance(async () => {
      return prisma.property.findUnique({
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
          savedBy: {
            select: {
              userId: true,
            },
          },
        },
      })
    }, "getPropertyById")

    const property = await getPropertyQuery()

    return { success: true, property }
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return { success: false, property: null }
  }
}

// Other functions...
