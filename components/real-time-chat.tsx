"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { usePusher } from "@/lib/pusher-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { debounce } from "lodash"

type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
}

interface ChatProps {
  channelName: string
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
  recipientId?: string
  recipientName?: string
  recipientAvatar?: string
}

export default function RealTimeChat({
  channelName,
  currentUser,
  recipientId,
  recipientName,
  recipientAvatar,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string; timestamp: number }>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const pusher = usePusher()

  useEffect(() => {
    if (!pusher) return

    // Subscribe to the chat channel
    const channel = pusher.subscribe(channelName)

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data])

      // Clear typing indicator when message is received from the typing user
      if (typingUsers[data.sender.id]) {
        setTypingUsers((prev) => {
          const updated = { ...prev }
          delete updated[data.sender.id]
          return updated
        })
      }
    })

    channel.bind("typing-indicator", (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId === currentUser.id) return

      if (data.isTyping) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: { name: data.userName, timestamp: Date.now() },
        }))
      } else {
        setTypingUsers((prev) => {
          const updated = { ...prev }
          delete updated[data.userId]
          return updated
        })
      }
    })

    // Fetch initial messages
    fetchMessages()

    // Clean up typing indicators after inactivity
    const typingCleanupInterval = setInterval(() => {
      const now = Date.now()
      setTypingUsers((prev) => {
        const updated = { ...prev }
        Object.entries(updated).forEach(([userId, data]) => {
          if (now - data.timestamp > 5000) {
            delete updated[userId]
          }
        })
        return updated
      })
    }, 1000)

    return () => {
      pusher.unsubscribe(channelName)
      clearInterval(typingCleanupInterval)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [channelName, currentUser.id, pusher])

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingUsers])

  const fetchMessages = async () => {
    try {
      // In a real app, you'd fetch from your API
      // For now, we'll use mock data
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hello! How can I help you with your real estate needs?",
          sender: {
            id: recipientId || "agent1",
            name: recipientName || "Jane Smith",
            avatar: recipientAvatar || "/javascript-code-abstract.png",
          },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ]

      setMessages(mockMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setLoading(true)

    try {
      const message: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: currentUser,
        timestamp: new Date().toISOString(),
      }

      // In a real app, you'd send to your API
      await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName,
          message,
        }),
      })

      // Send typing stopped indicator
      sendTypingIndicator(false)

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendTypingIndicator = async (isTyping: boolean) => {
    try {
      await fetch("/api/messages/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName,
          userId: currentUser.id,
          userName: currentUser.name,
          isTyping,
        }),
      })
    } catch (error) {
      console.error("Error sending typing indicator:", error)
    }
  }

  // Debounced function to send typing indicator
  const debouncedTypingIndicator = useRef(
    debounce((isTyping: boolean) => {
      sendTypingIndicator(isTyping)
    }, 300),
  ).current

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // Send typing indicator if there's text
    if (value.length > 0 && !isTyping) {
      setIsTyping(true)
      debouncedTypingIndicator(true)

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set timeout to clear typing indicator after inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        debouncedTypingIndicator(false)
      }, 3000)
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false)
      debouncedTypingIndicator(false)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getTypingIndicator = () => {
    const typingUsersList = Object.values(typingUsers)
    if (typingUsersList.length === 0) return null

    const names = typingUsersList.map((u) => u.name).join(", ")

    return (
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <div className="flex space-x-1 mr-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
        <span>{typingUsersList.length === 1 ? `${names} is typing...` : `${names} are typing...`}</span>
      </div>
    )
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">{recipientName ? `Chat with ${recipientName}` : "Chat"}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.id === currentUser.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex ${message.sender.id === currentUser.id ? "flex-row-reverse" : "flex-row"} gap-2 max-w-[80%]`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender.avatar || "/placeholder.svg?height=32&width=32&query=user"} />
                <AvatarFallback>
                  {message.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.sender.id === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {getTypingIndicator()}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center gap-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={loading || !newMessage.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
