"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function TestCloudinaryUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      setUploadedUrl(data.url)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Cloudinary Upload</CardTitle>
          <CardDescription>Verify that Cloudinary integration is working correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="picture" className="text-sm font-medium">
              Select Image
            </label>
            <input
              id="picture"
              type="file"
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {uploadedUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Uploaded Image:</p>
              <div className="relative h-48 w-full overflow-hidden rounded-md">
                <Image src={uploadedUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 break-all">{uploadedUrl}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={uploading || !file} className="w-full">
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
