import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 })
    }

    // Check if Prisma is available
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Database not configured",
          message: "Database connection is not available",
        },
        { status: 503 },
      )
    }

    // Dynamic imports to avoid build-time errors
    const { verifyToken, consumeToken } = await import("@/lib/enhanced-auth")
    const { default: prisma } = await import("@/lib/prisma")
    const { logSecurityEvent } = await import("@/lib/security-logger")
    const { withTimeout, TIMEOUT_DURATIONS } = await import("@/lib/operation-timeout")

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
  } catch (error: any) {
    console.error("Email verification error:", error)

    // Handle specific Prisma errors
    if (error.message?.includes("Prisma")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database service unavailable",
          message: "Please try again later",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during verification",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
