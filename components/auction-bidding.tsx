"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Users, Award } from "lucide-react"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/utils"
import { placeBid, getPropertyBids } from "@/app/actions/property-actions"
import type { Property, Bid } from "@/types"

interface AuctionBiddingProps {
  property: Property
}

export default function AuctionBidding({ property }: AuctionBiddingProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [error, setError] = useState("")

  const currentHighestBid = bids.length > 0 ? bids[0].amount : property.price
  const minimumBid = currentHighestBid + 1000 // $1000 increment
  const isOwner = session?.user?.id === property.ownerId
  const hasReservePrice = property.auctionReservePrice !== null && property.auctionReservePrice !== undefined
  const reservePrice = property.auctionReservePrice || 0
  const reserveMet = currentHighestBid >= reservePrice

  useEffect(() => {
    fetchBids()
    const interval = setInterval(fetchBids, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [property.id])

  useEffect(() => {
    if (property.auctionEnd) {
      const updateTimeLeft = () => {
        const now = new Date()
        const end = new Date(property.auctionEnd!)
        const diff = end.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeLeft("Auction ended")
          return
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`)
        }
      }

      updateTimeLeft()
      const interval = setInterval(updateTimeLeft, 1000)
      return () => clearInterval(interval)
    }
  }, [property.auctionEnd])

  const fetchBids = async () => {
    try {
      const result = await getPropertyBids(property.id)
      if (result.bids) {
        setBids(result.bids)
      }
    } catch (error) {
      console.error("Failed to fetch bids:", error)
    }
  }

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!session?.user) {
      setError("You must be logged in to place a bid")
      return
    }

    const amount = Number.parseFloat(bidAmount)
    if (isNaN(amount) || amount < minimumBid) {
      setError(`Bid must be at least ${formatCurrency(minimumBid)}`)
      return
    }

    setLoading(true)
    try {
      const result = await placeBid(property.id, amount)
      if (result.success) {
        setBidAmount("")
        fetchBids()
        router.refresh()
      } else {
        setError(result.error || "Failed to place bid")
      }
    } catch (error) {
      console.error("Failed to place bid:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isAuctionEnded = property.auctionEnd && new Date(property.auctionEnd) < new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Auction Details</span>
          <Badge className={isAuctionEnded ? "bg-red-500" : "bg-amber-500"}>
            {isAuctionEnded ? "Ended" : "Active"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isAuctionEnded
            ? `This auction ended on ${new Date(property.auctionEnd!).toLocaleDateString()}`
            : "Place your bid to win this property"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">Time Left:</span>
          </div>
          <span
            className={`font-bold ${isAuctionEnded || timeLeft === "Auction ended" ? "text-red-500" : "text-amber-500"}`}
          >
            {timeLeft || "Loading..."}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">Current Bid:</span>
          </div>
          <span className="font-bold text-lg">{formatCurrency(currentHighestBid)}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">Total Bids:</span>
          </div>
          <span>{bids.length}</span>
        </div>

        {hasReservePrice && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="font-medium">Reserve Price:</span>
            </div>
            <Badge className={reserveMet ? "bg-green-500" : "bg-gray-500"}>{reserveMet ? "Met" : "Not Met"}</Badge>
          </div>
        )}

        {bids.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent Bids</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {bids.slice(0, 5).map((bid) => (
                <div key={bid.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {bid.user?.name || "Anonymous"} • {new Date(bid.createdAt).toLocaleString()}
                  </span>
                  <span className="font-medium">{formatCurrency(bid.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isAuctionEnded && !isOwner ? (
          <form onSubmit={handleBidSubmit} className="w-full space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder={`Min bid: ${formatCurrency(minimumBid)}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minimumBid}
                step="100"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Placing Bid..." : "Place Bid"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-xs text-muted-foreground">
              By placing a bid, you agree to the auction terms and conditions.
            </p>
          </form>
        ) : isOwner ? (
          <p className="text-amber-500 text-sm">You cannot bid on your own property.</p>
        ) : (
          <p className="text-red-500 text-sm">This auction has ended.</p>
        )}
      </CardFooter>
    </Card>
  )
}
