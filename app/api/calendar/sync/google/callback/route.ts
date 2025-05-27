import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")

    if (error) {
      return NextResponse.redirect(new URL(`/calendar?error=${error}`, url.origin))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/calendar?error=missing_code", url.origin))
    }

    // Exchange code for tokens (in a real implementation, you would call Google's API)
    const tokens = await exchangeCodeForTokens(code)

    // Store tokens in database
    await prisma.calendarIntegration.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: "GOOGLE",
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      create: {
        userId: session.user.id,
        provider: "GOOGLE",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    })

    return NextResponse.redirect(new URL("/calendar?sync=success", url.origin))
  } catch (error: any) {
    console.error("Google Calendar sync error:", error)
    return NextResponse.redirect(
      new URL(`/calendar?error=${encodeURIComponent(error.message)}`, new URL(request.url).origin),
    )
  }
}

// Mock function - in a real implementation, you would call Google's API
async function exchangeCodeForTokens(code: string) {
  // This is a mock implementation
  return {
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    expires_in: 3600,
  }
}
