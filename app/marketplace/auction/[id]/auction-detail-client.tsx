"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { placeBid } from "@/app/actions/auction-actions"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign, Users, Award, ArrowLeft, Share2 } from "lucide-react"
import { useSession } from "next-auth/react"

type Bid = {
  id: string
  amount: number
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    image: string
  }
}

type AuctionItem = {
  id: string
  title: string
  description: string
  image: string
  price: number
  currentBid: number
  bidCount: number
  auctionEnd: string
  auctionReservePrice: number | null
  owner_name: string
  owner_image: string
  userId: string
  category: string
  createdAt: string
}

export default function AuctionDetailClient({
  item,
  bids,
}: {
  item: AuctionItem
  bids: Bid[]
}) {
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()
  const [bidAmount, setBidAmount] = useState<number>(Math.round(item.currentBid + 10))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isEnded, setIsEnded] = useState<boolean>(new Date(item.auctionEnd) < new Date())
  const [activeTab, setActiveTab] = useState("details")

  const isOwner = session?.user?.id === item.userId
  const hasReservePrice = item.auctionReservePrice !== null
  const reserveMet = hasReservePrice ? item.currentBid >= item.auctionReservePrice : true

  useEffect(() => {
    const updateTimeLeft = () => {
      const endTime = new Date(item.auctionEnd)
      const now = new Date()

      if (endTime > now) {
        setTimeLeft(formatDistanceToNow(endTime, { addSuffix: true }))
        setIsEnded(false)
      } else {
        setTimeLeft("Auction ended")
        setIsEnded(true)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [item.auctionEnd])

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await placeBid(item.id, bidAmount)

      if (result.success) {
        toast({
          title: "Bid placed successfully!",
          description: `Your bid of $${bidAmount.toLocaleString()} has been placed.`,
        })
        // Refresh the page to show the new bid
        router.refresh()
      } else {
        toast({
          title: "Failed to place bid",
          description: result.error || "An error occurred",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Auctions
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={item.image || "/placeholder.svg?height=600&width=800&query=property"}
              alt={item.title}
              fill
              className="object-cover"
            />
            <Badge className={`absolute top-4 right-4 ${isEnded ? "bg-red-500" : "bg-green-500"}`}>
              {isEnded ? "Ended" : "Active"}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mt-6 mb-2">{item.title}</h1>

          <div className="flex items-center mb-4">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={item.owner_image || "/placeholder.svg?height=100&width=100&query=person"}
                alt={item.owner_name}
              />
              <AvatarFallback>{item.owner_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span>Listed by {item.owner_name}</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bids">Bid History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Item Description</h2>
                  <p className="whitespace-pre-line">{item.description}</p>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">Auction Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{item.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Starting Bid:</span>
                        <span>${item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Bid:</span>
                        <span>${item.currentBid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bid Increment:</span>
                        <span>$10.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>{formatDate(item.auctionEnd)}</span>
                      </div>
                      {hasReservePrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reserve Price:</span>
                          <Badge className={reserveMet ? "bg-green-500" : "bg-gray-500"}>
                            {reserveMet ? "Met" : "Not Met"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bids" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Bid History</h2>

                  {bids.length === 0 ? (
                    <p className="text-gray-500">No bids yet</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {bids.map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={bid.user.image || "/placeholder.svg?height=100&width=100&query=person"}
                                alt={bid.user.name}
                              />
                              <AvatarFallback>{bid.user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{bid.user.name || "Anonymous"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(bid.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">${Number(bid.amount).toLocaleString()}</p>
                            <p className={`text-xs ${bid.status === "ACTIVE" ? "text-green-500" : "text-gray-500"}`}>
                              {bid.status === "ACTIVE" ? "Current bid" : "Outbid"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Auction Details</span>
                <Badge className={isEnded ? "bg-red-500" : "bg-green-500"}>{isEnded ? "Ended" : "Active"}</Badge>
              </CardTitle>
              <CardDescription>
                {isEnded ? `This auction ended on ${formatDate(item.auctionEnd)}` : "Place your bid to win this item"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium">Time Left:</span>
                </div>
                <span className={`font-bold ${isEnded ? "text-red-500" : "text-green-500"}`}>
                  {timeLeft || "Loading..."}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium">Current Bid:</span>
                </div>
                <span className="font-bold text-lg">${item.currentBid.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium">Total Bids:</span>
                </div>
                <span>{item.bidCount}</span>
              </div>

              {hasReservePrice && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="font-medium">Reserve Price:</span>
                  </div>
                  <Badge className={reserveMet ? "bg-green-500" : "bg-gray-500"}>
                    {reserveMet ? "Met" : "Not Met"}
                  </Badge>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!isEnded && !isOwner ? (
                <form onSubmit={handleBidSubmit} className="w-full space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder={`Min bid: $${(item.currentBid + 10).toLocaleString()}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={item.currentBid + 10}
                      step="10"
                      required
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Placing Bid..." : "Place Bid"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By placing a bid, you agree to the auction terms and conditions.
                  </p>
                </form>
              ) : isOwner ? (
                <p className="text-amber-500 text-sm">You cannot bid on your own item.</p>
              ) : (
                <p className="text-red-500 text-sm">This auction has ended.</p>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Button variant="outline" className="w-full mb-2">
                <Share2 className="mr-2 h-4 w-4" />
                Share Auction
              </Button>
              {isOwner && !isEnded && (
                <Button variant="destructive" className="w-full">
                  Cancel Auction
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
