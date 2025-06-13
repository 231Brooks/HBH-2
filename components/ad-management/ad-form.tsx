"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAd, deleteAdvertisement } from "@/app/actions/advertising-actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { AdPreview } from "./ad-preview"

interface AdFormProps {
  ad?: any // The advertisement data if editing
}

export function AdForm({ ad }: AdFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    id: ad?.id || "",
    name: ad?.name || "",
    description: ad?.description || "",
    slotId: ad?.slotId || "header-main",
    content: ad?.content || "",
    imageUrl: ad?.imageUrl || "",
    linkUrl: ad?.linkUrl || "",
    startDate: ad?.startDate
      ? new Date(ad.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: ad?.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "",
    isActive: ad?.isActive ?? true,
    priority: ad?.priority || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Convert form data to FormData
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, value.toString())
        }
      })

      const result = await createAd({
        title: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        linkUrl: formData.linkUrl,
      })

      if (result.success) {
        toast({
          title: ad ? "Advertisement updated" : "Advertisement created",
          description: "Your changes have been saved successfully.",
        })
        router.push("/admin/ads")
      } else {
        throw new Error(result.error || "Failed to save advertisement")
      }
    } catch (error) {
      console.error("Error saving advertisement:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!ad?.id) return

    if (!confirm("Are you sure you want to delete this advertisement? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteAdvertisement(ad.id)

      if (result.success) {
        toast({
          title: "Advertisement deleted",
          description: "The advertisement has been deleted successfully.",
        })
        router.push("/admin/ads")
      } else {
        throw new Error(result.error || "Failed to delete advertisement")
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Available ad slots
  const adSlots = [
    { id: "header-main", name: "Header (Main)" },
    { id: "sidebar-top", name: "Sidebar (Top)" },
    { id: "sidebar-middle", name: "Sidebar (Middle)" },
    { id: "sidebar-bottom", name: "Sidebar (Bottom)" },
    { id: "in-feed-1", name: "In-Feed (Position 1)" },
    { id: "in-feed-2", name: "In-Feed (Position 2)" },
    { id: "in-feed-3", name: "In-Feed (Position 3)" },
    { id: "footer-main", name: "Footer (Main)" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter a name for this advertisement"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Internal)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add notes or description for this ad (not shown to users)"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slotId">Ad Slot</Label>
                  <Select value={formData.slotId} onValueChange={(value) => handleSelectChange("slotId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {adSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    value={formData.priority}
                    onChange={handleChange}
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground">Higher priority ads are shown first</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">HTML Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter HTML content for the ad"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML to create rich ad content. Use {"{imageUrl}"} and {"{linkUrl}"} as placeholders.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/ads")}>
                Cancel
              </Button>

              <div className="flex gap-2">
                {ad && (
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading || isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Advertisement"
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Ad Preview</h3>
            <AdPreview ad={formData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
