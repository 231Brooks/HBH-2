"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  MapPin,
  Grid3X3,
  List,
  Map,
  Heart,
  Building,
  Plus,
  MessageSquare,
  Clock,
  DollarSign,
  User,
  Star,
  AlertCircle,
} from "lucide-react"
import { PropertyMap } from "./property-map"
import { CachedMarketplaceItems } from "./cached-items"
import { getProperties } from "../actions/property-actions"
import { getServiceRequests } from "../actions/service-request-actions"
import { PerformanceTracker } from "./performance-tracker"
import { PropertyCard } from "@/components/marketplace/property-card"
import { formatDistanceToNow } from "date-fns"
import { ServiceUrgency, ServiceRequestStatus } from "@prisma/client"
import { MarketplaceAds } from "@/components/advertising/ad-banner"

const urgencyColors = {
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

const urgencyIcons = {
  LOW: Clock,
  NORMAL: Clock,
  HIGH: AlertCircle,
  URGENT: AlertCircle,
}

export default function MarketplaceClient() {
  const [properties, setProperties] = useState<any[]>([])
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("properties")
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    minPrice: 0,
    maxPrice: 1000000,
    beds: 0,
    baths: 0,
    page: 1,
  })
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  // Reload when tab, sort, or search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData()
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [activeTab, sortBy, searchTerm])

  // Function to load data based on active tab
  const loadData = async () => {
    if (activeTab === "properties" || activeTab === "all") {
      await loadProperties()
    }
    if (activeTab === "service-requests" || activeTab === "all") {
      await loadServiceRequests()
    }
  }

  // Function to load properties with filters
  const loadProperties = async (newFilters?: any) => {
    setLoading(true)
    const currentFilters = newFilters || filters

    try {
      const searchFilters = {
        ...currentFilters,
        search: searchTerm,
        sortBy: sortBy,
        status: activeTab === "sale" ? "ACTIVE" :
                activeTab === "auction" ? "AUCTION" :
                activeTab === "saved" ? "SAVED" :
                currentFilters.status
      }

      const result = await getProperties(searchFilters)

      // Ensure we always have an array
      setProperties(Array.isArray(result?.properties) ? result.properties : [])
      setHasMore(result?.hasMore || false)
      setTotal(result?.total || 0)
    } catch (error) {
      console.error("Failed to load properties:", error)
      // Set empty array on error
      setProperties([])
      setHasMore(false)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  // Function to load service requests
  const loadServiceRequests = async () => {
    setLoading(true)
    try {
      const result = await getServiceRequests({
        location: searchTerm || undefined,
        limit: 20,
        offset: 0,
      })

      if (result.success) {
        setServiceRequests(Array.isArray(result.serviceRequests) ? result.serviceRequests : [])
      } else {
        setServiceRequests([])
      }
    } catch (error) {
      console.error("Failed to load service requests:", error)
      setServiceRequests([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    loadProperties()
  }

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      status: "",
      type: "",
      minPrice: 0,
      maxPrice: 1000000,
      beds: 0,
      baths: 0,
      page: 1,
    }
    setFilters(defaultFilters)
    setSearchTerm("")
    setSortBy("newest")
    loadProperties(defaultFilters)
  }

  // Load more properties
  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = filters.page + 1
      setFilters(prev => ({ ...prev, page: nextPage }))
      loadProperties({ ...filters, page: nextPage })
    }
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl overflow-x-hidden">
      {/* Header section with responsive design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Marketplace</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Discover properties and connect with service professionals</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/marketplace/create">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">List Property</span>
              <span className="sm:hidden">List</span>
            </Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild variant="outline">
            <Link href="/marketplace/create-request">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Request Service</span>
              <span className="sm:hidden">Request</span>
            </Link>
          </Button>
          {activeTab === "properties" && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => setViewMode("map")}>
                <MapPin className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Marketplace Ads with responsive container */}
      <div className="mb-4 sm:mb-6">
        <MarketplaceAds />
      </div>

      {/* Search and View Controls with responsive design */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by location, address, or keyword"
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 justify-center lg:justify-start">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="ml-1 sm:hidden">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="ml-1 sm:hidden">List</span>
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4" />
              <span className="ml-1 sm:hidden">Map</span>
            </Button>
          </div>
        </div>

        {/* Responsive Filters Panel - Only show for properties */}
        {showFilters && activeTab === "properties" && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Property Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger className="h-9 sm:h-10">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="LAND">Land</SelectItem>
                    <SelectItem value="MULTIFAMILY">Multi-Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs sm:text-sm font-medium mb-2 block">Price Range</label>
                <div className="space-y-2">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => setFilters({...filters, minPrice: min, maxPrice: max})}
                    min={0}
                    max={2000000}
                    step={10000}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      className="h-8 sm:h-9 text-xs sm:text-sm"
                      value={filters.minPrice || ""}
                      onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value) || 0})}
                    />
                    <span className="text-xs sm:text-sm">to</span>
                    <Input
                      placeholder="Max"
                      type="number"
                      className="h-8 sm:h-9 text-xs sm:text-sm"
                      value={filters.maxPrice || ""}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value) || 1000000})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Bedrooms</label>
                <Select value={filters.beds.toString()} onValueChange={(value) => setFilters({...filters, beds: parseInt(value) || 0})}>
                  <SelectTrigger className="h-9 sm:h-10">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Bathrooms</label>
                <Select value={filters.baths.toString()} onValueChange={(value) => setFilters({...filters, baths: parseFloat(value) || 0})}>
                  <SelectTrigger className="h-9 sm:h-10">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
              <Button className="w-full sm:w-auto" onClick={applyFilters}>Apply Filters</Button>
              <Button className="w-full sm:w-auto" variant="outline" onClick={resetFilters}>Reset</Button>
            </div>
          </div>
        )}
      </div>

      {/* Marketplace Listings with responsive design */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="properties" className="text-xs sm:text-sm">
              Properties ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="service-requests" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Service Requests</span>
              <span className="sm:hidden">Services</span> ({serviceRequests.length})
            </TabsTrigger>
          </TabsList>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
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

        <TabsContent value="properties" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 sm:h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : viewMode === "map" ? (
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border">
              <PropertyMap properties={properties} />
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid-view" : "list-view"}>
              {Array.isArray(properties) && properties.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {properties.map((property: any) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {properties.map((property: any) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-8 sm:py-12 px-4">
                  <Building className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Try adjusting your search criteria or filters.</p>
                  <Button onClick={resetFilters} variant="outline" size="sm">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {hasMore && (
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More Properties"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service-requests" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 sm:h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : serviceRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {serviceRequests.map((request: any) => (
                <ServiceRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 px-4">
              <MessageSquare className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Be the first to post a service request.</p>
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/marketplace/create-request">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request a Service
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <CachedMarketplaceItems />
      </div>

      <PerformanceTracker />
    </div>
  )
}

interface ServiceRequestCardProps {
  request: any
}

function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const UrgencyIcon = urgencyIcons[request.urgency as ServiceUrgency]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-2">{request.title}</CardTitle>
            <CardDescription className="text-sm sm:text-base line-clamp-3">{request.description}</CardDescription>
          </div>
          <Badge className={`${urgencyColors[request.urgency as ServiceUrgency]} flex-shrink-0`}>
            <UrgencyIcon className="h-3 w-3 mr-1" />
            <span className="text-xs">{request.urgency}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
          {request.budget && (
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{request.budget}</span>
            </div>
          )}
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {request.client?.image ? (
                <img src={request.client.image} alt={request.client.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
              ) : (
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium truncate">{request.client?.name || "Anonymous"}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400 flex-shrink-0" />
                <span className="truncate">{request.client?.rating?.toFixed(1) || "New"} ({request.client?.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {request.responses?.length || 0} responses
            </span>
            <Button size="sm" className="w-full sm:w-auto" asChild>
              <Link href={`/service-requests/${request.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
