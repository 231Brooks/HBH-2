"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { sendMessage } from "@/app/actions/message-actions"
import { toast } from "sonner"

interface ContactDialogProps {
  // Contact information
  contactId: string
  contactName: string
  contactAvatar?: string
  contactType?: "user" | "professional" | "seller" | "agent"
  
  // Context information (optional)
  contextType?: "property" | "service" | "general"
  contextId?: string
  contextTitle?: string
  
  // Trigger element
  children: React.ReactNode
  
  // Pre-filled message
  initialMessage?: string
  
  // Additional props
  className?: string
}

export function ContactDialog({
  contactId,
  contactName,
  contactAvatar,
  contactType = "user",
  contextType,
  contextId,
  contextTitle,
  children,
  initialMessage = "",
  className
}: ContactDialogProps) {
  const { user } = useSupabase()
  const router = useRouter()
  
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(initialMessage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Don't allow users to contact themselves
  if (user?.id === contactId) {
    return null
  }

  const getContactTypeInfo = () => {
    switch (contactType) {
      case "professional":
        return {
          icon: <Building2 className="h-4 w-4" />,
          label: "Service Professional",
          color: "bg-blue-500"
        }
      case "seller":
        return {
          icon: <User className="h-4 w-4" />,
          label: "Property Seller",
          color: "bg-green-500"
        }
      case "agent":
        return {
          icon: <Building2 className="h-4 w-4" />,
          label: "Real Estate Agent",
          color: "bg-purple-500"
        }
      default:
        return {
          icon: <User className="h-4 w-4" />,
          label: "User",
          color: "bg-gray-500"
        }
    }
  }

  const getContextMessage = () => {
    if (!contextType || !contextTitle) return ""
    
    switch (contextType) {
      case "property":
        return `Hi ${contactName}, I'm interested in your property listing: "${contextTitle}". `
      case "service":
        return `Hi ${contactName}, I'd like to inquire about your service: "${contextTitle}". `
      default:
        return `Hi ${contactName}, `
    }
  }

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Please sign in to send messages")
      return
    }

    if (!message.trim()) {
      setError("Please enter a message")
      return
    }

    setLoading(true)
    setError("")

    try {
      const fullMessage = message.trim()
      
      await sendMessage(contactId, fullMessage)
      
      setSuccess(true)
      toast.success("Message sent successfully!")
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setMessage("")
        
        // Redirect to messages page
        router.push("/messages")
      }, 1500)
      
    } catch (err: any) {
      console.error("Failed to send message:", err)
      setError(err.message || "Failed to send message. Please try again.")
      toast.error("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Reset state when opening
      setError("")
      setSuccess(false)
      if (!message && contextType) {
        setMessage(getContextMessage())
      }
    }
  }

  const contactTypeInfo = getContactTypeInfo()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Message
          </DialogTitle>
          <DialogDescription>
            Send a message to {contactName}
          </DialogDescription>
        </DialogHeader>

        {/* Contact Info */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={contactAvatar} alt={contactName} />
            <AvatarFallback>
              {contactName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{contactName}</h4>
              <Badge variant="secondary" className="text-xs">
                {contactTypeInfo.icon}
                <span className="ml-1">{contactTypeInfo.label}</span>
              </Badge>
            </div>
            {contextType && contextTitle && (
              <p className="text-sm text-muted-foreground mt-1">
                Re: {contextTitle}
              </p>
            )}
          </div>
        </div>

        {/* Message Form */}
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Message sent successfully! Redirecting to messages...</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={loading || success}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/1000 characters
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading || success}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={loading || success || !message.trim()}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Quick contact button component for easy use
interface QuickContactButtonProps {
  contactId: string
  contactName: string
  contactAvatar?: string
  contactType?: "user" | "professional" | "seller" | "agent"
  contextType?: "property" | "service" | "general"
  contextId?: string
  contextTitle?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

export function QuickContactButton({
  contactId,
  contactName,
  contactAvatar,
  contactType,
  contextType,
  contextId,
  contextTitle,
  variant = "default",
  size = "default",
  className,
  children
}: QuickContactButtonProps) {
  return (
    <ContactDialog
      contactId={contactId}
      contactName={contactName}
      contactAvatar={contactAvatar}
      contactType={contactType}
      contextType={contextType}
      contextId={contextId}
      contextTitle={contextTitle}
      className={className}
    >
      <Button variant={variant} size={size} className="w-full">
        {children || (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact {contactType === "professional" ? "Provider" : contactType === "seller" ? "Seller" : "User"}
          </>
        )}
      </Button>
    </ContactDialog>
  )
}
