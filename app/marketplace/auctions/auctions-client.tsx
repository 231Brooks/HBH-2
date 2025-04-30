"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Gavel, User } from "lucide-react"

type Auction = {
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
}

export default function AuctionsClient({ initialAuctions }: { initialAuctions: Auction[] }) {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions)
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all")
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({})

  useEffect(() => {
    // Update time remaining every second
    const interval = setInterval(() => {
      const newTimeLeft: Record<string, string> = {}

      auctions.forEach((auction) => {
        const endTime = new Date(auction.auctionEnd)
        const now = new Date()

        if (endTime > now) {
          newTimeLeft[auction.id] = formatDistanceToNow(endTime, { addSuffix: true })
        } else {
          newTimeLeft[auction.id] = "Ended"
        }
      })

      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(interval)
  }, [auctions])

  const filteredAuctions = auctions.filter((auction) => {
    const isEnded = new Date(auction.auctionEnd) < new Date()

    if (filter === "active") return !isEnded
    if (filter === "ended") return isEnded
    return true
  })

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All Auctions
        </Button>
        <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
          Active Auctions
        </Button>
        <Button variant={filter === "ended" ? "default" : "outline"} onClick={() => setFilter("ended")}>
          Ended Auctions
        </Button>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No auctions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden">
              <Link href={`/marketplace/auction/${auction.id}`}>
                <div className="relative h-48">
                  <Image
                    src={auction.image || "/placeholder.svg?height=400&width=600&query=property"}
                    alt={auction.title}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${timeLeft[auction.id] === "Ended" ? "bg-red-500" : "bg-green-500"}`}
                  >
                    {timeLeft[auction.id] === "Ended" ? "Ended" : "Active"}
                  </Badge>
                </div>
              </Link>

              <CardContent className="pt-4">
                <Link href={`/marketplace/auction/${auction.id}`}>
                  <h2 className="text-xl font-semibold mb-2 hover:underline">{auction.title}</h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{auction.description}</p>

                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Starting bid</p>
                    <p className="font-semibold">${auction.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current bid</p>
                    <p className="font-semibold">${auction.currentBid.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{auction.owner_name}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className={timeLeft[auction.id] === "Ended" ? "text-red-500" : "text-green-500"}>
                      {timeLeft[auction.id] || "Loading..."}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Gavel className="h-4 w-4 mr-1" />
                  <span>
                    {auction.bidCount} {auction.bidCount === 1 ? "bid" : "bids"}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/marketplace/auction/${auction.id}`}>
                    {timeLeft[auction.id] === "Ended" ? "View Results" : "Place Bid"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
