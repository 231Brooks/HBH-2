"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePusher } from "@/components/pusher-provider"
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  id: string
  text: string
  sender: string
  timestamp: string
}

export default function PusherTest() {
  const { pusher, loading, error } = usePusher()
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [testChannel, setTestChannel] = useState<any>(null)
  const [connectionState, setConnectionState] = useState<string>("")

  // Set up Pusher connection
  useEffect(() => {
    if (!pusher) return

    // Monitor connection state
    setConnectionState(pusher.connection.state)

    const updateConnectionState = () => {
      setConnectionState(pusher.connection.state)
      setConnected(pusher.connection.state === "connected")
    }

    pusher.connection.bind("state_change", updateConnectionState)

    // Create test channel
    const channel = pusher.subscribe("test-channel")
    setTestChannel(channel)

    // Listen for messages
    channel.bind("test-event", (data: any) => {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: data.sender,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMsg])
    })

    return () => {
      pusher.connection.unbind("state_change", updateConnectionState)
      pusher.unsubscribe("test-channel")
    }
  }, [pusher])

  // Send a test message
  const sendTestMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)

    try {
      // Send message via API endpoint
      const response = await fetch("/api/test/pusher-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "test-channel",
          event: "test-event",
          data: {
            message: newMessage,
            sender: "Test User",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading Pusher configuration...</p>
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
        <AlertDescription>Failed to load Pusher configuration: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pusher Test</CardTitle>
        <CardDescription>Testing real-time communication with the new Pusher implementation</CardDescription>
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
                <span className="text-red-500">{connectionState || "Disconnected"}</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Messages:</div>
          <Card>
            <ScrollArea className="h-[300px] w-full p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">No messages yet. Send a test message below.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1">{msg.text}</p>
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
