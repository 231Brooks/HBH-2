import { NextResponse } from "next/server"
import { testCloudinaryConnection } from "@/lib/test-cloudinary"

export async function GET() {
  try {
    const result = await testCloudinaryConnection()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, message: result.message, error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to test Cloudinary connection", error },
      { status: 500 },
    )
  }
}
