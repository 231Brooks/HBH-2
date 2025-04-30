"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Bed, Bath, SquareIcon as SquareFoot, Clock, Gavel } from "lucide-react"
import { formatCurrency, calculateTimeLeft } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyCardProps {
  property: Property
  onSave: (propertyId: string) => void
  isSaved: boolean
  viewMode?: "grid" | "list"
}

export default function PropertyCard({ property, onSave, isSaved, viewMode = "grid" }: PropertyCardProps) {
  const isAuction = property.status === "AUCTION"
  const isGrid = viewMode === "grid"

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave(property.id)
  }

  return (
    <Link href={`/marketplace/property/${property.id}`}>
      <Card className={`overflow-hidden transition-shadow hover:shadow-md ${isGrid ? "" : "flex"}`}>
        <div className={`${isGrid ? "w-full" : "w-1/3"} relative`}>
          <div className={`relative ${isGrid ? "h-48" : "h-full"}`}>
            <Image
              src={property.images[0]?.url || "/placeholder.svg?height=200&width=300&query=property"}
              alt={property.title}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
              onClick={handleSave}
            >
              <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Badge className={`absolute top-2 left-2 ${isAuction ? "bg-amber-500" : "bg-green-500"}`}>
              {isAuction ? "Auction" : property.status.replace(/_/g, " ")}
            </Badge>
            {isAuction && property.auctionEnd && (
              <Badge className="absolute bottom-2 left-2 bg-black/70">
                <Clock className="h-3 w-3 mr-1" />
                {calculateTimeLeft(property.auctionEnd)}
              </Badge>
            )}
          </div>
        </div>
        <div className={`${isGrid ? "w-full" : "w-2/3"}`}>
          <CardContent className={`${isGrid ? "pt-4" : "p-4"}`}>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">
                {property.address}, {property.city}, {property.state}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg text-primary">
                {formatCurrency(property.price)}
                {isAuction && <span className="text-xs font-normal text-muted-foreground ml-1">Starting Bid</span>}
              </span>
              {isAuction && (
                <div className="flex items-center">
                  <Gavel className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm text-amber-500 font-medium">Auction</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Bed className="h-4 w-4 text-muted-foreground mr-1" />
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 text-muted-foreground mr-1" />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center">
                <SquareFoot className="h-4 w-4 text-muted-foreground mr-1" />
                <span>{property.sqft?.toLocaleString()} sqft</span>
              </div>
            </div>
          </CardContent>
          {!isGrid && (
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="ml-auto">
                View Details
              </Button>
            </CardFooter>
          )}
        </div>
      </Card>
    </Link>
  )
}
