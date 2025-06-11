import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { v2 as cloudinary } from "cloudinary"
import prisma from "@/lib/prisma"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const signature = headersList.get("x-cloudinary-signature")

    // Verify webhook signature (in production, you should validate this)
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const payload = await request.json()

    // Handle different notification types
    switch (payload.notification_type) {
      case "upload":
        await handleUploadNotification(payload)
        break
      case "delete":
        await handleDeleteNotification(payload)
        break
      default:
        console.log(`Unhandled notification type: ${payload.notification_type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Cloudinary callback error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleUploadNotification(payload: any) {
  const { public_id, secure_url, metadata } = payload

  // If this is a property image, update the database
  if (metadata?.property_id) {
    await prisma.propertyImage.create({
      data: {
        publicId: public_id,
        url: secure_url,
        propertyId: metadata.property_id,
        isPrimary: metadata.is_primary === "true",
      },
    })
  }

  // Add your custom logic here
}

async function handleDeleteNotification(payload: any) {
  const { public_id } = payload

  // Remove from database if exists
  await prisma.propertyImage.deleteMany({
    where: { publicId: public_id },
  })

  // Add your custom logic here
}
