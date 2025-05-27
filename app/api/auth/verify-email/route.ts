import { NextResponse } from "next/server"
import { verifyToken, consumeToken } from "@/lib/enhanced-auth"
import prisma from "@/lib/prisma"
import { logSecurityEvent } from "@/lib/security-logger"
import { withTimeout, TIMEOUT_DURATIONS } from "@/lib/operation-timeout"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 })
    }

    // Verify token
    const verification = await verifyToken(token, "signup")

    if (!verification.valid) {
      return NextResponse.json({ success: false, error: verification.error }, { status: 400 })
    }

    // Mark email as verified
    await withTimeout(
      prisma.user.update({
        where: {
          email: verification.email,
        },
        data: {
          emailVerified: new Date(),
        },
      }),
      TIMEOUT_DURATIONS.DB_QUERY,
      "Database update timed out",
    )

    // Consume token
    await consumeToken(token)

    // Log security event
    await logSecurityEvent({
      userId: verification.userId,
      action: "verification_completed",
      details: `Email verified: ${verification.email}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during verification" }, { status: 500 })
  }
}
