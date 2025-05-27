"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"
import type { Appointment } from "@/types"

interface CalendarEventCardProps {
  event: Appointment
  onClick?: (event: Appointment) => void
}

export default function CalendarEventCard({ event, onClick }: CalendarEventCardProps) {
  const getEventTypeColor = () => {
    switch (event.type) {
      case "CLOSING":
        return "bg-blue-100 text-blue-800"
      case "INSPECTION":
        return "bg-amber-100 text-amber-800"
      case "PHOTOGRAPHY":
        return "bg-purple-100 text-purple-800"
      case "LEGAL":
        return "bg-green-100 text-green-800"
      case "RENOVATION":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  const handleClick = () => {
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{event.title}</h3>
          <Badge className={getEventTypeColor()}>
            {event.type.charAt(0) + event.type.slice(1).toLowerCase().replace("_", " ")}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span>
            {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
        {event.description && <p className="text-sm text-muted-foreground mt-2">{event.description}</p>}
      </CardContent>
    </Card>
  )
}
