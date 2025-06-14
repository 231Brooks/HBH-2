"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, XCircle } from "lucide-react"

export default function TestHEICPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setResult(null)

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
      setResult({
        success: true,
        message: 'HEIC file uploaded successfully!',
        url: data.url
      })
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      })
    } finally {
      setUploading(false)
    }
  }

  const getFileInfo = () => {
    if (!selectedFile) return null

    const isHEIC = selectedFile.name.toLowerCase().endsWith('.heic') || 
                   selectedFile.name.toLowerCase().endsWith('.heif')
    
    return {
      name: selectedFile.name,
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      type: selectedFile.type || 'Unknown',
      isHEIC
    }
  }

  const fileInfo = getFileInfo()

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>HEIC Upload Test (Paper Money Branch)</CardTitle>
          <CardDescription>
            Test uploading HEIC files from iPhone. This page helps verify that HEIC files can be uploaded successfully in the paper money testing environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div>
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* File Information */}
          {fileInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Selected File:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {fileInfo.name}</p>
                <p><strong>Size:</strong> {fileInfo.size}</p>
                <p><strong>Type:</strong> {fileInfo.type}</p>
                <p><strong>Is HEIC:</strong> {fileInfo.isHEIC ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && (
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          )}

          {/* Result */}
          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                </AlertDescription>
              </div>
              {result.success && result.url && (
                <div className="mt-2">
                  <p className="text-sm text-green-700">
                    <strong>Uploaded URL:</strong> 
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                      {result.url}
                    </a>
                  </p>
                </div>
              )}
            </Alert>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Testing Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Take a photo with your iPhone (this will be in HEIC format by default)</li>
              <li>Use the file input above to select the HEIC photo</li>
              <li>Check that the file info shows "Is HEIC: ✅ Yes"</li>
              <li>Click "Upload File" to test the upload</li>
              <li>Verify that the upload succeeds and you get a Cloudinary URL</li>
            </ol>
          </div>

          {/* Paper Money Notice */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-2">🏦 Paper Money Environment</h3>
            <p className="text-sm text-yellow-800">
              You are currently testing in the paper money environment. All uploads and transactions are for testing purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
