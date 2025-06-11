import { v2 as cloudinary } from "cloudinary"

export async function testCloudinaryConnection() {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Test the connection by requesting account info
    const result = await cloudinary.api.ping()

    if (result.status === "ok") {
      console.log("✅ Cloudinary connection successful!")
      return { success: true, message: "Cloudinary connection successful" }
    } else {
      console.error("❌ Cloudinary connection failed:", result)
      return { success: false, message: "Cloudinary connection failed" }
    }
  } catch (error) {
    console.error("❌ Cloudinary connection error:", error)
    return {
      success: false,
      message: "Cloudinary connection error",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
