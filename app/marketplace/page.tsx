"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gavel, Building, Home, Clock, ArrowUpRight, MessageSquare, Heart } from "lucide-react"
import MarketplaceClient from "./marketplace-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceSkeleton />}>
      <MarketplaceClient />
    </Suspense>
  )
}

function MarketplaceSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-24 w-full mb-8" />

      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
      </div>
    </div>
  )
}

interface PropertyCardProps {
  id: string
  title: string
  address: string
  price: string
  beds: number
  baths: number
  sqft: number
  type: "sale" | "auction"
  image: string
  viewMode: "grid" | "list" | "map"
  auctionEnds?: string
  description?: string
}

function PropertyCard({
  id,
  title,
  address,
  price,
  beds,
  baths,
  sqft,
  type,
  image,
  viewMode,
  auctionEnds,
  description,
}: PropertyCardProps) {
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={600}
            height={400}
            className="h-48 w-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${type === "auction" ? "bg-amber-500" : "bg-primary"} text-white`}>
            {type === "auction" ? (
              <>
                <Gavel className="mr-1 h-3 w-3" /> Auction
              </>
            ) : (
              "For Sale"
            )}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/80 hover:bg-white text-slate-700 rounded-full h-8 w-8"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="font-bold text-primary">{price}</p>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{address}</span>
          </div>
          {type === "auction" && auctionEnds && (
            <div className="flex items-center text-amber-600 text-sm mb-3">
              <Clock className="h-4 w-4 mr-1" />
              <span>Ends: {auctionEnds}</span>
            </div>
          )}
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <Badge variant="outline">{beds} Beds</Badge>
              <Badge variant="outline">{baths} Baths</Badge>
              <Badge variant="outline">{sqft.toLocaleString()} sqft</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/marketplace/${id}`}>Details</Link>
            </Button>
            <Button size="sm" className="flex-1">
              <MessageSquare className="mr-1 h-4 w-4" /> Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  } else {
    // List view
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={400}
              className="h-48 md:h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${type === "auction" ? "bg-amber-500" : "bg-primary"} text-white`}
            >
              {type === "auction" ? (
                <>
                  <Gavel className="mr-1 h-3 w-3" /> Auction
                </>
              ) : (
                "For Sale"
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 bg-white/80 hover:bg-white text-slate-700 rounded-full h-8 w-8"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="font-bold text-primary">{price}</p>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{address}</span>
            </div>
            {type === "auction" && auctionEnds && (
              <div className="flex items-center text-amber-600 text-sm mb-3">
                <Clock className="h-4 w-4 mr-1" />
                <span>Ends: {auctionEnds}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center">
                <Home className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{baths} Baths</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{sqft.toLocaleString()} sqft</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/marketplace/${id}`}>
                  <ArrowUpRight className="mr-1 h-4 w-4" /> View Details
                </Link>
              </Button>
              <Button>
                <MessageSquare className="mr-1 h-4 w-4" /> Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
