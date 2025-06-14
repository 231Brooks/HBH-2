"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowUpRight,
  Camera,
  Home,
  FileText,
  Paintbrush,
  Truck,
  PenToolIcon as Tool,
  PiggyBank,
  Briefcase,
  Plus,
  Grid3X3,
  List,
  Loader2,
  Calendar,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServices } from "../actions/service-actions"
import { QuickContactButton } from "@/components/contact-dialog"
import { ServiceBookingDialog } from "@/components/service-booking-dialog"
import { ServicesAds } from "@/components/advertising/ad-banner"

interface Service {
  id: string
  name: string
  description?: string
  category: string
  price?: string
  hourlyRate?: number
  location?: string
  image?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  provider: {
    id: string
    name: string
    image?: string
    rating?: number
    reviewCount: number
  }
  reviews: any[]
}

const serviceCategories = [
  { value: "ALL", label: "All Categories", icon: <Briefcase className="h-5 w-5" /> },
  { value: "TITLE_SERVICES", label: "Title Services", icon: <FileText className="h-5 w-5" /> },
  { value: "HOME_INSPECTION", label: "Home Inspection", icon: <Home className="h-5 w-5" /> },
  { value: "PHOTOGRAPHY", label: "Photography", icon: <Camera className="h-5 w-5" /> },
  { value: "CONTRACTORS", label: "Contractors", icon: <Tool className="h-5 w-5" /> },
  { value: "LEGAL_SERVICES", label: "Legal Services", icon: <Briefcase className="h-5 w-5" /> },
  { value: "MORTGAGE", label: "Mortgage", icon: <PiggyBank className="h-5 w-5" /> },
  { value: "INTERIOR_DESIGN", label: "Interior Design", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "MOVING_SERVICES", label: "Moving Services", icon: <Truck className="h-5 w-5" /> },
]

export default function ServicesClient() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Load services
  useEffect(() => {
    loadServices()
  }, [])

  // Reload when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadServices()
    }, 500) // Debounce search
    
    return () => clearTimeout(timeoutId)
  }, [selectedCategory, sortBy, searchTerm, activeTab])

  const loadServices = async () => {
    setLoading(true)
    try {
      const filters = {
        category: selectedCategory && selectedCategory !== "ALL" ? selectedCategory : undefined,
        verified: activeTab === "verified" ? true : undefined,
        location: searchTerm || undefined,
        limit: 12,
        offset: 0,
      }
      
      const result = await getServices(filters)
      setServices(Array.isArray(result?.services) ? result.services : [])
      setTotal(result?.total || 0)
      setHasMore(result?.hasMore || false)
    } catch (error) {
      console.error("Failed to load services:", error)
      setServices([])
      setTotal(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore || loading) return
    
    try {
      const filters = {
        category: selectedCategory && selectedCategory !== "ALL" ? selectedCategory : undefined,
        verified: activeTab === "verified" ? true : undefined,
        location: searchTerm || undefined,
        limit: 12,
        offset: services.length,
      }
      
      const result = await getServices(filters)
      if (result?.services) {
        setServices(prev => [...prev, ...result.services])
        setHasMore(result.hasMore || false)
      }
    } catch (error) {
      console.error("Failed to load more services:", error)
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("ALL")
    setSortBy("newest")
    setActiveTab("all")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Third Party Services</h1>
          <p className="text-muted-foreground">Find and hire trusted professionals for all your real estate needs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/services/create">
              <Plus className="mr-2 h-4 w-4" /> List Your Service
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for services or professionals" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Ads */}
      <div className="mb-8">
        <ServicesAds />
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
        {serviceCategories.slice(1).map((category, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(category.value)}
            className={`p-4 rounded-lg border transition-all hover:shadow-md hover:border-slate-300 ${
              selectedCategory === category.value ? 'border-primary bg-primary/5' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${
                selectedCategory === category.value ? 'bg-primary/10' : 'bg-slate-100'
              }`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-sm">{category.label}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Services Tabs and Listings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Services ({total})</TabsTrigger>
            <TabsTrigger value="verified">Verified Only</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {Array.isArray(services) && services.length > 0 ? (
                <div className={viewMode === "grid" ? 
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
                  "space-y-4"
                }>
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
                  <Button onClick={resetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              )}

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" onClick={loadMore} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Services"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verified services will be shown here</h3>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-0">
          <div className="text-center py-12">
            <Star className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Featured services will be shown here</h3>
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="mt-0">
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nearby services will be shown here</h3>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-16 bg-primary/5 rounded-lg p-8 border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Are You a Service Provider?</h2>
          <p className="text-muted-foreground mb-6">
            Join our marketplace to connect with clients, showcase your expertise, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/services/create">List Your Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  viewMode: "grid" | "list"
}

function ServiceCard({ service, viewMode }: ServiceCardProps) {
  const averageRating = service.provider.rating || 0
  const reviewCount = service.provider.reviewCount || 0
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      viewMode === "list" ? "flex flex-row" : ""
    }`}>
      <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "h-full" : "h-48"}`}>
          <Image 
            src={service.image || "/placeholder.svg?height=300&width=300"} 
            alt={service.name} 
            fill 
            className="object-cover" 
          />
          <Badge className="absolute top-2 right-2 bg-primary">
            {serviceCategories.find(cat => cat.value === service.category)?.label || service.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{service.name}</h3>
            {service.verified && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{service.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{service.price || (service.hourlyRate ? `$${service.hourlyRate}/hr` : "Custom")}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description || "Professional service provider"}
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/services/${service.id}`}>
              <ArrowUpRight className="mr-1 h-4 w-4" /> Details
            </Link>
          </Button>
          <ServiceBookingDialog service={service}>
            <Button className="flex-1">
              <Calendar className="mr-1 h-4 w-4" /> Book
            </Button>
          </ServiceBookingDialog>
        </div>

        <div className="mt-2">
          <QuickContactButton
            contactId={service.provider.id}
            contactName={service.provider.name || "Service Provider"}
            contactAvatar={service.provider.image}
            contactType="professional"
            contextType="service"
            contextId={service.id}
            contextTitle={service.name}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <MessageSquare className="mr-1 h-4 w-4" /> Message
          </QuickContactButton>
        </div>
      </CardContent>
    </Card>
  )
}
