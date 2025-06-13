"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Image as ImageIcon, ExternalLink } from "lucide-react"
import { createAd } from "@/app/actions/advertising-actions"
import { getMyServices } from "@/app/actions/service-actions"
import { ProtectedRoute } from "@/components/protected-route"

interface Service {
  id: string
  name: string
  category: string
  description?: string
}

export default function CreateAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    serviceId: "",
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const result = await getMyServices()
      if (result.success) {
        setServices(result.services || [])
      }
    } catch (error) {
      console.error("Failed to load services:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await createAd({
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        linkUrl: formData.linkUrl || undefined,
        serviceId: formData.serviceId || undefined,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/advertising")
        }, 2000)
      } else {
        setError(result.error || "Failed to create advertisement. Please try again.")
      }
    } catch (err: any) {
      console.error("Ad creation error:", err)
      setError(err.message || "Failed to create advertisement. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Create Advertisement</h1>
            <p className="text-muted-foreground">
              Create an engaging ad to promote your services across the platform.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Advertisement Details
              </CardTitle>
              <CardDescription>
                Provide compelling information about your service or business
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>
                    Advertisement created successfully! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Ad Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Professional Home Inspection Services"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep it concise and attention-grabbing (max 60 characters recommended)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your service, special offers, or key benefits..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional but recommended. Explain what makes your service special.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceId">Link to Service (Optional)</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => handleInputChange("serviceId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service to promote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific service</SelectItem>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Link this ad to one of your services for better tracking
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add an eye-catching image (recommended: 400x300px, max 2MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkUrl">Landing Page URL</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="linkUrl"
                        type="url"
                        value={formData.linkUrl}
                        onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                        placeholder="https://your-website.com/landing-page"
                      />
                    </div>
                    <Button type="button" variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Where should users go when they click your ad?
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || !formData.title}>
                    {loading ? "Creating..." : "Create Advertisement"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {formData.title && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ad Preview</CardTitle>
                <CardDescription>How your ad will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    {formData.imageUrl && (
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={formData.imageUrl} 
                          alt="Ad preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{formData.title}</h4>
                      {formData.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {formData.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">Sponsored</span>
                        {formData.linkUrl && (
                          <span className="text-xs text-primary flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Learn More
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Next Steps:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Create your advertisement (you're here!)</li>
              <li>2. Purchase ad slots for specific locations and times</li>
              <li>3. Your ad will be reviewed and approved</li>
              <li>4. Track performance and optimize your campaigns</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
