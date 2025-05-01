import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Cache TTLs (time-to-live) in seconds
const TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
}

// Cache key prefixes
export const CACHE_KEYS = {
  PROPERTY_LIST: "property:list:",
  PROPERTY_DETAIL: "property:detail:",
  USER_PROFILE: "user:profile:",
  SERVICE_LIST: "service:list:",
  JOB_LIST: "job:list:",
  STATS: "stats:",
}

// Generic cache functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data as T
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error)
    return null
  }
}

export async function setCache(key: string, data: any, ttl = TTL.MEDIUM): Promise<boolean> {
  try {
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

// Specific caching functions for the application
export async function cachePropertyList(filters: string, data: any): Promise<boolean> {
  const key = `${CACHE_KEYS.PROPERTY_LIST}${filters}`
  return setCache(key, data, TTL.SHORT)
}

export async function getCachedPropertyList(filters: string): Promise<any | null> {
  const key = `${CACHE_KEYS.PROPERTY_LIST}${filters}`
  return getCache(key)
}

export async function cachePropertyDetail(id: string, data: any): Promise<boolean> {
  const key = `${CACHE_KEYS.PROPERTY_DETAIL}${id}`
  return setCache(key, data, TTL.MEDIUM)
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
  ttl = TTL.MEDIUM,
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
      await setCache(cacheKey, result, ttl)

      return result
    } catch (error) {
      // If cache operation fails, fall back to the original function
      return fetchFn(...args)
    }
  }) as T
}
