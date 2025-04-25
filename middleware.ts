import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/about" || path === "/"

  // Get the session cookie
  const session = request.cookies.get("session")?.value

  // If the path requires authentication and there's no session, redirect to login
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is logged in and trying to access login/signup, redirect to dashboard
  if (isPublicPath && path !== "/" && path !== "/about" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: ["/", "/login", "/signup", "/profile", "/settings", "/invest", "/choirs", "/shop", "/dashboard"],
}
