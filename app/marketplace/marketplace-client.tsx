"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Filter,
  Plus,
  Grid,
  List,
  Gavel,
  Building,
  Home,
  Clock,
  ArrowUpRight,
  MessageSquare,
  Heart,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import dynamic from "next/dynamic"
import { CachedMarketplaceItems } from "./cached-items"

// Import PropertyMap with dynamic import to prevent SSR issues
const PropertyMap = dynamic(() => import("./components/property-map"), { ssr: false })

export default function MarketplaceClient() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Property Marketplace</h1>
          <p className="text-muted-foreground">Browse, buy, sell, and auction properties</p>
        </div>
        <Button asChild>
          <Link href="/marketplace/create">
            <Plus className="mr-2 h-4 w-4" /> List Property
          </Link>
        </Button>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search by location, address, or keyword" className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-10 w-10"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-10 w-10"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-10 w-10"
                onClick={() => setViewMode("map")}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-residential" />
                  <label htmlFor="type-residential" className="text-sm">
                    Residential
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-commercial" />
                  <label htmlFor="type-commercial" className="text-sm">
                    Commercial
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-land" />
                  <label htmlFor="type-land" className="text-sm">
                    Land
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-multifamily" />
                  <label htmlFor="type-multifamily" className="text-sm">
                    Multi-Family
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="space-y-4">
                <Slider defaultValue={[200000, 800000]} min={0} max={2000000} step={10000} />
                <div className="flex items-center gap-2">
                  <Input placeholder="Min" type="number" className="h-8" />
                  <span>to</span>
                  <Input placeholder="Max" type="number" className="h-8" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bedrooms</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>

              <label className="text-sm font-medium mt-4 mb-2 block">Bathrooms</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Listing Type</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-sale" />
                  <label htmlFor="type-sale" className="text-sm">
                    For Sale
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-auction" />
                  <label htmlFor="type-auction" className="text-sm">
                    Auction
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-pending" />
                  <label htmlFor="type-pending" className="text-sm">
                    Pending
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-sold" />
                  <label htmlFor="type-sold" className="text-sm">
                    Recently Sold
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end gap-2">
              <Button variant="outline">Reset Filters</Button>
              <Button>Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="sale">For Sale</TabsTrigger>
            <TabsTrigger value="auction">Auctions</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-0">
          {viewMode === "map" ? (
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <PropertyMap />
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid-view" : "list-view"}>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <PropertyCard
                    id="1"
                    title="Modern Family Home"
                    address="123 Main Street, Phoenix, AZ 85001"
                    price="$425,000"
                    beds={4}
                    baths={3}
                    sqft={2400}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                  />
                  <PropertyCard
                    id="2"
                    title="Downtown Condo"
                    address="456 Oak Avenue, Scottsdale, AZ 85251"
                    price="$750,000"
                    beds={2}
                    baths={2}
                    sqft={1800}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                  />
                  <PropertyCard
                    id="3"
                    title="Investment Property"
                    address="789 Pine Road, Tempe, AZ 85281"
                    price="Starting Bid: $350,000"
                    beds={3}
                    baths={2}
                    sqft={2100}
                    type="auction"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    auctionEnds="Jul 15, 2023"
                  />
                  <PropertyCard
                    id="4"
                    title="Luxury Waterfront Home"
                    address="101 River Lane, Mesa, AZ 85201"
                    price="$1,250,000"
                    beds={5}
                    baths={4.5}
                    sqft={4200}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                  />
                  <PropertyCard
                    id="5"
                    title="Commercial Office Space"
                    address="222 Business Park, Chandler, AZ 85224"
                    price="Starting Bid: $850,000"
                    beds={0}
                    baths={2}
                    sqft={5000}
                    type="auction"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    auctionEnds="Jul 22, 2023"
                  />
                  <PropertyCard
                    id="6"
                    title="Fixer-Upper Opportunity"
                    address="333 Renovation Ave, Gilbert, AZ 85233"
                    price="$275,000"
                    beds={3}
                    baths={1}
                    sqft={1600}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <PropertyCard
                    id="1"
                    title="Modern Family Home"
                    address="123 Main Street, Phoenix, AZ 85001"
                    price="$425,000"
                    beds={4}
                    baths={3}
                    sqft={2400}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    description="Beautiful 4 bedroom, 3 bathroom home with modern finishes and spacious backyard. Recently renovated kitchen with stainless steel appliances and quartz countertops."
                  />
                  <PropertyCard
                    id="2"
                    title="Downtown Condo"
                    address="456 Oak Avenue, Scottsdale, AZ 85251"
                    price="$750,000"
                    beds={2}
                    baths={2}
                    sqft={1800}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    description="Luxury condo in the heart of downtown with stunning city views. Features include hardwood floors, gourmet kitchen, and private balcony."
                  />
                  <PropertyCard
                    id="3"
                    title="Investment Property"
                    address="789 Pine Road, Tempe, AZ 85281"
                    price="Starting Bid: $350,000"
                    beds={3}
                    baths={2}
                    sqft={2100}
                    type="auction"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    auctionEnds="Jul 15, 2023"
                    description="Great investment opportunity in a high-demand rental area. Currently rented for $2,200/month with long-term tenants."
                  />
                  <PropertyCard
                    id="4"
                    title="Luxury Waterfront Home"
                    address="101 River Lane, Mesa, AZ 85201"
                    price="$1,250,000"
                    beds={5}
                    baths={4.5}
                    sqft={4200}
                    type="sale"
                    image="/placeholder.svg?height=400&width=600"
                    viewMode={viewMode}
                    description="Stunning waterfront property with private dock and panoramic views. Features include a gourmet kitchen, home theater, and resort-style pool."
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More Properties</Button>
          </div>
        </TabsContent>

        <TabsContent value="sale" className="mt-0">
          {/* For Sale properties would be listed here */}
          <p className="text-muted-foreground">Showing properties for sale</p>
        </TabsContent>

        <TabsContent value="auction" className="mt-0">
          {/* Auction properties would be listed here */}
          <p className="text-muted-foreground">Showing auction properties</p>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {/* Saved properties would be listed here */}
          <p className="text-muted-foreground">Showing saved properties</p>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <CachedMarketplaceItems />
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
