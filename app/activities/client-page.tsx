"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import ActivityFeed from "@/components/activity-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function ActivitiesClientPage() {
  const { user } = useAuth()
  const [activityType, setActivityType] = useState<string>("transaction_created")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [entityType, setEntityType] = useState<string>("property")
  const [entityId, setEntityId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: activityType,
          title,
          description,
          entityType: entityId ? entityType : undefined,
          entityId: entityId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create activity")
      }

      toast({
        title: "Success",
        description: "Activity created successfully",
      })

      setTitle("")
      setDescription("")
      setEntityId("")
    } catch (error) {
      console.error("Error creating activity:", error)
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="mine">My Activities</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ActivityFeed limit={20} />
            </TabsContent>

            <TabsContent value="mine">
              <ActivityFeed userId={user?.id} limit={20} />
            </TabsContent>

            <TabsContent value="properties">
              <ActivityFeed entityType="property" limit={20} />
            </TabsContent>

            <TabsContent value="transactions">
              <ActivityFeed entityType="transaction" limit={20} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Activity</CardTitle>
              <CardDescription>Add a new activity to the feed</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity Type</label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction_created">Transaction Created</SelectItem>
                      <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                      <SelectItem value="message_sent">Message Sent</SelectItem>
                      <SelectItem value="property_listed">Property Listed</SelectItem>
                      <SelectItem value="property_sold">Property Sold</SelectItem>
                      <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                      <SelectItem value="milestone_completed">Milestone Completed</SelectItem>
                      <SelectItem value="user_joined">User Joined</SelectItem>
                      <SelectItem value="review_posted">Review Posted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Activity title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Activity description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity Type (Optional)</label>
                  <Select value={entityType} onValueChange={setEntityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity ID (Optional)</label>
                  <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="Entity ID" />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Activity"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
