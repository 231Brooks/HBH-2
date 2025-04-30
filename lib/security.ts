import type { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { nanoid } from "nanoid"

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100

// Store IP requests
const ipRequests: Record<string, { count: number; resetTime: number }> = {}

// CSRF token storage - in a real app, this would use Redis or similar
const csrfTokens = new Map<string, { userId: string; expires: number }>()

// Clean up expired CSRF tokens periodically
setInterval(
  () => {
    const now = Date.now()
    for (const [token, data] of csrfTokens.entries()) {
      if (data.expires < now) {
        csrfTokens.delete(token)
      }
    }
  },
  15 * 60 * 1000,
) // Clean up every 15 minutes

// Security middleware
export function withSecurity(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Generate request ID for tracing
      const requestId = nanoid()
      res.setHeader("X-Request-ID", requestId)

      // Rate limiting
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown"

      if (!ipRequests[ip]) {
        ipRequests[ip] = {
          count: 0,
          resetTime: Date.now() + RATE_LIMIT_WINDOW,
        }
      }

      // Reset rate limit if window has passed
      if (ipRequests[ip].resetTime < Date.now()) {
        ipRequests[ip] = {
          count: 0,
          resetTime: Date.now() + RATE_LIMIT_WINDOW,
        }
      }

      // Increment request count
      ipRequests[ip].count++

      // Check if rate limit exceeded
      if (ipRequests[ip].count > MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({ error: "Too many requests", requestId })
      }

      // CSRF protection for non-GET requests
      if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        const csrfToken = req.headers["x-csrf-token"] as string

        // Check if token exists and is valid
        if (!csrfToken) {
          return res.status(403).json({ error: "CSRF token missing", requestId })
        }

        const tokenData = csrfTokens.get(csrfToken)
        if (!tokenData) {
          return res.status(403).json({ error: "Invalid CSRF token", requestId })
        }

        // Check if token is expired
        if (tokenData.expires < Date.now()) {
          csrfTokens.delete(csrfToken)
          return res.status(403).json({ error: "CSRF token expired", requestId })
        }

        // Check if user ID matches (if authenticated)
        const token = await getToken({ req })
        if (token && token.sub !== tokenData.userId) {
          return res.status(403).json({ error: "CSRF token user mismatch", requestId })
        }
      }

      // Set security headers
      res.setHeader("X-Content-Type-Options", "nosniff")
      res.setHeader("X-Frame-Options", "DENY")
      res.setHeader("X-XSS-Protection", "1; mode=block")
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

      // Continue to the actual handler
      return await handler(req, res)
    } catch (error) {
      console.error("Security middleware error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }
}

// Generate a CSRF token for a user
export function generateCsrfToken(userId: string): string {
  const token = nanoid(32)
  const expires = Date.now() + 4 * 60 * 60 * 1000 // 4 hours expiry

  csrfTokens.set(token, { userId, expires })
  return token
}

// Validate user input to prevent injection attacks
export function sanitizeInput(input: string): string {
  // Basic sanitization
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}
