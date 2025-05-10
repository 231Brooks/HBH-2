import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/about" || path === "/"

  // Get the session cookie
  const session = request.cookies.get("session")?.value

  // Add security headers to all responses
  const response = applySecurityHeaders(
    isPublicPath && !session && path !== "/" && path !== "/about"
      ? NextResponse.redirect(new URL("/login", request.url))
      : !isPublicPath && !session
        ? NextResponse.redirect(new URL("/login", request.url))
        : isPublicPath && path !== "/" && path !== "/about" && session
          ? NextResponse.redirect(new URL("/dashboard", request.url))
          : NextResponse.next(),
  )

  // Log request for monitoring (excluding assets and API health checks)
  if (!path.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) && path !== "/api/health") {
    logger.info(`${request.method} ${path}`, {
      ip: request.ip || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })
  }

  return response
}

// Apply security headers to responses
function applySecurityHeaders(response: NextResponse) {
  // Security headers
  const headers = response.headers

  // Content Security Policy
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.pusher.com; connect-src 'self' https://*.pusher.com wss://*.pusher.com; img-src 'self' data: blob: https://*; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
  )

  // Other security headers
  headers.set("X-DNS-Prefetch-Control", "on")
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  headers.set("X-XSS-Protection", "1; mode=block")
  headers.set("X-Frame-Options", "SAMEORIGIN")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "origin-when-cross-origin")
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return response
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    // Apply to all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
