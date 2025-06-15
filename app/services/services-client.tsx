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
  // Property & Building Services
  { value: "PLUMBING", label: "Plumbing", icon: <Tool className="h-5 w-5" /> },
  { value: "ELECTRICAL", label: "Electrical", icon: <Tool className="h-5 w-5" /> },
  { value: "HVAC", label: "HVAC", icon: <Tool className="h-5 w-5" /> },
  { value: "ROOFING", label: "Roofing", icon: <Home className="h-5 w-5" /> },
  { value: "SIDING", label: "Siding", icon: <Home className="h-5 w-5" /> },
  { value: "WINDOWS_DOORS", label: "Windows & Doors", icon: <Home className="h-5 w-5" /> },
  { value: "INSULATION", label: "Insulation", icon: <Home className="h-5 w-5" /> },
  { value: "FLOORING_INSTALLATION", label: "Flooring Installation", icon: <Home className="h-5 w-5" /> },
  { value: "CARPET_INSTALLATION", label: "Carpet Installation", icon: <Home className="h-5 w-5" /> },
  { value: "TILE_GROUT", label: "Tile & Grout Services", icon: <Home className="h-5 w-5" /> },
  { value: "FOUNDATION_REPAIR", label: "Foundation Repair", icon: <Tool className="h-5 w-5" /> },
  { value: "DRYWALL", label: "Drywall Installation & Repair", icon: <Tool className="h-5 w-5" /> },
  { value: "MASONRY_CONCRETE", label: "Masonry & Concrete", icon: <Tool className="h-5 w-5" /> },
  { value: "FRAMING_STRUCTURAL", label: "Framing & Structural Work", icon: <Tool className="h-5 w-5" /> },
  { value: "WATERPROOFING", label: "Waterproofing", icon: <Tool className="h-5 w-5" /> },
  { value: "CHIMNEY", label: "Chimney Cleaning & Repair", icon: <Home className="h-5 w-5" /> },
  { value: "GUTTER", label: "Gutter Installation & Cleaning", icon: <Home className="h-5 w-5" /> },
  // Maintenance & Repair
  { value: "APPLIANCE_REPAIR", label: "Appliance Repair", icon: <Tool className="h-5 w-5" /> },
  { value: "HANDYMAN", label: "General Handyman Services", icon: <Tool className="h-5 w-5" /> },
  { value: "PEST_CONTROL", label: "Pest Control", icon: <Tool className="h-5 w-5" /> },
  { value: "MOLD_REMEDIATION", label: "Mold Remediation", icon: <Tool className="h-5 w-5" /> },
  { value: "PROPERTY_CLEANING", label: "Property Cleaning", icon: <Tool className="h-5 w-5" /> },
  { value: "PRESSURE_WASHING", label: "Pressure Washing", icon: <Tool className="h-5 w-5" /> },
  { value: "POOL_SPA", label: "Pool & Spa Maintenance", icon: <Tool className="h-5 w-5" /> },
  { value: "SEPTIC_TANK", label: "Septic Tank Services", icon: <Tool className="h-5 w-5" /> },
  { value: "LOCKSMITH", label: "Locksmith Services", icon: <Tool className="h-5 w-5" /> },
  { value: "FURNACE_REPAIR", label: "Furnace Repair", icon: <Tool className="h-5 w-5" /> },
  { value: "WATER_HEATER", label: "Water Heater Installation", icon: <Tool className="h-5 w-5" /> },
  { value: "GARAGE_DOOR", label: "Garage Door Installation & Repair", icon: <Tool className="h-5 w-5" /> },
  // Interior & Exterior Design
  { value: "INTERIOR_DESIGN", label: "Interior Design", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "EXTERIOR_DESIGN", label: "Exterior Design", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "HOME_STAGING", label: "Home Staging", icon: <Home className="h-5 w-5" /> },
  { value: "PAINTING_INTERIOR", label: "Painting (Interior)", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "PAINTING_EXTERIOR", label: "Painting (Exterior)", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "WALLPAPER", label: "Wallpaper Installation", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "LIGHTING_DESIGN", label: "Lighting Design & Installation", icon: <Paintbrush className="h-5 w-5" /> },
  { value: "CABINETRY_COUNTERTOPS", label: "Cabinetry & Countertops", icon: <Tool className="h-5 w-5" /> },
  { value: "SMART_HOME", label: "Smart Home Design & Integration", icon: <Tool className="h-5 w-5" /> },
  { value: "CLOSET_STORAGE", label: "Closet & Storage Design", icon: <Home className="h-5 w-5" /> },
  // Outdoor & Landscaping
  { value: "LANDSCAPING", label: "Landscaping", icon: <Tool className="h-5 w-5" /> },
  { value: "LAWN_CARE", label: "Lawn Care & Sod Installation", icon: <Tool className="h-5 w-5" /> },
  { value: "TREE_SERVICES", label: "Tree Trimming & Removal", icon: <Tool className="h-5 w-5" /> },
  { value: "IRRIGATION", label: "Irrigation Systems", icon: <Tool className="h-5 w-5" /> },
  { value: "FENCE", label: "Fence Installation & Repair", icon: <Tool className="h-5 w-5" /> },
  { value: "DECK_PATIO", label: "Deck & Patio Construction", icon: <Tool className="h-5 w-5" /> },
  { value: "OUTDOOR_KITCHEN", label: "Outdoor Kitchen/BBQ Design", icon: <Tool className="h-5 w-5" /> },
  { value: "DRIVEWAY_PAVING", label: "Driveway Paving", icon: <Tool className="h-5 w-5" /> },
  { value: "RETAINING_WALLS", label: "Retaining Walls", icon: <Tool className="h-5 w-5" /> },
  { value: "OUTDOOR_LIGHTING", label: "Outdoor Lighting", icon: <Tool className="h-5 w-5" /> },
  // Construction & Renovation
  { value: "GENERAL_CONTRACTING", label: "General Contracting", icon: <Tool className="h-5 w-5" /> },
  { value: "KITCHEN_REMODELING", label: "Kitchen Remodeling", icon: <Home className="h-5 w-5" /> },
  { value: "BATHROOM_REMODELING", label: "Bathroom Remodeling", icon: <Home className="h-5 w-5" /> },
  { value: "BASEMENT_FINISHING", label: "Basement Finishing", icon: <Home className="h-5 w-5" /> },
  { value: "ROOM_ADDITIONS", label: "Room Additions", icon: <Home className="h-5 w-5" /> },
  { value: "ADU_BUILDS", label: "ADU (Accessory Dwelling Unit) Builds", icon: <Home className="h-5 w-5" /> },
  { value: "DEMOLITION", label: "Demolition Services", icon: <Tool className="h-5 w-5" /> },
  // Inspections & Assessments
  { value: "HOME_INSPECTION", label: "Home Inspection", icon: <FileText className="h-5 w-5" /> },
  { value: "TERMITE_INSPECTION", label: "Termite Inspection", icon: <FileText className="h-5 w-5" /> },
  { value: "ROOF_INSPECTION", label: "Roof Inspection", icon: <FileText className="h-5 w-5" /> },
  { value: "HVAC_INSPECTION", label: "HVAC Inspection", icon: <FileText className="h-5 w-5" /> },
  { value: "SEWER_INSPECTION", label: "Sewer Line Inspection", icon: <FileText className="h-5 w-5" /> },
  { value: "STRUCTURAL_ENGINEERING", label: "Structural Engineering Reports", icon: <FileText className="h-5 w-5" /> },
  { value: "ENERGY_ASSESSMENT", label: "Energy Efficiency Assessment", icon: <FileText className="h-5 w-5" /> },
  { value: "APPRAISAL", label: "Appraisal Services", icon: <FileText className="h-5 w-5" /> },
  { value: "ENVIRONMENTAL_TESTING", label: "Environmental Testing", icon: <FileText className="h-5 w-5" /> },
  // Legal, Closing & Administrative
  { value: "NOTARY", label: "Notary Services", icon: <FileText className="h-5 w-5" /> },
  { value: "TITLE_SERVICES", label: "Title Search & Title Insurance", icon: <FileText className="h-5 w-5" /> },
  { value: "ESCROW", label: "Escrow Services", icon: <FileText className="h-5 w-5" /> },
  { value: "DEED_PREPARATION", label: "Deed Preparation", icon: <FileText className="h-5 w-5" /> },
  { value: "LEGAL_CONSULTING", label: "Real Estate Legal Consulting", icon: <Briefcase className="h-5 w-5" /> },
  { value: "LIEN_SERVICES", label: "Lien Searches & Resolution", icon: <FileText className="h-5 w-5" /> },
  { value: "PERMIT_FILING", label: "Permit Filing", icon: <FileText className="h-5 w-5" /> },
  { value: "ZONING_COMPLIANCE", label: "Zoning & Code Compliance", icon: <FileText className="h-5 w-5" /> },
  { value: "CONTRACT_SERVICES", label: "Contract Drafting & Review", icon: <FileText className="h-5 w-5" /> },
  // Transaction & Listing Support
  { value: "PHOTOGRAPHY", label: "Real Estate Photography", icon: <Camera className="h-5 w-5" /> },
  { value: "DRONE_PHOTOGRAPHY", label: "Drone Photography", icon: <Camera className="h-5 w-5" /> },
  { value: "VIRTUAL_TOURS", label: "3D Virtual Tours", icon: <Camera className="h-5 w-5" /> },
  { value: "MLS_LISTING", label: "MLS Listing Services", icon: <FileText className="h-5 w-5" /> },
  { value: "PROPERTY_MARKETING", label: "Property Marketing", icon: <Briefcase className="h-5 w-5" /> },
  { value: "SIGNAGE", label: "Signage Installation", icon: <Tool className="h-5 w-5" /> },
  { value: "OPEN_HOUSE", label: "Open House Setup", icon: <Home className="h-5 w-5" /> },
  { value: "LEAD_GENERATION", label: "Lead Generation & CRM Setup", icon: <Briefcase className="h-5 w-5" /> },
  { value: "COPYWRITING", label: "Real Estate Copywriting", icon: <FileText className="h-5 w-5" /> },
  { value: "MARKET_ANALYSIS", label: "Comparative Market Analysis (CMA)", icon: <FileText className="h-5 w-5" /> },
  { value: "VIRTUAL_STAGING", label: "Virtual Staging", icon: <Camera className="h-5 w-5" /> },
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
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl overflow-x-hidden">
      {/* Header section with responsive design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Third Party Services</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Find and hire trusted professionals for all your real estate needs</p>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button className="w-full lg:w-auto" asChild>
            <Link href="/services/create">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">List Your Service</span>
              <span className="sm:hidden">List Service</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters with responsive design */}
      <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for services or professionals"
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-1 w-full sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <div className="flex items-center gap-2 justify-center">
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
            </div>
          </div>
        </div>

        {/* Advanced Filters with responsive design */}
        {showFilters && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 border rounded-lg bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 sm:h-10">
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
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Ads with responsive container */}
      <div className="mb-6 sm:mb-8">
        <ServicesAds />
      </div>

      {/* Service Categories with responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {serviceCategories.slice(1).map((category, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(category.value)}
            className={`p-3 sm:p-4 rounded-lg border transition-all hover:shadow-md hover:border-slate-300 ${
              selectedCategory === category.value ? 'border-primary bg-primary/5' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 ${
                selectedCategory === category.value ? 'bg-primary/10' : 'bg-slate-100'
              }`}>
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  {category.icon}
                </div>
              </div>
              <h3 className="font-medium text-xs sm:text-sm leading-tight">{category.label}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Services Tabs and Listings with responsive design */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm whitespace-nowrap">
              All Services ({total})
            </TabsTrigger>
            <TabsTrigger value="verified" className="text-xs sm:text-sm whitespace-nowrap">
              Verified Only
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm whitespace-nowrap">
              Featured
            </TabsTrigger>
            <TabsTrigger value="nearby" className="text-xs sm:text-sm whitespace-nowrap">
              Nearby
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 sm:h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {Array.isArray(services) && services.length > 0 ? (
                <div className={viewMode === "grid" ?
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" :
                  "space-y-3 sm:space-y-4"
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
                <div className="text-center py-8 sm:py-12 px-4">
                  <Briefcase className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No services found</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Try adjusting your search criteria or filters.</p>
                  <Button onClick={resetFilters} variant="outline" size="sm">
                    Reset Filters
                  </Button>
                </div>
              )}

              {hasMore && (
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={loadMore} disabled={loading}>
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
    <Card className={`overflow-hidden transition-all hover:shadow-md h-full flex flex-col ${
      viewMode === "list" ? "sm:flex-row" : ""
    }`}>
      <CardHeader className={`p-0 ${viewMode === "list" ? "sm:w-48 sm:flex-shrink-0" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "h-48 sm:h-full" : "h-40 sm:h-48"}`}>
          <Image
            src={service.image || "/placeholder.svg?height=300&width=300"}
            alt={service.name}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-xs">
            <span className="hidden sm:inline">
              {serviceCategories.find(cat => cat.value === service.category)?.label || service.category}
            </span>
            <span className="sm:hidden">
              {(serviceCategories.find(cat => cat.value === service.category)?.label || service.category).slice(0, 8)}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`p-3 sm:p-4 flex-1 flex flex-col ${viewMode === "list" ? "sm:flex-1" : ""}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{service.name}</h3>
            {service.verified && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200 flex-shrink-0">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{service.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{service.price || (service.hourlyRate ? `$${service.hourlyRate}/hr` : "Custom")}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">{averageRating.toFixed(1)}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">({reviewCount} reviews)</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {service.description || "Professional service provider"}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button variant="outline" className="flex-1 text-xs sm:text-sm" size="sm" asChild>
            <Link href={`/services/${service.id}`}>
              <ArrowUpRight className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Details
            </Link>
          </Button>
          <ServiceBookingDialog service={service}>
            <Button className="flex-1 text-xs sm:text-sm" size="sm">
              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Book
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
            className="w-full text-xs sm:text-sm"
          >
            <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Message
          </QuickContactButton>
        </div>
      </CardContent>
    </Card>
  )
}
