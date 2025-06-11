"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CloudinaryUpload from "@/components/cloudinary-upload"
import Image from "next/image"

export default function ExampleUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // In a real app, you would submit this data to your API
      console.log("Form data to submit:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitResult({
        success: true,
        message: "Form submitted successfully!",
      })
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Failed to submit form. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Upload Example</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Listing</CardTitle>
          <CardDescription>Upload an image and submit the form</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <CloudinaryUpload onUpload={handleImageUpload} />
            </div>

            {formData.imageUrl && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 relative h-48 w-full border rounded-md overflow-hidden">
                  <Image
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {submitResult && (
              <div
                className={`p-3 rounded-md ${
                  submitResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {submitResult.message}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting || !formData.imageUrl}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
