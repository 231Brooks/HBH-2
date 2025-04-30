"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import RealTimeChat from "@/components/real-time-chat"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatClient() {
  const { user } = useAuth()
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock contacts data - in a real app, you'd fetch this from your API
  const contacts = [
    {
      id: "user1",
      name: "Jane Smith",
      avatar: "/javascript-code-abstract.png",
      lastMessage: "Hello! How can I help you with your real estate needs?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      unread: 0,
    },
    {
      id: "user2",
      name: "Michael Brown",
      avatar: "/vibrant-street-market.png",
      lastMessage: "I'm interested in the property on Oak Avenue",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      unread: 2,
    },
    {
      id: "user3",
      name: "Sarah Johnson",
      avatar: "/vibrant-street-market.png",
      lastMessage: "The closing documents are ready for your review",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      unread: 0,
    },
  ]

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Select first contact by default
  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0])
    }
  }, [selectedContact])

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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px]">
        <Card className="md:col-span-1 flex flex-col h-full">
          <CardHeader className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedContact?.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {contact.unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">{contact.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(contact.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">No contacts found</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 h-full">
          {selectedContact ? (
            <RealTimeChat
              channelName={`chat-${user.id}-${selectedContact.id}`}
              currentUser={{
                id: user.id,
                name: user.name || "You",
                avatar: user.image,
              }}
              recipientId={selectedContact.id}
              recipientName={selectedContact.name}
              recipientAvatar={selectedContact.avatar}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4" />
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
