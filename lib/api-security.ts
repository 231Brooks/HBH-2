import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.REDIS_URL || process.env.KV_URL || "",
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN || "",
})

// Validate internal API requests
export async function validateInternalApiRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized: Missing or invalid authorization header",
    }
  }

  const token = authHeader.split(" ")[1]

  // Compare with server-side environment variable
  if (token !== process.env.INTERNAL_API_KEY) {
    // Log potential security breach attempt
    console.error("Invalid API key used:", {
      ip: req.ip || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      path: req.nextUrl.pathname,
    })

    return {
      success: false,
      message: "Unauthorized: Invalid API key",
    }
  }

  return { success: true }
}

// Rate limiting middleware
export async function rateLimit(
  req: NextRequest,
  { limit = 10, window = 60 }: { limit?: number; window?: number } = {},
) {
  const ip = req.ip || "anonymous"
  const key = `rate-limit:${ip}:${req.nextUrl.pathname}`

  // Get current count
  const count = (await redis.get<number>(key)) || 0

  // If count exceeds limit, return error
  if (count >= limit) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: window },
      { status: 429, headers: { "Retry-After": window.toString() } },
    )
  }

  // Increment count and set expiry
  if (count === 0) {
    await redis.set(key, 1, { ex: window })
  } else {
    await redis.incr(key)
  }

  return null // No rate limit hit
}

// Generate secure nonce for CSP
export function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}
