"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BidForm } from "@/components/bidding/bid-form"
import { BidHistory } from "@/components/bidding/bid-history"
import { AuctionTimer } from "@/components/auction/auction-timer"
import { AuctionWatchButton } from "@/components/auction/auction-watch-button"
import { ReservePriceIndicator } from "@/components/auction/reserve-price-indicator"
import { QuickContactButton } from "@/components/contact-dialog"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Heart,
  Share2,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Home,
  Ruler,
  Car,
  Droplets,
  Zap,
  Shield,
  CheckCircle,
  Star
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { getPropertyById } from "@/app/actions/property-actions"

function PropertyDetailContent() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    setLoading(true)
    try {
      const result = await getPropertyById(propertyId)
      if (result.success && result.property) {
        setProperty(result.property)
      } else {
        setError("Property not found")
      }
    } catch (err: any) {
      console.error("Failed to load property:", err)
      setError("Failed to load property details")
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested property could not be found."}</p>
          <Button asChild>
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(property.status)
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`
  const images = property.images || [{ url: "/placeholder.svg?height=600&width=800" }]

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={images[currentImageIndex]?.url || "/placeholder.svg"}
              alt={property.title}
              fill
              className="object-cover"
            />
            <Badge className={`absolute top-4 right-4 ${statusBadge.color} text-white`}>
              {statusBadge.label}
            </Badge>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 ${
                    index === currentImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{formatPrice(property.price)}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {fullAddress}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                {property.bedrooms && (
                  <div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Beds</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Baths</div>
                  </div>
                )}
                {property.squareFeet && (
                  <div>
                    <div className="font-semibold">{property.squareFeet.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <QuickContactButton
                  contactId={property.ownerId || "demo-seller-1"}
                  contactName={property.ownerName || "Property Owner"}
                  contactType="seller"
                  contextType="property"
                  contextId={property.id}
                  contextTitle={property.title}
                  size="lg"
                />
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Tour
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auction Section for Auction Properties */}
          {property.status === "AUCTION" && (
            <div className="space-y-6">
              {/* Auction Timer */}
              {property.auctionEndDate && (
                <AuctionTimer
                  endDate={new Date(property.auctionEndDate)}
                  onAuctionEnd={() => {
                    // Refresh the page when auction ends
                    window.location.reload()
                  }}
                />
              )}

              {/* Watch Button */}
              <div className="flex justify-center">
                <AuctionWatchButton propertyId={property.id} />
              </div>

              {/* Auction Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Auction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Bid</p>
                      <p className="text-2xl font-bold text-primary">
                        {property.currentBid ? `$${property.currentBid.toLocaleString()}` : "No bids yet"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Starting Bid</p>
                      <p className="text-lg font-semibold">
                        ${property.minimumBid?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bid Increment</p>
                      <p className="text-lg font-semibold">
                        ${property.bidIncrement?.toLocaleString() || "1,000"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auction Ends</p>
                      <p className="text-lg font-semibold">
                        {property.auctionEndDate
                          ? new Date(property.auctionEndDate).toLocaleDateString() + " at " + new Date(property.auctionEndDate).toLocaleTimeString()
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Reserve Price Indicator */}
                  <ReservePriceIndicator
                    reservePrice={property.reservePrice}
                    currentBid={property.currentBid}
                    minimumBid={property.minimumBid}
                    showAmount={false} // Don't show exact reserve amount to bidders
                  />
                </CardContent>
              </Card>

              {/* Bidding Form */}
              <BidForm
                propertyId={property.id}
                currentBid={property.currentBid}
                minimumBid={property.minimumBid || 5000}
                bidIncrement={property.bidIncrement || 1000}
                auctionEndDate={property.auctionEndDate ? new Date(property.auctionEndDate) : undefined}
                onBidPlaced={() => {
                  // Refresh the page to show updated bid information
                  window.location.reload()
                }}
              />

              {/* Bid History */}
              <BidHistory propertyId={property.id} />
            </div>
          )}

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listed by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{property.creator?.name || "Property Owner"}</div>
                  <div className="text-sm text-muted-foreground">
                    Listed {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PropertyDetailPage() {
  return (
    <ProtectedRoute>
      <PropertyDetailContent />
    </ProtectedRoute>
  )
}
