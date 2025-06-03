import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    variables: {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_VERCEL_URL: !!process.env.NEXT_PUBLIC_VERCEL_URL,
      ALLOWED_REDIRECT_DOMAINS: !!process.env.ALLOWED_REDIRECT_DOMAINS,
      ALLOWED_CSS_DOMAINS: !!process.env.ALLOWED_CSS_DOMAINS,
      // Debug info (do not expose secrets!)
      CI: process.env.CI || null,
      NODE_ENV: process.env.NODE_ENV || null,
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL || null, // Only show value if safe
      // add any other safe variables you want here
    },
    timestamp: new Date().toISOString(),
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "unknown",
  })
}
