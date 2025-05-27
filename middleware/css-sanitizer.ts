import { type NextRequest, NextResponse } from "next/server"

/**
 * Middleware to sanitize CSS in requests
 * Note: Next.js middleware cannot easily modify request bodies
 * This is primarily for logging and quick rejection of obviously malicious requests
 */
export default async function cssSanitizerMiddleware(request: NextRequest): Promise<NextResponse> {
  // Only process POST requests to CSS-related endpoints
  if (
    request.method === "POST" &&
    (request.nextUrl.pathname.includes("/user-css") ||
      request.nextUrl.pathname.includes("/theme") ||
      request.nextUrl.pathname.includes("/style"))
  ) {
    // In middleware, we can't easily read and modify the request body
    // So we'll pass it through to be handled by the API route
    // In a real implementation, you might want to add additional checks here

    // Log the request for security monitoring
    console.log(`CSS request to ${request.nextUrl.pathname} from ${request.ip}`)
  }

  // Continue to the API route which will do the actual sanitization
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/user-css/:path*", "/api/theme/:path*", "/api/style/:path*"],
}
