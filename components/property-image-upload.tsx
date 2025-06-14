"use client"

import React, { useState } from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface PropertyImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
}

export function PropertyImageUpload({
  onImagesChange,
  maxImages = 10,
  maxSizePerImage = 5,
}: PropertyImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState<boolean[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`)
      return
    }

    setError(null)
    
    // Initialize uploading states
    const newUploadingStates = [...uploading, ...files.map(() => true)]
    setUploading(newUploadingStates)

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`)
        }

        // Validate file size
        if (file.size > maxSizePerImage * 1024 * 1024) {
          throw new Error(`${file.name} exceeds ${maxSizePerImage}MB limit`)
        }

        // Upload to server
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        return data.url
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error)
        throw error
      }
    })

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      onImagesChange(newImages)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload some images')
    } finally {
      setUploading([])
    }

    // Clear the input
    event.target.value = ''
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const isUploading = uploading.some(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Property Photos
        </CardTitle>
        <CardDescription>
          Upload photos of your property. The first photo will be used as the main image.
          Maximum {maxImages} photos, {maxSizePerImage}MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || images.length >= maxImages}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="property-images"
          />
          <label
            htmlFor="property-images"
            className={`
              flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
              transition-colors cursor-pointer
              ${isUploading || images.length >= maxImages
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isUploading ? 'Uploading...' : 'Click to upload photos'}
            </p>
            <p className="text-xs text-gray-500">
              {images.length >= maxImages
                ? `Maximum ${maxImages} photos reached`
                : `PNG, JPG, GIF up to ${maxSizePerImage}MB each`
              }
            </p>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Uploaded Photos ({images.length}/{maxImages})
              </p>
              {images.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  First photo will be the main image
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={url}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  {/* Move Buttons */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0 text-xs"
                          onClick={() => moveImage(index, index - 1)}
                        >
                          ←
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0 text-xs"
                          onClick={() => moveImage(index, index + 1)}
                        >
                          →
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Uploading images...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
