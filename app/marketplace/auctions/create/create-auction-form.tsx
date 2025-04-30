"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createAuctionItem } from "@/app/actions/auction-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function CreateAuctionForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "/diverse-property-showcase.png",
    price: "",
    reservePrice: "",
    endDate: "",
    endTime: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Set minimum end date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const endDate = new Date(`${formData.endDate}T${formData.endTime}`)

      if (endDate < tomorrow) {
        toast({
          title: "Invalid end date",
          description: "Auction end date must be at least 24 hours in the future",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          form.append(key, value)
        }
      })

      const result = await createAuctionItem(form)

      if (result.success) {
        toast({
          title: "Auction created!",
          description: "Your auction has been listed successfully",
        })
        router.push(`/marketplace/auction/${result.itemId}`)
      } else {
        toast({
          title: "Failed to create auction",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]
  // Set default time to 24 hours from now
  const defaultTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toTimeString().slice(0, 5)

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Luxury Beachfront Property"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the property"
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROPERTY">Residential Property</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial Property</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                  <SelectItem value="INVESTMENT">Investment Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL to property image"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave blank to use a placeholder image</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Starting Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reservePrice">Reserve Price ($) (Optional)</Label>
                <Input
                  id="reservePrice"
                  name="reservePrice"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  placeholder="e.g. 300000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={today}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime || defaultTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Auction"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
