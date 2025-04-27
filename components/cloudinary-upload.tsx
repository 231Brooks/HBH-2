"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check, AlertCircle } from "lucide-react"

interface CloudinaryUploadProps {
  onUpload: (url: string) => void
  folder?: string
  maxFiles?: number
  maxSize?: number // in MB
  accept?: Record<string, string[]>
  className?: string
  buttonText?: string
}

export default function CloudinaryUpload({
  onUpload,
  folder = "general",
  maxFiles = 1,
  maxSize = 10, // 10MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  },
  className = "",
  buttonText = "Upload Image",
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const uploadToCloudinary = useCallback(
    async (file: File) => {
      try {
        setUploading(true)
        setError(null)
        setProgress(10)

        // Create a temporary preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

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
        setProgress(30)

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

        setProgress(90)

        if (!uploadResponse.ok) {
          throw new Error("Upload failed")
        }

        const data = await uploadResponse.json()
        setProgress(100)

        // Call the onUpload callback with the secure URL
        onUpload(data.secure_url)
        return data
      } catch (err) {
        console.error("Upload error:", err)
        setError(err instanceof Error ? err.message : "Failed to upload file")
        setPreview(null)
        return null
      } finally {
        setUploading(false)
      }
    },
    [folder, onUpload],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      await uploadToCloudinary(file)
    },
    [uploadToCloudinary],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    disabled: uploading,
  })

  const handleRemovePreview = () => {
    setPreview(null)
    setError(null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full z-10"
              onClick={handleRemovePreview}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-48 w-full">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain rounded-md" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
            <p className="text-xs text-muted-foreground mb-4">or click the button below to select a file</p>
            <Button type="button" onClick={open} disabled={uploading}>
              {buttonText}
            </Button>
          </div>
        )}

        {uploading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {preview && !error && !uploading && (
        <div className="flex items-center text-green-600 text-sm">
          <Check className="h-4 w-4 mr-1" />
          Upload successful
        </div>
      )}
    </div>
  )
}
