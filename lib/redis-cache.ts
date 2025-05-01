import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Cache TTLs (time-to-live) in seconds - OPTIMIZED based on data volatility
const TTL = {
  // Very volatile data (changes frequently)
  VOLATILE: 60, // 1 minute

  // Moderately volatile data
  MODERATE: 300, // 5 minutes

  // Stable data (changes infrequently)
  STABLE: 1800, // 30 minutes

  // Very stable data (rarely changes)
  VERY_STABLE: 86400, // 24 hours
}

// Data volatility mapping
const DATA_VOLATILITY = {
  // Property data
  PROPERTY_LIST_ALL: TTL.MODERATE, // All properties list - moderate changes
  PROPERTY_LIST_FILTERED: TTL.MODERATE, // Filtered properties - moderate changes
  PROPERTY_DETAIL: TTL.STABLE, // Individual property details - stable
  PROPERTY_IMAGES: TTL.VERY_STABLE, // Property images - very stable

  // User data
  USER_PROFILE: TTL.STABLE, // User profiles - stable
  USER_PREFERENCES: TTL.MODERATE, // User preferences - moderate changes

  // Transaction data
  TRANSACTION_LIST: TTL.VOLATILE, // Transaction lists - volatile
  TRANSACTION_DETAIL: TTL.VOLATILE, // Transaction details - volatile

  // Search data
  SEARCH_RESULTS: TTL.MODERATE, // Search results - moderate changes

  // Statistics and aggregations
  STATS_DAILY: TTL.MODERATE, // Daily statistics - moderate changes
  STATS_WEEKLY: TTL.STABLE, // Weekly statistics - stable
  STATS_MONTHLY: TTL.VERY_STABLE, // Monthly statistics - very stable
}

// Cache key prefixes
export const CACHE_KEYS = {
  PROPERTY_LIST: "property:list:",
  PROPERTY_DETAIL: "property:detail:",
  USER_PROFILE: "user:profile:",
  SERVICE_LIST: "service:list:",
  JOB_LIST: "job:list:",
  STATS: "stats:",
  SEARCH: "search:",
  TRANSACTION: "transaction:",
}

// Cache hit/miss tracking
const cacheStats = {
  hits: 0,
  misses: 0,
  reset: function () {
    this.hits = 0
    this.misses = 0
  },
  getHitRate: function () {
    const total = this.hits + this.misses
    return total > 0 ? (this.hits / total) * 100 : 0
  },
}

// Generic cache functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    if (data) {
      cacheStats.hits++
      return data as T
    } else {
      cacheStats.misses++
      return null
    }
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error)
    return null
  }
}

export async function setCache(key: string, data: any, volatilityType: keyof typeof DATA_VOLATILITY): Promise<boolean> {
  try {
    const ttl = DATA_VOLATILITY[volatilityType] || TTL.MODERATE
    await redis.set(key, data, { ex: ttl })
    return true
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error)
    return false
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error)
    return false
  }
}

// Clear cache by prefix
export async function clearCacheByPrefix(prefix: string): Promise<boolean> {
  try {
    const keys = await redis.keys(`${prefix}*`)
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis.del(key)))
    }
    return true
  } catch (error) {
    console.error(`Failed to clear cache with prefix ${prefix}:`, error)
    return false
  }
}

// Get cache statistics
export function getCacheStats() {
  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: cacheStats.getHitRate().toFixed(2),
  }
}

// Reset cache statistics
export function resetCacheStats() {
  cacheStats.reset()
  return true
}

// Specific caching functions for the application
export async function cachePropertyList(filters: string, data: any): Promise<boolean> {
  const key = `${CACHE_KEYS.PROPERTY_LIST}${filters}`
  return setCache(key, data, filters ? "PROPERTY_LIST_FILTERED" : "PROPERTY_LIST_ALL")
}

export async function getCachedPropertyList(filters: string): Promise<any | null> {
  const key = `${CACHE_KEYS.PROPERTY_LIST}${filters}`
  return getCache(key)
}

export async function cachePropertyDetail(id: string, data: any): Promise<boolean> {
  const key = `${CACHE_KEYS.PROPERTY_DETAIL}${id}`
  return setCache(key, data, "PROPERTY_DETAIL")
}

export async function getCachedPropertyDetail(id: string): Promise<any | null> {
  const key = `${CACHE_KEYS.PROPERTY_DETAIL}${id}`
  return getCache(key)
}

export async function invalidatePropertyCache(id?: string): Promise<void> {
  if (id) {
    await deleteCache(`${CACHE_KEYS.PROPERTY_DETAIL}${id}`)
  }
  await clearCacheByPrefix(CACHE_KEYS.PROPERTY_LIST)
}

// Higher-order function that adds caching to any data fetching function
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fetchFn: T,
  cacheKeyFn: (...args: Parameters<T>) => string,
  volatilityType: keyof typeof DATA_VOLATILITY,
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = cacheKeyFn(...args)

    try {
      // Try to get from cache first
      const cachedData = await getCache<ReturnType<T>>(cacheKey)
      if (cachedData) {
        return cachedData
      }

      // If not in cache, call the original function
      const result = await fetchFn(...args)

      // Save result to cache
      await setCache(cacheKey, result, volatilityType)

      return result
    } catch (error) {
      // If cache operation fails, fall back to the original function
      return fetchFn(...args)
    }
  }) as T
}
