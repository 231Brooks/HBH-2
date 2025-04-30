"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import ActivityFeed from "@/components/activity-feed"

export default function ActivitiesClient() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please sign in to view your activities</p>
        <Button className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>
      <ActivityFeed />
    </div>
  )
}
