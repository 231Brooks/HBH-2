import { Redis } from "@upstash/redis"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"

const redis = new Redis({
  url: process.env.REDIS_URL || process.env.KV_URL || "",
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN || "",
})

// Generate a CSRF token
export async function generateCsrfToken(userId: string): Promise<string> {
  const token = nanoid(32)
  const key = `csrf:${userId}:${token}`

  // Store token in Redis with 1-hour expiry
  await redis.set(key, true, { ex: 3600 })

  return token
}

// Validate a CSRF token
export async function validateCsrfToken(userId: string, token: string): Promise<boolean> {
  const key = `csrf:${userId}:${token}`

  // Check if token exists in Redis
  const isValid = await redis.get<boolean>(key)

  if (isValid) {
    // Delete token after use (one-time use)
    await redis.del(key)
    return true
  }

  return false
}

// Set CSRF token in cookie
export function setCsrfCookie(token: string): void {
  cookies().set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600, // 1 hour
  })
}

// Get CSRF token from cookie
export function getCsrfCookie(): string | undefined {
  return cookies().get("csrf_token")?.value
}
