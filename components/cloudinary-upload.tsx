"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Upload, Check, AlertCircle } from "lucide-react"
import Image from "next/image"

interface CloudinaryUploadProps {
  onUpload: (url: string) => void
  label?: string
  accept?: string
  maxSize?: number // in MB
}

export default function CloudinaryUpload({
  onUpload,
  label = "Upload Image",
  accept = "image/*,.heic,.heif",
  maxSize = 5, // Default 5MB
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create a temporary preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "ml_default") // Use your upload preset or create one in Cloudinary dashboard

      // Upload to Cloudinary directly from the browser
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Call the onUpload callback with the secure URL
      onUpload(data.secure_url)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image. Please try again.")
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 relative">
        {preview ? (
          <div className="relative w-full h-48">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">{label}</p>
            <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to upload</p>
          </div>
        )}

        <Input
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={isUploading}
          className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
            isUploading ? "pointer-events-none" : ""
          }`}
        />

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {preview && !error && !isUploading && (
        <div className="flex items-center text-green-600 text-sm">
          <Check className="h-4 w-4 mr-1" />
          Upload successful
        </div>
      )}
    </div>
  )
}
