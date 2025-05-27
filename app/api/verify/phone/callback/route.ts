import { NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const apiKey = headersList.get("x-api-key")

    // Verify API key
    if (apiKey !== process.env.PHONE_VERIFICATION_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const payload = await request.json()
    const { userId, status, phone } = payload

    if (!userId || !status || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user phone verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        phoneVerified: status === "approved",
        phone: phone,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Phone verification callback error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
