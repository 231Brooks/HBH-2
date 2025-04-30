"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Activity {
  id: string
  type: string
  title: string
  description?: string
  userId?: string
  entityType?: string
  entityId?: string
  createdAt: string
}

interface ActivityFeedProps {
  userId?: string
  entityType?: string
  entityId?: string
  limit?: number
}

export default function ActivityFeed({ userId, entityType, entityId, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Build query params
        const params = new URLSearchParams()
        if (userId) params.append("userId", userId)
        if (entityType) params.append("entityType", entityType)
        if (entityId) params.append("entityId", entityId)
        if (limit) params.append("limit", limit.toString())

        const response = await fetch(`/api/activities?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch activities")
        }

        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Error fetching activities:", error)
        // Set empty array on error
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, entityType, entityId, limit])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">No activities found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{activity.title}</h3>
                {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-1">{activity.type.replace(/_/g, " ")}</span>
              {activity.entityType && (
                <span className="ml-2">
                  {activity.entityType}: {activity.entityId}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
