"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "@/contexts/supabase-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface BidFormProps {
  propertyId: string
  currentBid: number | null
  minimumBid: number
  onBidPlaced?: (amount: number) => void
}

export function BidForm({ propertyId, currentBid, minimumBid, onBidPlaced }: BidFormProps) {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate minimum bid amount
  const minBidAmount = currentBid ? currentBid + minimumBid : minimumBid

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place a bid",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(bidAmount)

    if (isNaN(amount) || amount < minBidAmount) {
      toast({
        title: "Invalid bid amount",
        description: `Bid must be at least $${minBidAmount.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bidding/place-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid")
      }

      toast({
        title: "Bid placed successfully!",
        description: `Your bid of $${amount.toLocaleString()} has been placed`,
        variant: "default",
      })

      setBidAmount("")

      if (onBidPlaced) {
        onBidPlaced(amount)
      }
    } catch (error: any) {
      toast({
        title: "Error placing bid",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Bid</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bidAmount">Your Bid Amount</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-7"
                  min={minBidAmount}
                  step="1000"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {currentBid
                  ? `Current bid: $${currentBid.toLocaleString()} • Minimum increment: $${minimumBid.toLocaleString()}`
                  : `Starting bid: $${minimumBid.toLocaleString()}`}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
