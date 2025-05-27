import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { validateCallbackUrl } from "./lib/validation-utils"
import { apiRateLimiter, authRateLimiter } from "./lib/rate-limiter"

// Helper function to generate a nonce for CSP
function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}

// Get allowed domains from environment or use defaults
const getAllowedDomains = (): string[] => {
  const configuredDomains = process.env.ALLOWED_REDIRECT_DOMAINS
  if (configuredDomains) {
    return configuredDomains.split(",").map((domain) => domain.trim())
  }

  // Default allowed domains
  return ["localhost", "vercel.app"]
}

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const path = request.nextUrl.pathname

  // Apply rate limiting based on path
  if (path.startsWith("/api/auth/")) {
    const key = `auth:${ip}`
    const result = authRateLimiter.check(key)

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Too many authentication attempts, please try again later",
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
          },
        },
      )
    }
  } else if (path.startsWith("/api/")) {
    const key = `api:${ip}:${path}`
    const result = apiRateLimiter.check(key)

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Rate limit exceeded",
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "60",
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
          },
        },
      )
    }
  }

  // Validate callback URL if present
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
  if (callbackUrl) {
    const allowedDomains = getAllowedDomains()
    if (!validateCallbackUrl(callbackUrl, allowedDomains)) {
      // Redirect to safe path without the malicious callback
      const safeUrl = new URL(request.nextUrl.pathname, request.url)
      return NextResponse.redirect(safeUrl)
    }
  }

  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Define protected routes that require authentication
  const protectedRoutes = ["/profile", "/progress", "/messages", "/calendar"]

  // Define admin-only routes
  const adminRoutes = ["/admin"]

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Check if the requested path is an admin-only route
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Redirect to login if trying to access a protected route while not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to unauthorized page if trying to access an admin route without admin privileges
  if (isAdminRoute && (!isAuthenticated || token?.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  // Redirect to profile if trying to access auth pages while already authenticated
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  // Generate a nonce for CSP
  const nonce = generateNonce()

  // Get the response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://analytics.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.cloudinary.com; connect-src 'self' https://*.vercel.app https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none';`,
  )

  // Store nonce in request headers for use in layout
  request.headers.set("x-nonce", nonce)

  return response
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/progress/:path*",
    "/messages/:path*",
    "/calendar/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
