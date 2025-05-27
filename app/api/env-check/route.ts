import { NextResponse } from "next/server"

export async function GET() {
  // Only check existence, not actual values for security
  return NextResponse.json({
    variables: {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_VERCEL_URL: !!process.env.NEXT_PUBLIC_VERCEL_URL,
      ALLOWED_REDIRECT_DOMAINS: !!process.env.ALLOWED_REDIRECT_DOMAINS,
      ALLOWED_CSS_DOMAINS: !!process.env.ALLOWED_CSS_DOMAINS,
    },
    timestamp: new Date().toISOString(),
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "unknown",
  })
}
