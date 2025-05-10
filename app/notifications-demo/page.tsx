"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotifications } from "@/hooks/use-notifications"

export default function NotificationsDemo() {
  const { sendNotification, isLoading } = useNotifications()
  const [title, setTitle] = useState("New Notification")
  const [description, setDescription] = useState("This is a test notification")
  const [type, setType] = useState<"default" | "success" | "error" | "warning" | "info">("default")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendNotification({
        title,
        description,
        type,
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications Demo</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send a Test Notification</CardTitle>
          <CardDescription>Fill out the form below to send a real-time notification</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="success" id="success" />
                  <Label htmlFor="success">Success</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="error" id="error" />
                  <Label htmlFor="error">Error</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="warning" id="warning" />
                  <Label htmlFor="warning">Warning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="info" id="info" />
                  <Label htmlFor="info">Info</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Notification"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
