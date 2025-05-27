"use client"

import { useEffect, useState } from "react"
import { getPusherClient } from "@/lib/pusher-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import {
  Home,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck,
  DollarSign,
  Star,
} from "lucide-react"

type ActivityType =
  | "transaction_created"
  | "document_uploaded"
  | "message_sent"
  | "property_listed"
  | "property_sold"
  | "appointment_scheduled"
  | "milestone_completed"
  | "user_joined"
  | "review_posted"

interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  user: {
    id: string
    name: string
    image?: string
  }
  entityId?: string
  entityType?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  initialActivities?: Activity[]
  userId?: string
  entityId?: string
  entityType?: string
  limit?: number
}

export default function ActivityFeed({
  initialActivities = [],
  userId,
  entityId,
  entityType,
  limit = 10,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // In a real app, you'd fetch from your API with proper filters
        const queryParams = new URLSearchParams()
        if (userId) queryParams.append("userId", userId)
        if (entityId) queryParams.append("entityId", entityId)
        if (entityType) queryParams.append("entityType", entityType)
        if (limit) queryParams.append("limit", limit.toString())

        const response = await fetch(`/api/activities?${queryParams.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch activities")

        const data = await response.json()
        setActivities(data.activities || [])
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Set up Pusher for real-time updates
    const pusher = getPusherClient()
    if (!pusher) return

    // Determine which channel to subscribe to based on props
    let channelName = "global-activities"
    if (entityId && entityType) {
      channelName = `${entityType}-${entityId}-activities`
    } else if (userId) {
      channelName = `user-${userId}-activities`
    }

    const channel = pusher.subscribe(channelName)

    channel.bind("new-activity", (data: Activity) => {
      setActivities((prev) => [data, ...prev].slice(0, limit))
    })

    return () => {
      pusher.unsubscribe(channelName)
    }
  }, [userId, entityId, entityType, limit, initialActivities])

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "transaction_created":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "document_uploaded":
        return <FileCheck className="h-5 w-5 text-green-500" />
      case "message_sent":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "property_listed":
        return <Home className="h-5 w-5 text-amber-500" />
      case "property_sold":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "appointment_scheduled":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "milestone_completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "user_joined":
        return <User className="h-5 w-5 text-indigo-500" />
      case "review_posted":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case "transaction_created":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Transaction
          </Badge>
        )
      case "document_uploaded":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Document
          </Badge>
        )
      case "message_sent":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Message
          </Badge>
        )
      case "property_listed":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Property
          </Badge>
        )
      case "property_sold":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Sale
          </Badge>
        )
      case "appointment_scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Appointment
          </Badge>
        )
      case "milestone_completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Milestone
          </Badge>
        )
      case "user_joined":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            User
          </Badge>
        )
      case "review_posted":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Review
          </Badge>
        )
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  if (loading && activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No activities to display</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user.image || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm mb-1">{activity.title}</p>
                {activity.description && <p className="text-xs text-muted-foreground">{activity.description}</p>}
              </div>
              <div className="flex-shrink-0 self-start mt-1">{getActivityIcon(activity.type)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
