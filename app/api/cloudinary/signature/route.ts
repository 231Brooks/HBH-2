import { NextResponse } from "next/server"
import { generateSignature } from "@/lib/cloudinary"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { folder = "general", publicId, transformation } = body

    const params: Record<string, any> = {
      folder,
    }

    if (publicId) {
      params.public_id = publicId
    }

    if (transformation) {
      params.transformation = transformation
    }

    const { timestamp, signature } = generateSignature(params)

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error) {
    console.error("Error generating signature:", error)
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 })
  }
}
