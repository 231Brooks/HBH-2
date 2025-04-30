"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import RealTimeChat from "@/components/real-time-chat"

// Create a singleton Supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function RealtimeChatDemo() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("setup")
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Demo users
  const user1 = {
    id: "user-1",
    name: "Alice Smith",
    avatar: "/letter-a-abstract.png",
  }

  const user2 = {
    id: "user-2",
    name: "Bob Johnson",
    avatar: "/letter-b-abstract.png",
  }

  // Setup realtime tables
  const setupRealtimeTables = async () => {
    setSetupStatus("loading")
    setError(null)

    try {
      const response = await fetch("/api/setup-realtime-tables", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set up realtime tables")
      }

      setSetupStatus("success")
      setActiveTab("create")
    } catch (err: any) {
      console.error("Setup error:", err)
      setSetupStatus("error")
      setError(err.message || "An error occurred during setup")
    }
  }

  // Create a new conversation
  const createConversation = async () => {
    try {
      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from("conversations")
        .insert({})
        .select()

      if (conversationError) throw conversationError

      const newConversationId = conversationData[0].id

      // Add participants
      const { error: participantsError } = await supabase.from("conversation_participants").insert([
        {
          conversation_id: newConversationId,
          user_id: user1.id,
        },
        {
          conversation_id: newConversationId,
          user_id: user2.id,
        },
      ])

      if (participantsError) throw participantsError

      setConversationId(newConversationId)
      setActiveTab("chat")
    } catch (err: any) {
      console.error("Error creating conversation:", err)
      setError(err.message || "Failed to create conversation")
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Real-time Chat Demo</h1>
      <p className="text-muted-foreground mb-8">
        This demo showcases real-time chat functionality using Supabase's realtime capabilities and Redis for caching.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="setup">1. Setup Tables</TabsTrigger>
          <TabsTrigger value="create" disabled={setupStatus !== "success"}>
            2. Create Conversation
          </TabsTrigger>
          <TabsTrigger value="chat" disabled={!conversationId}>
            3. Chat Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup Realtime Tables</CardTitle>
              <CardDescription>
                First, we need to set up the necessary tables in Supabase for our real-time chat functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="prose max-w-none">
                <p>This setup will create the following tables:</p>
                <ul>
                  <li>
                    <code>messages</code> - Stores all chat messages
                  </li>
                  <li>
                    <code>conversations</code> - Stores conversation metadata
                  </li>
                  <li>
                    <code>conversation_participants</code> - Maps users to conversations
                  </li>
                </ul>
                <p>It will also configure Row Level Security policies and enable realtime subscriptions.</p>
              </div>

              <Button onClick={setupRealtimeTables} disabled={setupStatus === "loading" || setupStatus === "success"}>
                {setupStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up...
                  </>
                ) : setupStatus === "success" ? (
                  "Setup Complete"
                ) : (
                  "Setup Tables"
                )}
              </Button>

              {setupStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Tables have been created successfully. Click "Next" or proceed to the "Create Conversation" tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a Conversation</CardTitle>
              <CardDescription>Create a new conversation between our two demo users, Alice and Bob.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">User 1</div>
                  <div className="flex items-center gap-2">
                    <img src={user1.avatar || "/placeholder.svg"} alt={user1.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <div>{user1.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {user1.id}</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="font-medium mb-2">User 2</div>
                  <div className="flex items-center gap-2">
                    <img src={user2.avatar || "/placeholder.svg"} alt={user2.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <div>{user2.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {user2.id}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={createConversation} disabled={!!conversationId}>
                {conversationId ? "Conversation Created" : "Create Conversation"}
              </Button>

              {conversationId && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Conversation created successfully with ID: {conversationId}. Click "Next" or proceed to the "Chat
                    Demo" tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Alice's View</h2>
              {conversationId && (
                <RealTimeChat
                  conversationId={conversationId}
                  currentUserId={user1.id}
                  currentUserName={user1.name}
                  currentUserAvatar={user1.avatar}
                  otherUserName={user2.name}
                  otherUserAvatar={user2.avatar}
                />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Bob's View</h2>
              {conversationId && (
                <RealTimeChat
                  conversationId={conversationId}
                  currentUserId={user2.id}
                  currentUserName={user2.name}
                  currentUserAvatar={user2.avatar}
                  otherUserName={user1.name}
                  otherUserAvatar={user1.avatar}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
