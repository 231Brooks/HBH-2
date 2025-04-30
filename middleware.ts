import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/progress/:path*",
    "/messages/:path*",
    "/calendar/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
}
