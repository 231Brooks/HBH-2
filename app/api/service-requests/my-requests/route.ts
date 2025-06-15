import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        clientId: user.id,
      },
      include: {
        responses: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      serviceRequests,
    })
  } catch (error) {
    console.error("Failed to get user service requests:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load service requests" },
      { status: 500 }
    )
  }
}
