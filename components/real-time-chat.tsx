"use client"

import { useState, useEffect, useRef } from "react"
import { usePusher } from "@/lib/pusher-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    image?: string
  }
  timestamp: string
}

interface ChatProps {
  chatId: string
  userId: string
  userName: string
  userImage?: string
  initialMessages?: Message[]
  onSendMessage: (content: string) => Promise<void>
}

export default function RealTimeChat({
  chatId,
  userId,
  userName,
  userImage,
  initialMessages = [],
  onSendMessage,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { client: pusher, isConfigured } = usePusher()
  const { toast } = useToast()

  useEffect(() => {
    if (!isConfigured) {
      toast({
        title: "Real-time features disabled",
        description: "Pusher is not configured. Messages will not update in real-time.",
        variant: "destructive",
      })
    }
  }, [isConfigured, toast])

  useEffect(() => {
    if (!pusher || !isConfigured) return

    // Subscribe to the chat channel
    const channel = pusher.subscribe(`chat-${chatId}`)

    // Listen for new messages
    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    // Listen for typing indicators
    channel.bind("typing", (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId !== userId) {
        setIsTyping(data.isTyping)
        setTypingUser(data.isTyping ? data.userName : null)
      }
    })

    return () => {
      pusher.unsubscribe(`chat-${chatId}`)
    }
  }, [pusher, chatId, userId, isConfigured])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      await onSendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = async () => {
    if (!isConfigured) return

    try {
      await fetch("/api/messages/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          userId,
          userName,
          isTyping: true,
        }),
      })

      // Reset typing indicator after 2 seconds
      setTimeout(async () => {
        await fetch("/api/messages/typing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            userId,
            userName,
            isTyping: false,
          }),
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to send typing indicator:", error)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender.id === userId ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender.id !== userId && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.image || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>
                      {message.sender.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender.id === userId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.sender.id !== userId && <p className="text-xs font-medium mb-1">{message.sender.name}</p>}
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
                {message.sender.id === userId && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-sm text-muted-foreground italic">{typingUser} is typing...</div>}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
