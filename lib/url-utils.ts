/**
 * Gets the base URL for the application
 */
export function getBaseUrl(): string {
  // For server-side rendering
  if (typeof window === "undefined") {
    // Check for Vercel environment variables first
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }

    // Check for explicit NEXTAUTH_URL (which should include protocol)
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL
    }

    // Fallback for local development
    return "http://localhost:3000"
  }

  // For client-side rendering
  return window.location.origin
}

/**
 * Creates a full URL from a path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Gets deployment information from environment variables
 */
export function getDeploymentInfo() {
  return {
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || null,
    nextAuthUrl: process.env.NEXTAUTH_URL || null,
    environment: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isVercel: Boolean(process.env.NEXT_PUBLIC_VERCEL_URL),
    baseUrl: getBaseUrl(),
  }
}
