"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Home, User } from "lucide-react"
import { createPropertyViewingAppointment } from "@/app/actions/calendar-actions"
import { toast } from "sonner"

interface PropertyViewingDialogProps {
  property: {
    id: string
    title: string
    address: string
    city: string
    state: string
    ownerId?: string
    ownerName?: string
  }
  children: React.ReactNode
}

export function PropertyViewingDialog({ property, children }: PropertyViewingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "60", // minutes
    message: "",
    viewingType: "tour", // tour, inspection, walkthrough
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.date || !formData.time) {
        toast.error("Please select a date and time")
        return
      }

      if (!property.ownerId) {
        toast.error("Property owner information not available")
        return
      }

      // Create start and end times
      const startDateTime = new Date(`${formData.date}T${formData.time}`)
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000)

      // Create the appointment
      const result = await createPropertyViewingAppointment({
        propertyId: property.id,
        ownerId: property.ownerId,
        title: `Property ${formData.viewingType === "tour" ? "Tour" : formData.viewingType === "inspection" ? "Inspection" : "Viewing"} - ${property.title}`,
        description: formData.message || `${formData.viewingType === "tour" ? "Property tour" : formData.viewingType === "inspection" ? "Property inspection" : "Property viewing"} at ${property.address}`,
        startTime: startDateTime,
        endTime: endDateTime,
        location: `${property.address}, ${property.city}, ${property.state}`,
      })

      if (result.success) {
        toast.success("Property viewing scheduled successfully!")
        setOpen(false)
        setFormData({
          date: "",
          time: "",
          duration: "60",
          message: "",
          viewingType: "tour",
        })
        router.push("/calendar")
      } else {
        toast.error(result.error || "Failed to schedule viewing")
      }
    } catch (error: any) {
      console.error("Failed to schedule viewing:", error)
      toast.error(error.message || "Failed to schedule viewing")
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  const viewingTypes = [
    { value: "tour", label: "Property Tour", description: "General walkthrough of the property" },
    { value: "inspection", label: "Inspection", description: "Detailed property inspection" },
    { value: "walkthrough", label: "Walkthrough", description: "Quick property walkthrough" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Property Viewing
          </DialogTitle>
          <DialogDescription>
            Schedule a viewing for {property.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{property.title}</p>
                <p className="text-sm text-muted-foreground">{property.address}</p>
                {property.ownerName && (
                  <p className="text-xs text-muted-foreground">Owner: {property.ownerName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Viewing Type */}
          <div className="space-y-2">
            <Label htmlFor="viewingType">Viewing Type</Label>
            <select
              id="viewingType"
              value={formData.viewingType}
              onChange={(e) => handleInputChange("viewingType", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              {viewingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {viewingTypes.find(t => t.value === formData.viewingType)?.description}
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific areas of interest or questions..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
