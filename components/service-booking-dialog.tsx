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
import { createServiceAppointment } from "@/app/actions/calendar-actions"
import { toast } from "sonner"

interface ServiceBookingDialogProps {
  service: {
    id: string
    name: string
    description?: string
    location?: string
    provider: {
      id: string
      name: string
      image?: string
    }
  }
  children: React.ReactNode
}

export function ServiceBookingDialog({ service, children }: ServiceBookingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "60", // minutes
    message: "",
    location: service.location || "",
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

      // Create start and end times
      const startDateTime = new Date(`${formData.date}T${formData.time}`)
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000)

      // Create the appointment
      const result = await createServiceAppointment({
        serviceId: service.id,
        providerId: service.provider.id,
        title: `${service.name} - Consultation`,
        description: formData.message || `Consultation for ${service.name}`,
        startTime: startDateTime,
        endTime: endDateTime,
        location: formData.location,
      })

      if (result.success) {
        toast.success("Appointment scheduled successfully!")
        setOpen(false)
        setFormData({
          date: "",
          time: "",
          duration: "60",
          message: "",
          location: service.location || "",
        })
        router.push("/calendar")
      } else {
        toast.error(result.error || "Failed to schedule appointment")
      }
    } catch (error: any) {
      console.error("Failed to schedule appointment:", error)
      toast.error(error.message || "Failed to schedule appointment")
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Consultation
          </DialogTitle>
          <DialogDescription>
            Book a consultation with {service.provider.name} for {service.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">with {service.provider.name}</p>
              </div>
            </div>
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
                placeholder="Meeting location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific requirements or questions..."
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
