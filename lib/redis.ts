import { Redis } from "@upstash/redis"

// Create a singleton Redis client
let redis: Redis | null = null

export function getRedisClient() {
  if (!redis) {
    redis = Redis.fromEnv()
  }
  return redis
}

// Helper function to cache data with expiration
export async function cacheData<T>(key: string, data: T, expirationInSeconds = 3600) {
  const client = getRedisClient()
  await client.set(key, JSON.stringify(data), { ex: expirationInSeconds })
  return data
}

// Helper function to get cached data
export async function getCachedData<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  const data = await client.get(key)
  if (!data) return null
  return JSON.parse(data as string) as T
}

// Helper function to invalidate cache
export async function invalidateCache(key: string) {
  const client = getRedisClient()
  await client.del(key)
}

// Helper function to cache data with a prefix for collections
export async function cacheCollection<T>(prefix: string, id: string, data: T, expirationInSeconds = 3600) {
  return cacheData(`${prefix}:${id}`, data, expirationInSeconds)
}

// Helper function to get cached collection data
export async function getCachedCollection<T>(prefix: string, id: string): Promise<T | null> {
  return getCachedData<T>(`${prefix}:${id}`)
}

// Helper function to invalidate a collection cache
export async function invalidateCollectionCache(prefix: string, id: string) {
  return invalidateCache(`${prefix}:${id}`)
}
