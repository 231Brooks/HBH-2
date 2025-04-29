"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  title: string
  description: string
  timestamp: string
  type: string
}

interface ActivityFeedProps {
  activities?: Activity[]
  loading?: boolean
}

export default function ActivityFeed({ activities = [], loading = false }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {activity.type === "message"
                  ? "M"
                  : activity.type === "transaction"
                    ? "T"
                    : activity.type === "property"
                      ? "P"
                      : "A"}
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
