import { NextResponse } from "next/server"

export async function GET() {
  // Filter all GOOGLE* and GITHUB* env vars
  const googleVars = Object.keys(process.env)
    .filter(key => key.startsWith("GOOGLE"))
    .reduce((obj, key) => {
      obj[key] = process.env[key]
      return obj
    }, {} as Record<string, string | undefined>);

  const githubVars = Object.keys(process.env)
    .filter(key => key.startsWith("GITHUB"))
    .reduce((obj, key) => {
      obj[key] = process.env[key]
      return obj
    }, {} as Record<string, string | undefined>);

  return NextResponse.json({
    variables: {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_VERCEL_URL: !!process.env.NEXT_PUBLIC_VERCEL_URL,
      ALLOWED_REDIRECT_DOMAINS: !!process.env.ALLOWED_REDIRECT_DOMAINS,
      ALLOWED_CSS_DOMAINS: !!process.env.ALLOWED_CSS_DOMAINS,
      CI: process.env.CI || null,
      NODE_ENV: process.env.NODE_ENV || null,
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL || null
    },
    google: googleVars,
    github: githubVars,
    timestamp: new Date().toISOString(),
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "unknown",
  })
}
