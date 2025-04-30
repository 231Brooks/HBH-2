"use client"

import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Heart, Share2, MapPin, Bed, Bath, SquareIcon as SquareFoot, Calendar, Gavel } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import AuctionBidding from "@/components/auction-bidding"
import PropertyMap from "@/components/property-map"
import { toggleSaveProperty } from "@/app/actions/property-actions"
import type { Property } from "@/types"

interface PropertyDetailClientProps {
  property: Property
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const isAuction = property.status === "AUCTION"

  const handleSaveProperty = async () => {
    if (!session?.user) {
      // Redirect to login or show login modal
      return
    }

    try {
      const result = await toggleSaveProperty(property.id)
      if (result.success) {
        setIsSaved(result.saved)
      }
    } catch (error) {
      console.error("Failed to save property:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.length > 0 ? (
                  property.images.map((image, index) => (
                    <CarouselItem key={image.id}>
                      <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`${property.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image src="/diverse-property-showcase.png" alt={property.title} fill className="object-cover" />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                <Badge className={isAuction ? "bg-amber-500" : "bg-green-500"}>
                  {isAuction ? "Auction" : "For Sale"}
                </Badge>
              </div>
              <p className="text-xl font-semibold text-primary mb-1">
                {formatCurrency(property.price)}
                {isAuction && <span className="text-sm font-normal text-muted-foreground ml-2">Starting Bid</span>}
              </p>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleSaveProperty}>
                <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-center p-4">
                <Bed className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">{property.beds} Beds</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-center p-4">
                <Bath className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">{property.baths} Baths</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-center p-4">
                <SquareFoot className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">{property.sqft?.toLocaleString()} sqft</span>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Property Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.description || "No description available for this property."}
                  </p>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Type:</span>
                        <span>{property.type.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built:</span>
                        <span>2020</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot Size:</span>
                        <span>0.25 acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parking:</span>
                        <span>2-Car Garage</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heating:</span>
                        <span>Central</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cooling:</span>
                        <span>Central A/C</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Property Features</h2>

                  {property.features && property.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No features listed for this property.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>

                  <div className="h-[400px] w-full rounded-md overflow-hidden mb-4">
                    {property.latitude && property.longitude ? (
                      <PropertyMap
                        properties={[property]}
                        savedProperties={[]}
                        onSaveProperty={() => {}}
                        center={{ lat: property.latitude, lng: property.longitude }}
                        zoom={15}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <p className="text-muted-foreground">Map location not available</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Neighborhood</h3>
                    <p className="text-muted-foreground mb-4">
                      Located in the heart of {property.city}, this property offers convenient access to schools,
                      shopping, and dining.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Nearby Schools</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Washington Elementary School (0.5 miles)</li>
                          <li>Lincoln Middle School (1.2 miles)</li>
                          <li>Jefferson High School (2.0 miles)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Nearby Amenities</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Central Park (0.3 miles)</li>
                          <li>Grocery Store (0.7 miles)</li>
                          <li>Shopping Mall (1.5 miles)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {isAuction ? (
            <AuctionBidding property={property} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 relative rounded-full overflow-hidden">
                    <Image src="/real-estate-agent-showing-house.png" alt="Agent" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{property.owner.name || "Property Agent"}</h3>
                    <p className="text-sm text-muted-foreground">{property.owner.email}</p>
                  </div>
                </div>
                <Button className="w-full mb-2">Contact Agent</Button>
                <Button variant="outline" className="w-full">
                  Schedule Showing
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Schedule a Showing</h2>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Choose a date and time</span>
              </div>
              <Button className="w-full">Schedule Viewing</Button>
            </CardContent>
          </Card>

          {isAuction && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Auction Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auction Type:</span>
                    <span>Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Starting Bid:</span>
                    <span>{formatCurrency(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bid Increment:</span>
                    <span>{formatCurrency(1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer's Premium:</span>
                    <span>5%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Auction Terms</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By placing a bid, you agree to the auction terms and conditions. All sales are final. Winning
                    bidders must complete the transaction within 48 hours of auction close.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
