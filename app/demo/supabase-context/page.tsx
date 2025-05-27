"use client"

import { useSupabase } from "@/contexts/supabase-context"
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SupabaseContextDemo() {
  const { supabase, user, loading, error } = useSupabase()
  const [message, setMessage] = useState("")

  // Example of using the subscription hook
  const { data: messages, error: subscriptionError, loading: subscriptionLoading } = useSupabaseSubscription("messages")

  const handleSendMessage = async () => {
    if (!supabase || !message.trim() || !user) return

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: message,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error
      setMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading Supabase client...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Context Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div>
                <p className="mb-2">Signed in as: {user.email}</p>
                <Button
                  onClick={async () => {
                    if (supabase) await supabase.auth.signOut()
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div>
                <p className="mb-2">Not signed in</p>
                <Button
                  onClick={async () => {
                    if (supabase) {
                      await supabase.auth.signInWithOAuth({
                        provider: "github",
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      })
                    }
                  }}
                >
                  Sign In with GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionLoading ? (
              <p>Loading messages...</p>
            ) : subscriptionError ? (
              <p className="text-red-600">Error: {subscriptionError.message}</p>
            ) : (
              <div>
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">No messages yet</p>
                  ) : (
                    messages.map((msg: any) => (
                      <div key={msg.id} className="mb-2 p-2 bg-gray-100 rounded">
                        <p>{msg.content}</p>
                        <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>

                {user && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded"
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
