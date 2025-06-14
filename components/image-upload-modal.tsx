"use client"

import React, { useState, useRef } from "react"
import { Upload, X, Crop } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (url: string) => void
  title: string
  aspectRatio: "square" | "cover"
}

export function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  title, 
  aspectRatio 
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type - include HEIC support
    const isValidImageType = file.type.startsWith('image/') ||
                            file.name.toLowerCase().endsWith('.heic') ||
                            file.name.toLowerCase().endsWith('.heif')

    if (!isValidImageType) {
      setError('Please select an image file (JPG, PNG, GIF, HEIC, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }

    // For HEIC files, the browser may not be able to display them directly
    // but we'll still create a data URL for upload purposes
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
      handleClose()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    onClose()
  }

  const getRecommendedSize = () => {
    return aspectRatio === 'cover' 
      ? 'Recommended: 1200x300 pixels' 
      : 'Recommended: 400x400 pixels'
  }

  const getPreviewClasses = () => {
    return aspectRatio === 'cover'
      ? 'aspect-[4/1] w-full'
      : 'aspect-square w-48 mx-auto'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload a new image. {getRecommendedSize()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="flex flex-col items-center space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors w-full"
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">
                  Click to select an image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF, HEIC up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative w-full">
                <div className={`${getPreviewClasses()} overflow-hidden rounded-lg border`}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full"
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Choose Different Image
                </Button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
