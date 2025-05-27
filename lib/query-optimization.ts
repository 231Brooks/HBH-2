import { performance } from "perf_hooks"
import prisma from "@/lib/prisma-pool"
import { logSlowQuery } from "@/lib/db-monitoring"
import { withCache } from "@/lib/redis-cache"

// Optimized property search with pagination, filtering, and sorting
export async function optimizedPropertySearch(options: {
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  city?: string
  state?: string
  sortBy?: string
  sortDir?: "asc" | "desc"
  page?: number
  pageSize?: number
}) {
  const {
    status,
    type,
    minPrice,
    maxPrice,
    beds,
    baths,
    city,
    state,
    sortBy = "createdAt",
    sortDir = "desc",
    page = 1,
    pageSize = 10,
  } = options

  const start = performance.now()
  const skip = (page - 1) * pageSize

  try {
    // Build where clause
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
    if (city) where.city = city
    if (state) where.state = state

    // Build order by
    const orderBy: any = {}
    orderBy[sortBy] = sortDir

    // Execute query with countQuery in parallel for better performance
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            take: 1, // Only get first image for listing preview
          },
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ])

    const duration = performance.now() - start

    // Log performance metrics
    logSlowQuery({
      query: `optimizedPropertySearch(${JSON.stringify(options)})`,
      duration,
      timestamp: new Date(),
      success: true,
    })

    return {
      properties,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + pageSize < total,
    }
  } catch (error: any) {
    const duration = performance.now() - start

    // Log error
    logSlowQuery({
      query: `optimizedPropertySearch(${JSON.stringify(options)})`,
      duration,
      timestamp: new Date(),
      success: false,
      error: error.message,
    })

    throw error
  }
}

// Add caching to the optimized property search
export const cachedPropertySearch = withCache(
  optimizedPropertySearch,
  (options) => `property:search:${JSON.stringify(options)}`,
  "PROPERTY_LIST_FILTERED",
)

// Optimized property detail fetch with related properties
export async function optimizedPropertyDetail(id: string, includeRelated = true) {
  const start = performance.now()

  try {
    // Get property details
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
        savedBy: {
          select: {
            userId: true,
          },
        },
      },
    })

    // If property not found or related properties not requested
    if (!property || !includeRelated) {
      const duration = performance.now() - start
      logSlowQuery({
        query: `optimizedPropertyDetail(${id}, ${includeRelated})`,
        duration,
        timestamp: new Date(),
        success: true,
      })
      return { property, relatedProperties: [] }
    }

    // Get related properties in parallel
    const relatedProperties = await prisma.property.findMany({
      where: {
        id: { not: id },
        OR: [
          { city: property.city },
          { type: property.type },
          {
            AND: [{ price: { gte: property.price * 0.8 } }, { price: { lte: property.price * 1.2 } }],
          },
        ],
      },
      include: {
        images: {
          take: 1,
        },
      },
      take: 4,
    })

    const duration = performance.now() - start
    logSlowQuery({
      query: `optimizedPropertyDetail(${id}, ${includeRelated})`,
      duration,
      timestamp: new Date(),
      success: true,
    })

    return { property, relatedProperties }
  } catch (error: any) {
    const duration = performance.now() - start
    logSlowQuery({
      query: `optimizedPropertyDetail(${id}, ${includeRelated})`,
      duration,
      timestamp: new Date(),
      success: false,
      error: error.message,
    })
    throw error
  }
}

// Add caching to the optimized property detail
export const cachedPropertyDetail = withCache(
  optimizedPropertyDetail,
  (id) => `property:detail:${id}`,
  "PROPERTY_DETAIL",
)

// Batch loader for efficient loading of multiple properties
export function createPropertyBatchLoader() {
  const batchSize = 20
  const cache = new Map()

  return async function loadProperties(ids: string[]) {
    // Filter out ids that are already in cache
    const uncachedIds = ids.filter((id) => !cache.has(id))

    if (uncachedIds.length > 0) {
      // Fetch properties in batches
      for (let i = 0; i < uncachedIds.length; i += batchSize) {
        const batchIds = uncachedIds.slice(i, i + batchSize)
        const properties = await prisma.property.findMany({
          where: { id: { in: batchIds } },
          include: {
            images: { take: 1 },
            owner: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        })

        // Add to cache
        properties.forEach((property) => {
          cache.set(property.id, property)
        })
      }
    }

    // Return properties from cache
    return ids.map((id) => cache.get(id) || null)
  }
}
