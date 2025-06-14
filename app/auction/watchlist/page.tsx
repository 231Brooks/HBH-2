"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/hooks/use-supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { AuctionTimer } from "@/components/auction/auction-timer"
import { AuctionWatchButton } from "@/components/auction/auction-watch-button"
import { 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface WatchedAuction {
  id: string
  createdAt: string
  property: {
    id: string
    title: string
    address: string
    city: string
    state: string
    auctionEndDate: string
    currentBid: number | null
    minimumBid: number
    reservePrice: number | null
    images: { url: string }[]
    bids: { amount: number }[]
  }
}

function WatchListContent() {
  const { user } = useSupabase()
  const { toast } = useToast()
  const [watchList, setWatchList] = useState<WatchedAuction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchWatchList()
    }
  }, [user?.id])

  const fetchWatchList = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auction/watchlist")
      const data = await response.json()

      if (data.success) {
        setWatchList(data.watchList || [])
      } else {
        throw new Error(data.error || "Failed to fetch watch list")
      }
    } catch (error: any) {
      console.error("Error fetching watch list:", error)
      toast({
        title: "Error",
        description: "Failed to load your watch list.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchWatchList()
    setIsRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Your watch list has been updated.",
    })
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const timeLeft = end.getTime() - now.getTime()
    
    if (timeLeft <= 0) return "Ended"
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getAuctionStatus = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const timeLeft = end.getTime() - now.getTime()
    
    if (timeLeft <= 0) return { status: "ended", color: "bg-gray-100 text-gray-800" }
    if (timeLeft <= 60 * 60 * 1000) return { status: "ending soon", color: "bg-red-100 text-red-800" }
    if (timeLeft <= 24 * 60 * 60 * 1000) return { status: "ending today", color: "bg-amber-100 text-amber-800" }
    return { status: "active", color: "bg-green-100 text-green-800" }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Watch List</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Watch List</h1>
            <p className="text-gray-600 mt-2">
              {watchList.length} auction{watchList.length !== 1 ? 's' : ''} you're watching
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Watch List */}
        {watchList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Watched Auctions</h3>
              <p className="text-gray-600 mb-6">
                Start watching auctions to keep track of properties you're interested in.
              </p>
              <Link href="/marketplace">
                <Button>Browse Auctions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchList.map((item) => {
              const auctionStatus = getAuctionStatus(item.property.auctionEndDate)
              const currentBid = item.property.bids[0]?.amount || item.property.currentBid
              const hasImage = item.property.images.length > 0

              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-100">
                    {hasImage ? (
                      <Image
                        src={item.property.images[0].url}
                        alt={item.property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className={auctionStatus.color}>
                        {auctionStatus.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Property Info */}
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {item.property.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.property.address}, {item.property.city}, {item.property.state}
                      </p>
                    </div>

                    {/* Auction Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Bid</span>
                        <span className="font-semibold">
                          {currentBid ? `$${currentBid.toLocaleString()}` : 'No bids yet'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Time Remaining</span>
                        <span className="font-semibold flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeRemaining(item.property.auctionEndDate)}
                        </span>
                      </div>
                    </div>

                    {/* Auction Timer for ending soon */}
                    {auctionStatus.status === "ending soon" && (
                      <div className="border-t pt-3">
                        <AuctionTimer
                          endDate={new Date(item.property.auctionEndDate)}
                          onAuctionEnd={() => {
                            // Refresh the watch list when auction ends
                            fetchWatchList()
                          }}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/marketplace/property/${item.property.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          View Auction
                        </Button>
                      </Link>
                      <AuctionWatchButton
                        propertyId={item.property.id}
                        variant="outline"
                        size="sm"
                        showText={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WatchListPage() {
  return (
    <ProtectedRoute>
      <WatchListContent />
    </ProtectedRoute>
  )
}
