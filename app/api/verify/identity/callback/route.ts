import { NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const apiKey = headersList.get("x-api-key")

    // Verify API key
    if (apiKey !== process.env.IDENTITY_VERIFICATION_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const payload = await request.json()
    const { userId, status, verificationId, details } = payload

    if (!userId || !status || !verificationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        identityVerified: status === "approved",
        identityVerificationId: verificationId,
        identityVerificationDetails: details ? JSON.stringify(details) : undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Identity verification callback error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
