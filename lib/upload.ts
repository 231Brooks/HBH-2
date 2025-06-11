import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File): Promise<string> {
  try {
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer()
    const base64File = Buffer.from(fileBuffer).toString("base64")
    const base64Data = `data:${file.type};base64,${base64File}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "hbh",
    })

    return result.secure_url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract public_id from URL
    const publicId = url.split("/").pop()?.split(".")[0]
    if (!publicId) return false

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(`hbh/${publicId}`)

    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
