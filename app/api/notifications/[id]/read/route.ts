import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Import prisma dynamically to avoid issues during build time
let prisma: any

// This function will be called at runtime, not build time
async function getPrismaClient() {
  if (!prisma) {
    const { default: prismaModule } = await import("@/lib/prisma")
    prisma = prismaModule
  }
  return prisma
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the ID is valid before querying
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 })
    }

    // Get prisma client at runtime
    const prismaClient = await getPrismaClient()

    // Try to find the notification
    const notification = await prismaClient.notification
      .findUnique({
        where: { id: params.id },
      })
      .catch((error: any) => {
        console.error("Error finding notification:", error)
        return null
      })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.recipientId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the notification
    await prismaClient.notification
      .update({
        where: { id: params.id },
        data: { read: true },
      })
      .catch((error: any) => {
        console.error("Error updating notification:", error)
        throw error
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
