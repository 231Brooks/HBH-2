"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedImage {
  id: string
  url: string
  isPrimary: boolean
}

interface MultiImageUploadProps {
  onUpload: (images: UploadedImage[]) => void
  initialImages?: UploadedImage[]
  folder?: string
  maxFiles?: number
  maxSize?: number // in MB
  className?: string
}

export default function MultiImageUpload({
  onUpload,
  initialImages = [],
  folder = "properties",
  maxFiles = 10,
  maxSize = 10, // 10MB
  className = "",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadToCloudinary = async (file: File): Promise<UploadedImage | null> => {
    try {
      setUploading(true)
      setError(null)
      setCurrentProgress(10)

      // Get signature from server
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder }),
      })

      if (!signatureResponse.ok) {
        throw new Error("Failed to get upload signature")
      }

      const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json()
      setCurrentProgress(30)

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("timestamp", timestamp.toString())
      formData.append("signature", signature)
      formData.append("folder", folder)

      // Upload to Cloudinary
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      })

      setCurrentProgress(90)

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      const data = await uploadResponse.json()
      setCurrentProgress(100)

      return {
        id: data.public_id,
        url: data.secure_url,
        isPrimary: images.length === 0, // First image is primary by default
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
      return null
    } finally {
      setUploading(false)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const remainingSlots = maxFiles - images.length
    if (remainingSlots <= 0) {
      setError(`Maximum of ${maxFiles} images allowed`)
      return
    }

    const filesToUpload = acceptedFiles.slice(0, remainingSlots)
    setUploading(true)

    try {
      const uploadPromises = filesToUpload.map(uploadToCloudinary)
      const uploadedImages = await Promise.all(uploadPromises)

      const validImages = uploadedImages.filter((img): img is UploadedImage => img !== null)

      if (validImages.length > 0) {
        const newImages = [...images, ...validImages]
        setImages(newImages)
        onUpload(newImages)
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload one or more images")
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxFiles - images.length,
    maxSize: maxSize * 1024 * 1024,
    disabled: uploading || images.length >= maxFiles,
  })

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)

    // If we removed the primary image, make the first image primary
    if (images[indexToRemove].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }

    setImages(newImages)
    onUpload(newImages)
  }

  const setPrimaryImage = (indexToSetPrimary: number) => {
    const newImages = images.map((image, index) => ({
      ...image,
      isPrimary: index === indexToSetPrimary,
    }))

    setImages(newImages)
    onUpload(newImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={cn(
              "relative group aspect-square rounded-md overflow-hidden border",
              image.isPrimary && "ring-2 ring-primary ring-offset-2",
            )}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={`Property image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!image.isPrimary && (
                <Button type="button" size="sm" onClick={() => setPrimaryImage(index)} className="h-8">
                  Set as Primary
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeImage(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {image.isPrimary && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </div>
        ))}

        {images.length < maxFiles && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center p-4 transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Uploading...</p>
                <div className="w-full mt-2">
                  <Progress value={currentProgress} className="h-1" />
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-center">Drag images here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {images.length} of {maxFiles} images uploaded
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
