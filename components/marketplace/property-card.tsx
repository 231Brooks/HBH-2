import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gavel, Building, Home, ArrowUpRight, MessageSquare, Heart, Calendar, Clock } from "lucide-react"
import { QuickContactButton } from "@/components/contact-dialog"
import { PropertyViewingDialog } from "@/components/property-viewing-dialog"

interface PropertyCardProps {
  property: any
  viewMode: "grid" | "list" | "map"
}

export function PropertyCard({ property, viewMode }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return { label: "For Sale", color: "bg-primary" }
      case "PENDING": return { label: "Pending", color: "bg-amber-500" }
      case "SOLD": return { label: "Sold", color: "bg-green-500" }
      case "AUCTION": return { label: "Auction", color: "bg-amber-500" }
      default: return { label: status, color: "bg-gray-500" }
    }
  }

  const statusBadge = getStatusBadge(property.status)
  const primaryImage = property.images?.[0]?.url || "/placeholder.svg?height=400&width=600"
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`

  // Auction-specific data
  const isAuction = property.status === "AUCTION"
  const auctionEndDate = property.auctionEndDate ? new Date(property.auctionEndDate) : null
  const currentBid = property.currentBid
  const auctionEnded = auctionEndDate ? new Date() > auctionEndDate : false

  const formatAuctionTime = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}m left`
  }
  
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className="relative">
          <Image
            src={primaryImage}
            alt={property.title}
            width={600}
            height={400}
            className="h-40 sm:h-48 w-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${statusBadge.color} text-white text-xs`}>
            {property.status === "AUCTION" ? (
              <>
                <Gavel className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">{statusBadge.label}</span>
                <span className="sm:hidden">Auction</span>
              </>
            ) : (
              <span className="hidden sm:inline">{statusBadge.label}</span>
            )}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/80 hover:bg-white text-slate-700 rounded-full h-6 w-6 sm:h-8 sm:w-8"
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1">
            <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 flex-1">{property.title}</h3>
            <p className="font-bold text-primary text-sm sm:text-base flex-shrink-0">{formatPrice(property.price)}</p>
          </div>
          <div className="flex items-center text-muted-foreground text-xs sm:text-sm mb-3">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{fullAddress}</span>
          </div>

          {/* Auction Information */}
          {isAuction && (
            <div className="mb-3 space-y-1">
              {currentBid && (
                <div className="flex items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Current Bid:</span>
                  <span className="ml-1 font-semibold text-primary">{formatPrice(currentBid)}</span>
                </div>
              )}
              {auctionEndDate && (
                <div className={`flex items-center text-xs sm:text-sm ${auctionEnded ? 'text-red-600' : 'text-amber-600'}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{auctionEnded ? "Auction Ended" : formatAuctionTime(auctionEndDate)}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between mb-4 flex-grow">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {property.beds && <Badge variant="outline" className="text-xs">{property.beds} Beds</Badge>}
              {property.baths && <Badge variant="outline" className="text-xs">{property.baths} Baths</Badge>}
              {property.sqft && <Badge variant="outline" className="text-xs hidden sm:inline-flex">{property.sqft.toLocaleString()} sqft</Badge>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" asChild>
              <Link href={`/marketplace/property/${property.id}`}>
                <span className="hidden sm:inline">Details</span>
                <span className="sm:hidden">View</span>
              </Link>
            </Button>
            <PropertyViewingDialog property={property}>
              <Button size="sm" className="flex-1 text-xs sm:text-sm">
                <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Tour</span>
                <span className="sm:hidden">Tour</span>
              </Button>
            </PropertyViewingDialog>
          </div>
          <div className="mt-2">
            <QuickContactButton
              contactId={property.ownerId || "demo-seller-1"}
              contactName={property.ownerName || "Property Owner"}
              contactType="seller"
              contextType="property"
              contextId={property.id}
              contextTitle={property.title}
              size="sm"
              variant="outline"
              className="w-full text-xs sm:text-sm"
            >
              <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Message
            </QuickContactButton>
          </div>
        </CardContent>
      </Card>
    )
  } else {
    // List view with responsive design
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-1/3 lg:w-1/4">
            <Image
              src={primaryImage}
              alt={property.title}
              width={600}
              height={400}
              className="h-48 sm:h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${statusBadge.color} text-white text-xs`}
            >
              {property.status === "AUCTION" ? (
                <>
                  <Gavel className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">{statusBadge.label}</span>
                  <span className="sm:hidden">Auction</span>
                </>
              ) : (
                <span className="hidden sm:inline">{statusBadge.label}</span>
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 bg-white/80 hover:bg-white text-slate-700 rounded-full h-6 w-6 sm:h-8 sm:w-8"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <div className="p-4 sm:p-6 sm:w-2/3 lg:w-3/4 flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 gap-2">
              <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{property.title}</h3>
              <p className="font-bold text-primary text-sm sm:text-base flex-shrink-0">{formatPrice(property.price)}</p>
            </div>
            <div className="flex items-center text-muted-foreground text-xs sm:text-sm mb-3">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{fullAddress}</span>
            </div>

            {/* Auction Information for List View */}
            {isAuction && (
              <div className="mb-3 space-y-1">
                {currentBid && (
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="text-muted-foreground">Current Bid:</span>
                    <span className="ml-1 font-semibold text-primary">{formatPrice(currentBid)}</span>
                  </div>
                )}
                {auctionEndDate && (
                  <div className={`flex items-center text-xs sm:text-sm ${auctionEnded ? 'text-red-600' : 'text-amber-600'}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{auctionEnded ? "Auction Ended" : formatAuctionTime(auctionEndDate)}</span>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{property.description}</p>
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
              {property.beds && (
                <div className="flex items-center">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mr-1" />
                  <span className="text-xs sm:text-sm">{property.beds} Beds</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mr-1" />
                  <span className="text-xs sm:text-sm">{property.baths} Baths</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mr-1" />
                  <span className="text-xs sm:text-sm">{property.sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm" asChild>
                <Link href={`/marketplace/property/${property.id}`}>
                  <ArrowUpRight className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Link>
              </Button>
              <PropertyViewingDialog property={property}>
                <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                  <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Schedule Tour</span>
                  <span className="sm:hidden">Tour</span>
                </Button>
              </PropertyViewingDialog>
              <QuickContactButton
                contactId={property.ownerId || "demo-seller-1"}
                contactName={property.ownerName || "Property Owner"}
                contactType="seller"
                contextType="property"
                contextId={property.id}
                contextTitle={property.title}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Message
              </QuickContactButton>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
