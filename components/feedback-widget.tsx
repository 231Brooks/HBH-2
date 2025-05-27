"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare } from "lucide-react"

export function FeedbackWidget() {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleSubmit() {
    if (!feedback.trim()) return

    setIsSubmitting(true)

    try {
      // Replace with your feedback submission endpoint
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      })

      setIsSubmitted(true)
      setFeedback("")

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setIsSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 rounded-full shadow-lg">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>Share your thoughts, suggestions, or report issues with our platform.</DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <h3 className="text-lg font-medium text-green-600">Thank you for your feedback!</h3>
            <p className="text-sm text-gray-500 mt-2">We appreciate your input.</p>
          </div>
        ) : (
          <>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback..."
              className="min-h-[120px]"
            />
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting || !feedback.trim()}>
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
