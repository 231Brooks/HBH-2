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
import { Calendar, Clock, MapPin, User, MessageSquare } from "lucide-react"
import { createAppointment } from "@/app/actions/calendar-actions"
import { toast } from "sonner"

interface MessageAppointmentDialogProps {
  otherUser: {
    id: string
    name: string
    image?: string
  }
  children: React.ReactNode
}

export function MessageAppointmentDialog({ otherUser, children }: MessageAppointmentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60", // minutes
    location: "",
    description: "",
    type: "MEETING",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.date || !formData.time) {
        toast.error("Please fill in all required fields")
        return
      }

      // Create start and end times
      const startDateTime = new Date(`${formData.date}T${formData.time}`)
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000)

      // Create form data for the appointment
      const appointmentFormData = new FormData()
      appointmentFormData.append("title", formData.title)
      appointmentFormData.append("description", formData.description)
      appointmentFormData.append("startTime", startDateTime.toISOString())
      appointmentFormData.append("endTime", endDateTime.toISOString())
      appointmentFormData.append("location", formData.location)
      appointmentFormData.append("type", formData.type)

      const result = await createAppointment(appointmentFormData)

      if (result.success) {
        toast.success("Meeting scheduled successfully!")
        setOpen(false)
        setFormData({
          title: "",
          date: "",
          time: "",
          duration: "60",
          location: "",
          description: "",
          type: "MEETING",
        })
        router.push("/calendar")
      } else {
        toast.error(result.error || "Failed to schedule meeting")
      }
    } catch (error: any) {
      console.error("Failed to schedule meeting:", error)
      toast.error(error.message || "Failed to schedule meeting")
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  const meetingTypes = [
    { value: "MEETING", label: "General Meeting" },
    { value: "CALL", label: "Phone Call" },
    { value: "PROPERTY_VIEWING", label: "Property Viewing" },
    { value: "CONSULTATION", label: "Consultation" },
    { value: "OTHER", label: "Other" },
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
            Schedule Meeting
          </DialogTitle>
          <DialogDescription>
            Schedule a meeting with {otherUser.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Meeting with {otherUser.name}</p>
                <p className="text-sm text-muted-foreground">Schedule a time to meet</p>
              </div>
            </div>
          </div>

          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Property Discussion"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Meeting Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              {meetingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="location"
                placeholder="Meeting location or 'Virtual'"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Meeting agenda or notes..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
