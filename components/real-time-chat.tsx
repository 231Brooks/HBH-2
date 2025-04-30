"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import { getCachedData, cacheData } from "@/lib/redis"

type Message = {
  id: string
  content: string
  user_id: string
  user_name: string
  user_avatar?: string
  created_at: string
  conversation_id: string
}

type RealTimeChatProps = {
  conversationId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  otherUserName: string
  otherUserAvatar?: string
}

export default function RealTimeChat({
  conversationId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  otherUserName,
  otherUserAvatar,
}: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get Supabase client (client-side only)
  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anon key must be defined")
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Load initial messages and set up realtime subscription
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)

      try {
        // Try to get messages from cache first
        const cachedMessages = await getCachedData<Message[]>(`chat:${conversationId}`)

        if (cachedMessages) {
          setMessages(cachedMessages)
          setLoading(false)
        }

        // Fetch messages from Supabase
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("Error fetching messages:", error)
          return
        }

        if (data) {
          setMessages(data)
          // Cache the messages for 5 minutes
          await cacheData(`chat:${conversationId}`, data, 300)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const supabase = getSupabaseClient()
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((current) => [...current, newMessage])
        },
      )
      .on("presence", { event: "sync" }, () => {
        // Handle presence sync
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.user_id !== currentUserId) {
          setIsTyping(true)

          // Clear previous timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }

          // Set new timeout
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false)
          }, 2000)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [conversationId, currentUserId])

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)

    try {
      const newMsg = {
        content: newMessage,
        user_id: currentUserId,
        user_name: currentUserName,
        user_avatar: currentUserAvatar,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
      }

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("messages").insert(newMsg)

      if (error) {
        console.error("Error sending message:", error)
        return
      }

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    const supabase = getSupabaseClient()
    supabase.channel(`messages:${conversationId}`).send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: currentUserId },
    })
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUserAvatar || "/placeholder.svg"} />
            <AvatarFallback>{otherUserName[0]}</AvatarFallback>
          </Avatar>
          <span>{otherUserName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {message.user_id !== currentUserId && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.user_avatar || otherUserAvatar} />
                        <AvatarFallback>{message.user_name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.user_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.user_id === currentUserId ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.user_id === currentUserId && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUserAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{currentUserName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherUserAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{otherUserName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            onKeyUp={handleTyping}
            disabled={sending}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
