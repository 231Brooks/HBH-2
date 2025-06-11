"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gavel, Building, Home, Clock, ArrowUpRight, MessageSquare, Heart, Search, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InFeedAd } from "@/components/ad-slots/in-feed-ad"
import { SidebarAd } from "@/components/ad-slots/sidebar-ad"
import React from "react"

// Define the page props type
interface MarketplacePageProps {
  searchParams?: {
    page?: string
    sort?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    view?: string
  }
}

export default function MarketplaceClientPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Property Marketplace</h1>
          <p className="text-muted-foreground">Find and list properties for sale or auction</p>
        </div>
        <Button>List Your Property</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search properties..." className="pl-10" />
              </div>
              <div className="relative flex-grow-0">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Location" className="pl-10" />
              </div>
              <Button>Search</Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="sale">For Sale</TabsTrigger>
              <TabsTrigger value="auction">Auction</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <select className="border rounded-md px-3 py-1 text-sm bg-white">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>

              <Suspense fallback={<div>Loading properties...</div>}>
                <PropertyListWithAds />
              </Suspense>
            </TabsContent>

            <TabsContent value="sale" className="mt-0">
              <div className="text-muted-foreground">Properties for sale will be displayed here</div>
            </TabsContent>

            <TabsContent value="auction" className="mt-0">
              <div className="text-muted-foreground">Auction properties will be displayed here</div>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <div className="text-muted-foreground">Your saved properties will be displayed here</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-1/4 space-y-6">
          {/* Sidebar Ad - Top Position */}
          <SidebarAd position="top" />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Featured Properties</h2>
            <div className="space-y-4">
              {/* Featured properties would go here */}
              <div className="text-sm text-muted-foreground">Featured properties will be displayed here</div>
            </div>
          </div>

          {/* Sidebar Ad - Middle Position */}
          <SidebarAd position="middle" />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Market Insights</h2>
            <div className="space-y-2 text-sm">
              <p>Average Price: $425,000</p>
              <p>Active Listings: 1,245</p>
              <p>Avg. Days on Market: 28</p>
              <p>Monthly Change: +2.3%</p>
            </div>
          </div>

          {/* Sidebar Ad - Bottom Position */}
          <SidebarAd position="bottom" />
        </div>
      </div>
    </div>
  )
}

// This component would fetch and display properties with ads inserted
function PropertyListWithAds() {
  // In a real app, you would fetch properties from your database
  const properties = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: `prop-${i}`,
      title: `Property ${i + 1}`,
      price: 300000 + i * 50000,
      beds: 3 + (i % 3),
      baths: 2 + (i % 2),
      sqft: 1500 + i * 200,
      address: `${123 + i} Main St, Phoenix, AZ`,
      image: `/placeholder.svg?height=300&width=400&text=Property+${i + 1}`,
    }))

  return (
    <div className="space-y-6">
      {properties.map((property, index) => (
        <React.Fragment key={property.id}>
          {/* Property card would go here */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <p className="text-primary font-bold mb-2">${property.price.toLocaleString()}</p>
                <p className="text-muted-foreground mb-4">{property.address}</p>
                <div className="flex gap-4 text-sm">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insert ad after every 5th property */}
          {(index + 1) % 5 === 0 && <InFeedAd index={Math.floor(index / 5)} />}
        </React.Fragment>
      ))}
    </div>
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
