"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Send,
  Paperclip,
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  Users,
  Phone,
  Video
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useSupabase } from "@/contexts/supabase-context"
import { getUserConversations, getConversationMessages, sendMessage } from "@/app/actions/message-actions"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  participants: {
    id: string
    name: string
    image?: string
    email?: string
  }[]
  unreadCount: number
  updatedAt: string
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  read: boolean
  sender: {
    id: string
    name: string
    image?: string
  }
  receiver: {
    id: string
    name: string
    image?: string
  }
}

function MessagesPageContent() {
  const { user } = useSupabase()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
    }
  }, [activeConversation])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const result = await getUserConversations()

      // Transform the data to match our interface
      const transformedConversations: Conversation[] = result.conversations.map((conv: any) => ({
        id: conv.id,
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          createdAt: conv.lastMessage.createdAt,
          senderId: conv.lastMessage.senderId
        } : undefined,
        participants: conv.participants || [],
        unreadCount: conv.unreadCount || 0,
        updatedAt: conv.updatedAt
      }))

      setConversations(transformedConversations)

      // Auto-select first conversation if available
      if (transformedConversations.length > 0 && !activeConversation) {
        setActiveConversation(transformedConversations[0].id)
      }
    } catch (error) {
      console.error("Failed to load conversations:", error)
      toast.error("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const result = await getConversationMessages(conversationId)
      setMessages(result.messages || [])
    } catch (error) {
      console.error("Failed to load messages:", error)
      toast.error("Failed to load messages")
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation || !user) return

    // Find the other participant in the conversation
    const conversation = conversations.find(c => c.id === activeConversation)
    const otherParticipant = conversation?.participants.find(p => p.id !== user.id)

    if (!otherParticipant) {
      toast.error("Cannot find recipient")
      return
    }

    setSendingMessage(true)

    try {
      await sendMessage(otherParticipant.id, messageText.trim())
      setMessageText("")

      // Reload messages to show the new message
      await loadMessages(activeConversation)

      // Reload conversations to update last message
      await loadConversations()

      toast.success("Message sent!")
    } catch (error: any) {
      console.error("Failed to send message:", error)
      toast.error(error.message || "Failed to send message")
    } finally {
      setSendingMessage(false)
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== user?.id)
  }

  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown time"
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation)
    const matchesSearch = !searchTerm ||
      otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" ||
      (activeTab === "unread" && conversation.unreadCount > 0)

    return matchesSearch && matchesTab
  })

  // Use real conversations or fallback to empty array
  const displayConversations = filteredConversations.length > 0 ? filteredConversations : []

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] gap-6">
        {/* Conversations sidebar */}
        <div className="md:w-1/3 lg:w-1/4">
          <Card className="h-full">
            <CardHeader className="px-4 py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                  {conversations.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {conversations.length}
                    </Badge>
                  )}
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="New Message">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">
                    All
                    {conversations.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {conversations.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                    {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        {conversations.filter(c => c.unreadCount > 0).length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading conversations...</span>
                    </div>
                  ) : displayConversations.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {displayConversations.map((conversation) => {
                        const otherParticipant = getOtherParticipant(conversation)
                        return (
                          <button
                            key={conversation.id}
                            className={`w-full flex items-start gap-3 p-3 rounded-md text-left transition-colors ${
                              activeConversation === conversation.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                            } ${conversation.unreadCount > 0 ? "font-medium" : ""}`}
                            onClick={() => setActiveConversation(conversation.id)}
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={otherParticipant?.image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground font-medium">
                                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="truncate font-medium">
                                  {otherParticipant?.name || "Unknown User"}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {conversation.lastMessage ? formatMessageTime(conversation.lastMessage.createdAt) : ""}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage?.content || "No messages yet"}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">No conversations yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start a conversation by contacting someone from the marketplace or services.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="unread" className="m-0">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading conversations...</span>
                    </div>
                  ) : displayConversations.filter(c => c.unreadCount > 0).length > 0 ? (
                    <div className="space-y-1 p-2">
                      {displayConversations
                        .filter(c => c.unreadCount > 0)
                        .map((conversation) => {
                          const otherParticipant = getOtherParticipant(conversation)
                          return (
                            <button
                              key={conversation.id}
                              className={`w-full flex items-start gap-3 p-3 rounded-md text-left font-medium transition-colors ${
                                activeConversation === conversation.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                              }`}
                              onClick={() => setActiveConversation(conversation.id)}
                            >
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={otherParticipant?.image || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground font-medium">
                                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="truncate font-medium">
                                    {otherParticipant?.name || "Unknown User"}
                                  </span>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {conversation.lastMessage ? formatMessageTime(conversation.lastMessage.createdAt) : ""}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage?.content || "No messages yet"}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">All caught up!</h3>
                      <p className="text-sm text-muted-foreground">
                        No unread messages at the moment.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Chat area */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            {activeConversation ? (
              <>
                {(() => {
                  const conversation = conversations.find(c => c.id === activeConversation)
                  const otherParticipant = conversation ? getOtherParticipant(conversation) : null

                  return (
                    <CardHeader className="px-6 py-4 border-b flex-row justify-between items-center space-y-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant?.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{otherParticipant?.name || "Unknown User"}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                            Online
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="Voice Call">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Video Call">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="More Options">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  )
                })()}

                <ScrollArea className="flex-1 p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isMyMessage = message.senderId === user?.id
                        return (
                          <div key={message.id} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                            <div className={`flex items-end gap-2 max-w-[80%] ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                              {!isMyMessage && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={message.sender.image || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {message.sender.name?.charAt(0)?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`rounded-lg p-3 ${
                                  isMyMessage
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <div className={`flex items-center gap-1 mt-1 ${
                                  isMyMessage ? "justify-end" : "justify-start"
                                }`}>
                                  <p className={`text-xs ${
                                    isMyMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}>
                                    {formatMessageTime(message.createdAt)}
                                  </p>
                                  {isMyMessage && (
                                    <div className="ml-1">
                                      {message.read ? (
                                        <CheckCircle2 className="h-3 w-3 text-primary-foreground/70" />
                                      ) : (
                                        <Circle className="h-3 w-3 text-primary-foreground/70" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">No messages yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Start the conversation by sending a message below.
                      </p>
                    </div>
                  )}
                </ScrollArea>

                <CardContent className="p-4 border-t mt-auto">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon" className="shrink-0" title="Attach File">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={sendingMessage}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      className="shrink-0"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                  {sendingMessage && (
                    <div className="mt-2">
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>Sending your message...</AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-md">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Welcome to Messages
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Select a conversation from the sidebar to start messaging, or contact someone from the marketplace to begin a new conversation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" asChild>
                      <a href="/marketplace">Browse Properties</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/services">Find Services</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesPageContent />
    </ProtectedRoute>
  )
}
