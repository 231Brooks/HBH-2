import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/marketplace",
    "/services",
    "/job-marketplace",
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))

  // Check if the path is for static assets or API
  const isStaticAsset = path.startsWith("/_next") || path.startsWith("/images") || path.startsWith("/favicon")

  const isApiPath = path.startsWith("/api")

  // If it's a static asset or public path, allow access
  if (isStaticAsset || isPublicPath) {
    return NextResponse.next()
  }

  // For API routes, we'll let them handle their own auth
  if (isApiPath) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Define protected routes that require authentication
  const protectedRoutes = ["/profile", "/progress", "/messages", "/calendar"]

  // Define admin-only routes
  const adminRoutes = ["/admin"]

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Check if the requested path is an admin-only route
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

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
  if (isAuthenticated && path.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
}
