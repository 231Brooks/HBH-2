import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gavel, Building, Home, ArrowUpRight, MessageSquare, Heart } from "lucide-react"
import { QuickContactButton } from "@/components/contact-dialog"

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
  
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <Image
            src={primaryImage}
            alt={property.title}
            width={600}
            height={400}
            className="h-48 w-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${statusBadge.color} text-white`}>
            {property.status === "AUCTION" ? (
              <>
                <Gavel className="mr-1 h-3 w-3" /> {statusBadge.label}
              </>
            ) : (
              statusBadge.label
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
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="font-bold text-primary">{formatPrice(property.price)}</p>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{fullAddress}</span>
          </div>
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              {property.beds && <Badge variant="outline">{property.beds} Beds</Badge>}
              {property.baths && <Badge variant="outline">{property.baths} Baths</Badge>}
              {property.sqft && <Badge variant="outline">{property.sqft.toLocaleString()} sqft</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/marketplace/property/${property.id}`}>Details</Link>
            </Button>
            <QuickContactButton
              contactId={property.ownerId || "demo-seller-1"}
              contactName={property.ownerName || "Property Owner"}
              contactType="seller"
              contextType="property"
              contextId={property.id}
              contextTitle={property.title}
              size="sm"
              className="flex-1"
            >
              <MessageSquare className="mr-1 h-4 w-4" /> Contact
            </QuickContactButton>
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
              src={primaryImage}
              alt={property.title}
              width={600}
              height={400}
              className="h-48 md:h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${statusBadge.color} text-white`}
            >
              {property.status === "AUCTION" ? (
                <>
                  <Gavel className="mr-1 h-3 w-3" /> {statusBadge.label}
                </>
              ) : (
                statusBadge.label
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
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="font-bold text-primary">{formatPrice(property.price)}</p>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{fullAddress}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
            <div className="flex gap-4 mb-4">
              {property.beds && (
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{property.beds} Beds</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{property.baths} Baths</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/marketplace/property/${property.id}`}>
                  <ArrowUpRight className="mr-1 h-4 w-4" /> View Details
                </Link>
              </Button>
              <QuickContactButton
                contactId={property.ownerId || "demo-seller-1"}
                contactName={property.ownerName || "Property Owner"}
                contactType="seller"
                contextType="property"
                contextId={property.id}
                contextTitle={property.title}
              >
                <MessageSquare className="mr-1 h-4 w-4" /> Contact Seller
              </QuickContactButton>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
