"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Heart, MessageSquare } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyCardProps {
  property: Property
  onSave?: (propertyId: string) => void
  isSaved?: boolean
  viewMode?: "grid" | "list"
}

export default function PropertyCard({ property, onSave, isSaved = false, viewMode = "grid" }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0]
  const imageUrl = primaryImage?.url || "/cozy-cabin-retreat.png"

  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={property.title}
            width={600}
            height={400}
            className="h-48 w-full object-cover"
          />
          <Badge
            className={`absolute top-2 right-2 ${
              property.status === "AUCTION" ? "bg-amber-500" : "bg-primary"
            } text-white`}
          >
            {property.status === "FOR_SALE"
              ? "For Sale"
              : property.status === "AUCTION"
                ? "Auction"
                : property.status === "PENDING"
                  ? "Pending"
                  : "Sold"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full h-8 w-8 ${
              isSaved ? "text-red-500" : "text-slate-700"
            }`}
            onClick={() => onSave && onSave(property.id)}
          >
            <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="font-bold text-primary">{formatCurrency(property.price)}</p>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {property.address}, {property.city}, {property.state}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <div className="flex gap-3">
              <div className="flex items-center">
                <Bed className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.baths} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/marketplace/${property.id}`}>Details</Link>
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
              src={imageUrl || "/placeholder.svg"}
              alt={property.title}
              width={600}
              height={400}
              className="h-48 md:h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${
                property.status === "AUCTION" ? "bg-amber-500" : "bg-primary"
              } text-white`}
            >
              {property.status === "FOR_SALE"
                ? "For Sale"
                : property.status === "AUCTION"
                  ? "Auction"
                  : property.status === "PENDING"
                    ? "Pending"
                    : "Sold"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full h-8 w-8 ${
                isSaved ? "text-red-500" : "text-slate-700"
              }`}
              onClick={() => onSave && onSave(property.id)}
            >
              <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            </Button>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="font-bold text-primary">{formatCurrency(property.price)}</p>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {property.address}, {property.city}, {property.state}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.baths} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/marketplace/${property.id}`}>View Details</Link>
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
