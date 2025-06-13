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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Marketplace</h1>
          <p className="text-muted-foreground">Discover properties and connect with service professionals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/marketplace/create">
              <Plus className="mr-2 h-4 w-4" />
              List Property
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/marketplace/create-request">
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Service
            </Link>
          </Button>
          {activeTab === "properties" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode("map")}>
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Marketplace Ads */}
      <div className="mb-6">
        <MarketplaceAds />
      </div>

      {/* Search and View Controls */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by location, address, or keyword"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel - Only show for properties */}
        {showFilters && activeTab === "properties" && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
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
                      className="h-8"
                      value={filters.minPrice || ""}
                      onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value) || 0})}
                    />
                    <span>to</span>
                    <Input 
                      placeholder="Max" 
                      type="number" 
                      className="h-8"
                      value={filters.maxPrice || ""}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value) || 1000000})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                <Select value={filters.beds.toString()} onValueChange={(value) => setFilters({...filters, beds: parseInt(value) || 0})}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                <Select value={filters.baths.toString()} onValueChange={(value) => setFilters({...filters, baths: parseFloat(value) || 0})}>
                  <SelectTrigger>
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

            <div className="flex gap-2 mt-4">
              <Button onClick={applyFilters}>Apply Filters</Button>
              <Button variant="outline" onClick={resetFilters}>Reset</Button>
            </div>
          </div>
        )}
      </div>

      {/* Marketplace Listings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="properties">Properties ({properties.length})</TabsTrigger>
            <TabsTrigger value="service-requests">Service Requests ({serviceRequests.length})</TabsTrigger>
          </TabsList>
          <Select value={sortBy} onValueChange={setSortBy}>
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

        <TabsContent value="properties" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : viewMode === "map" ? (
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <PropertyMap properties={properties} />
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid-view" : "list-view"}>
              {Array.isArray(properties) && properties.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
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
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
                  <Button onClick={resetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More Properties"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service-requests" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : serviceRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {serviceRequests.map((request: any) => (
                <ServiceRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
              <p className="text-gray-500 mb-4">Be the first to post a service request.</p>
              <Button asChild>
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
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
            <CardDescription className="text-base">{request.description}</CardDescription>
          </div>
          <Badge className={urgencyColors[request.urgency as ServiceUrgency]}>
            <UrgencyIcon className="h-3 w-3 mr-1" />
            {request.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {request.location}
          </div>
          {request.budget && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              {request.budget}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {request.client?.image ? (
                <img src={request.client.image} alt={request.client.name} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{request.client?.name || "Anonymous"}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                {request.client?.rating?.toFixed(1) || "New"} ({request.client?.reviewCount || 0} reviews)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {request.responses?.length || 0} responses
            </span>
            <Button asChild>
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
