"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Send, Paperclip, MoreVertical } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function MessagesClient() {
  const { user } = useAuth()
  const [activeConversation, setActiveConversation] = useState<number | null>(1)
  const [messageText, setMessageText] = useState("")

  // Sample data for conversations
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Title Agent",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Can you send those closing documents?",
      time: "12:45 PM",
      unread: true,
    },
    {
      id: 2,
      name: "Michael Brown",
      role: "Home Inspector",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Inspection report is ready for review",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "Jennifer Lee",
      role: "Real Estate Attorney",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "I've reviewed the contract and have some notes",
      time: "Monday",
      unread: false,
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Renovation Contractor",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Are we still meeting at the property tomorrow?",
      time: "Sunday",
      unread: false,
    },
  ]

  const activeMessages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi there! Do you have the closing documents ready?",
      time: "12:30 PM",
      isMine: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "I'm still working on them. Should be ready by end of day.",
      time: "12:35 PM",
      isMine: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content:
        "Great! Can you send those closing documents as soon as they're ready? We need to review them before the meeting tomorrow.",
      time: "12:45 PM",
      isMine: false,
    },
    {
      id: 4,
      sender: "Me",
      content: "Will do. I'll also include the updated property disclosures.",
      time: "12:47 PM",
      isMine: true,
    },
  ]

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would send the message to an API
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please sign in to access messages</p>
        <Button className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] gap-6">
        {/* Conversations sidebar */}
        <div className="md:w-1/3 lg:w-1/4">
          <Card className="h-full">
            <CardHeader className="px-4 py-3">
              <div className="flex justify-between items-center">
                <CardTitle>Messages</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <Tabs defaultValue="all">
              <div className="px-4">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                  </TabsTrigger>
                  <TabsTrigger value="important" className="flex-1">
                    Important
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  <div className="space-y-1 p-2">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full flex items-start gap-3 p-3 rounded-md text-left ${
                          activeConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted/50"
                        } ${conversation.unread ? "font-medium" : ""}`}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <Avatar>
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="truncate">{conversation.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">{conversation.time}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{conversation.role}</div>
                          <p className="text-sm truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="unread" className="m-0">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  <div className="space-y-1 p-2">
                    {conversations
                      .filter((c) => c.unread)
                      .map((conversation) => (
                        <button
                          key={conversation.id}
                          className={`w-full flex items-start gap-3 p-3 rounded-md text-left font-medium ${
                            activeConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setActiveConversation(conversation.id)}
                        >
                          <Avatar>
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="truncate">{conversation.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0">{conversation.time}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">{conversation.role}</div>
                            <p className="text-sm truncate">{conversation.lastMessage}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        </button>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="important" className="m-0">
                <div className="h-[calc(100vh-14rem)] flex items-center justify-center text-muted-foreground">
                  No important messages
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Chat area */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            {activeConversation ? (
              <>
                <CardHeader className="px-6 py-4 border-b flex-row justify-between items-center space-y-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=50&width=50" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{conversations.find((c) => c.id === activeConversation)?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {conversations.find((c) => c.id === activeConversation)?.role}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.isMine ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <CardContent className="p-4 border-t mt-auto">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button className="shrink-0" onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
