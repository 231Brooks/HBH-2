"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, CheckCircle, XCircle, MessageSquare, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface DocumentReviewProps {
  document: {
    id: string
    name: string
    url: string
    type: string
    status: string
    createdAt: string
    uploadedBy?: {
      id: string
      name: string
      image?: string
    }
    comments: Array<{
      id: string
      content: string
      userId: string
      createdAt: string
      user: {
        id: string
        name: string
        image?: string
      }
    }>
  }
  onApprove: (id: string) => Promise<{ success: boolean; error?: string }>
  onReject: (id: string, reason: string) => Promise<{ success: boolean; error?: string }>
  onComment: (id: string, comment: string) => Promise<{ success: boolean; error?: string }>
}

export default function DocumentReview({ document, onApprove, onReject, onComment }: DocumentReviewProps) {
  const [comment, setComment] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      const result = await onApprove(document.id)
      if (result.success) {
        toast({
          title: "Document approved",
          description: "The document has been approved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve document",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onReject(document.id, rejectReason)
      if (result.success) {
        toast({
          title: "Document rejected",
          description: "The document has been rejected successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject document",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onComment(document.id, comment)
      if (result.success) {
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully.",
        })
        setComment("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{document.name}</CardTitle>
        <Badge variant="secondary">{document.status}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="text-right font-medium">Uploaded By</div>
          <div className="flex items-center space-x-2">
            <Avatar>
              {document.uploadedBy?.image ? (
                <AvatarImage src={document.uploadedBy.image || "/placeholder.svg"} alt={document.uploadedBy.name} />
              ) : (
                <AvatarFallback>{document.uploadedBy?.name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <span>{document.uploadedBy?.name || "N/A"}</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="text-right font-medium">Uploaded At</div>
          <div>{formatDate(document.createdAt)}</div>
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="text-right font-medium">File</div>
          <div>
            <Button variant="link" asChild>
              <a href={document.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Download
                <Download className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {document.comments.length > 0 ? (
            document.comments.map((comment) => (
              <div key={comment.id} className="mb-4">
                <div className="flex items-start space-x-2">
                  <Avatar>
                    {comment.user.image ? (
                      <AvatarImage src={comment.user.image || "/placeholder.svg"} alt={comment.user.name} />
                    ) : (
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{comment.user.name}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</div>
                    <div className="text-sm">{comment.content}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No comments yet.</div>
          )}

          <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button onClick={handleCommentSubmit} disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Submitting..." : "Add Comment"}
            <MessageSquare className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {document.status === "pending" && (
          <div>
            <Textarea
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {document.status === "pending" ? (
          <>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? "Rejecting..." : "Reject"}
              <XCircle className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? "Approving..." : "Approve"}
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : null}
      </CardFooter>
    </Card>
  )
}
