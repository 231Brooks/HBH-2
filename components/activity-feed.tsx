"use client"

import { useEffect, useState } from "react"

interface Activity {
  id: string
  type: string
  title: string
  description?: string
  user?: {
    id: string
    name: string
    image?: string
  }
  timestamp: string
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities")
        const data = await response.json()
        setActivities(data.activities || [])
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <div className="p-4">Loading activities...</div>
  }

  if (activities.length === 0) {
    return <div className="p-4">No recent activities</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Activities</h2>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="p-3 border rounded-lg">
            <div className="font-medium">{activity.title}</div>
            {activity.description && <p className="text-sm text-gray-600">{activity.description}</p>}
            <div className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
