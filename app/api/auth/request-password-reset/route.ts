import { NextResponse } from "next/server"
import { validateEmail } from "@/lib/validation-utils"
import { createVerificationRequest, sendVerificationEmail } from "@/lib/enhanced-auth"
import prisma from "@/lib/prisma"
import { logSecurityEvent } from "@/lib/security-logger"
import { authRateLimiter } from "@/lib/rate-limiter"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    // Apply rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const key = `password-reset:${ip}`
    const result = authRateLimiter.check(key)

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    })

    // Always return success even if user doesn't exist (to prevent email enumeration)
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Create verification token
    const token = await createVerificationRequest(email, "password-reset", user.id)

    // Send verification email
    await sendVerificationEmail(email, token, "password-reset")

    // Log security event
    await logSecurityEvent({
      userId: user.id,
      action: "verification_requested",
      details: "Password reset requested",
      ip: ip.toString(),
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ success: false, error: "An error occurred processing your request" }, { status: 500 })
  }
}
