"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Star,
  Users,
  Clock
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useSupabase } from "@/contexts/supabase-context"

function MyServicesContent() {
  const router = useRouter()
  const { user } = useSupabase()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadUserServices()
  }, [user])

  const loadUserServices = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // TODO: Replace with actual API call to get user's services
      // For now, using mock data
      const mockServices = [
        {
          id: "1",
          title: "Professional Home Inspection",
          description: "Comprehensive home inspection services for buyers and sellers",
          category: "HOME_INSPECTION",
          price: 450,
          priceType: "FIXED",
          status: "ACTIVE",
          location: "Phoenix, AZ",
          rating: 4.8,
          reviewCount: 24,
          completedJobs: 156,
          responseTime: "2 hours",
          createdAt: new Date("2024-01-10"),
          bookings: 8,
          inquiries: 15
        },
        {
          id: "2",
          title: "Real Estate Photography",
          description: "Professional photography and virtual tours for property listings",
          category: "PHOTOGRAPHY",
          price: 75,
          priceType: "HOURLY",
          status: "ACTIVE",
          location: "Scottsdale, AZ",
          rating: 5.0,
          reviewCount: 18,
          completedJobs: 89,
          responseTime: "1 hour",
          createdAt: new Date("2024-02-05"),
          bookings: 12,
          inquiries: 22
        },
        {
          id: "3",
          title: "Title Services",
          description: "Complete title search and insurance services",
          category: "TITLE_SERVICES",
          price: 850,
          priceType: "FIXED",
          status: "PAUSED",
          location: "Tempe, AZ",
          rating: 4.9,
          reviewCount: 31,
          completedJobs: 203,
          responseTime: "4 hours",
          createdAt: new Date("2023-12-15"),
          bookings: 3,
          inquiries: 7
        }
      ]
      setServices(mockServices)
    } catch (error) {
      console.error("Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800"
      case "paused": return "bg-yellow-100 text-yellow-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "HOURLY") {
      return `$${price}/hour`
    }
    return `$${price.toLocaleString()}`
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "HOME_INSPECTION": return "Home Inspection"
      case "PHOTOGRAPHY": return "Photography"
      case "TITLE_SERVICES": return "Title Services"
      case "LEGAL": return "Legal Services"
      case "APPRAISAL": return "Appraisal"
      default: return category
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Services</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/services/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{getCategoryLabel(service.category)}</Badge>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(service.price, service.priceType)}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-muted-foreground">({service.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {service.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {service.completedJobs} completed
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.responseTime} response
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {service.bookings} bookings
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {service.inquiries} inquiries
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/services/${service.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/services/${service.id}/edit`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't created any services yet"}
          </p>
          <Button asChild>
            <Link href="/services/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Service
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default function MyServicesPage() {
  return (
    <ProtectedRoute>
      <MyServicesContent />
    </ProtectedRoute>
  )
}
