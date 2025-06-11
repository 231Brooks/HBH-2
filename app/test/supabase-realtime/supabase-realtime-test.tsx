"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, XCircle, Send, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"

type TestMessage = {
  id: string
  content: string
  created_at: string
}

export default function SupabaseRealtimeTest() {
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<TestMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Initialize Supabase client
  useEffect(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL and anon key must be defined")
      }

      const client = createClient(supabaseUrl, supabaseAnonKey)
      setSupabase(client)
      setConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  // Load messages and set up subscription
  useEffect(() => {
    if (!supabase) return

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("test_messages")
          .select("*")
          .order("created_at", { ascending: true })

        if (error) throw error
        if (data) setMessages(data)
      } catch (err) {
        console.error("Error loading messages:", err)
      }
    }

    loadMessages()

    // Set up subscription
    const subscription = supabase
      .channel("test_messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "test_messages",
        },
        (payload: { new: TestMessage }) => {
          setMessages((current) => [...current, payload.new])
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Send a test message
  const sendTestMessage = async () => {
    if (!newMessage.trim() || !supabase) return

    setSending(true)

    try {
      const { error } = await supabase.from("test_messages").insert({
        content: newMessage,
      })

      if (error) throw error
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setSending(false)
    }
  }

  // Refresh messages
  const refreshMessages = async () => {
    if (!supabase) return

    setRefreshing(true)

    try {
      const { data, error } = await supabase.from("test_messages").select("*").order("created_at", { ascending: true })

      if (error) throw error
      if (data) setMessages(data)
    } catch (err) {
      console.error("Error refreshing messages:", err)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Initializing Supabase client...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to initialize Supabase client: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Realtime Test</CardTitle>
        <CardDescription>Testing real-time communication with Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="font-medium">Connection Status:</div>
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Disconnected</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Messages:</div>
            <Button variant="outline" size="sm" onClick={refreshMessages} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
          <Card>
            <ScrollArea className="h-[300px] w-full p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">No messages yet. Send a test message below.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">Test Message</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type a test message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendTestMessage()
              }
            }}
            disabled={sending || !connected}
          />
          <Button onClick={sendTestMessage} disabled={sending || !connected || !newMessage.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
