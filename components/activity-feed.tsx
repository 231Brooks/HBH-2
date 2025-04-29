"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  userId: string
}

interface ActivityFeedProps {
  userId?: string
  limit?: number
}

export default function ActivityFeed({ userId, limit = 5 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use mock data
        const mockActivities: Activity[] = [
          {
            id: "1",
            type: "transaction",
            title: "New Transaction Created",
            description: "You created a new transaction for property at 123 Main St.",
            timestamp: new Date().toISOString(),
            userId: "1",
          },
          {
            id: "2",
            type: "property",
            title: "Property Listed",
            description: "You listed a new property at 456 Oak Ave.",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            userId: "1",
          },
          {
            id: "3",
            type: "message",
            title: "New Message",
            description: "You received a new message from John Doe.",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            userId: "1",
          },
        ]

        setActivities(mockActivities.slice(0, limit))
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, limit])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading activities...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border-b pb-3 last:border-0">
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
