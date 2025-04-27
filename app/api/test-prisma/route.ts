import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Dynamically import prisma to avoid build-time issues
    const { default: prisma } = await import("@/lib/prisma")

    // Simple query to test connection
    const count = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Prisma is working correctly",
      userCount: count,
    })
  } catch (error) {
    console.error("Prisma test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
