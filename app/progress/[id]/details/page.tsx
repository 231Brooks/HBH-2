"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  MessageSquare,
  Upload,
  Download,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Star,
  Briefcase
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ServiceProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjectDetails()
  }, [params.id])

  const loadProjectDetails = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call to get service project details
      // For now, using mock data
      const mockProject = {
        id: params.id,
        title: "Kitchen Renovation - 123 Main St",
        description: "Complete kitchen remodeling including cabinets, countertops, flooring, and appliances",
        category: "KITCHEN_REMODELING",
        status: "IN_PROGRESS",
        progress: 65,
        startDate: new Date("2024-01-15"),
        estimatedEndDate: new Date("2024-03-15"),
        budget: 25000,
        actualCost: 16250,
        client: {
          id: "client-1",
          name: "John & Sarah Smith",
          email: "john.smith@email.com",
          phone: "(555) 123-4567",
          image: "/placeholder.svg?height=40&width=40",
          rating: 4.8,
          reviewCount: 12
        },
        property: {
          address: "123 Main Street",
          city: "Springfield",
          state: "IL",
          zipCode: "62701"
        },
        milestones: [
          { id: 1, title: "Design Approval", status: "COMPLETED", dueDate: new Date("2024-01-20"), completedDate: new Date("2024-01-18") },
          { id: 2, title: "Demolition", status: "COMPLETED", dueDate: new Date("2024-01-25"), completedDate: new Date("2024-01-24") },
          { id: 3, title: "Electrical & Plumbing", status: "COMPLETED", dueDate: new Date("2024-02-05"), completedDate: new Date("2024-02-03") },
          { id: 4, title: "Drywall & Painting", status: "IN_PROGRESS", dueDate: new Date("2024-02-15"), completedDate: null },
          { id: 5, title: "Cabinet Installation", status: "PENDING", dueDate: new Date("2024-02-25"), completedDate: null },
          { id: 6, title: "Countertop Installation", status: "PENDING", dueDate: new Date("2024-03-05"), completedDate: null },
          { id: 7, title: "Final Inspection", status: "PENDING", dueDate: new Date("2024-03-15"), completedDate: null }
        ],
        team: [
          { id: 1, name: "Mike Johnson", role: "Project Manager", phone: "(555) 234-5678", email: "mike@contractor.com" },
          { id: 2, name: "Lisa Chen", role: "Designer", phone: "(555) 345-6789", email: "lisa@design.com" },
          { id: 3, name: "Tom Wilson", role: "Electrician", phone: "(555) 456-7890", email: "tom@electric.com" }
        ],
        recentActivity: [
          { id: 1, type: "milestone", description: "Electrical & Plumbing completed", date: new Date("2024-02-03") },
          { id: 2, type: "message", description: "Client approved paint colors", date: new Date("2024-02-02") },
          { id: 3, type: "update", description: "Progress updated to 65%", date: new Date("2024-02-01") }
        ]
      }
      
      setProject(mockProject)
    } catch (error) {
      console.error("Failed to load project details:", error)
      setError("Failed to load project details")
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-amber-500"
      case "PENDING": return "bg-blue-500"
      case "COMPLETED": return "bg-green-600"
      case "CANCELLED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "In Progress"
      case "PENDING": return "Pending"
      case "COMPLETED": return "Completed"
      case "CANCELLED": return "Cancelled"
      default: return status
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

  if (error || !project) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested project could not be found."}</p>
          <Button asChild>
            <Link href="/progress">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Progress
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/progress">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
              <p className="text-muted-foreground">
                {project.property.address}, {project.property.city}, {project.property.state}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/progress/${project.id}/update-progress`}>
                <Edit className="mr-2 h-4 w-4" />
                Update Progress
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/messages`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Client
              </Link>
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{formatPrice(project.budget)}</div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatPrice(project.actualCost)}</div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatDate(project.startDate)}</div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatDate(project.estimatedEndDate)}</div>
                    <div className="text-sm text-muted-foreground">Est. Completion</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {getStatusLabel(project.status)}
                </Badge>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium">{project.client.name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {project.client.rating} ({project.client.reviewCount} reviews)
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{project.client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{project.client.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track progress through key project phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {formatDate(milestone.dueDate)}
                          {milestone.completedDate && (
                            <span className="ml-2 text-green-600">
                              • Completed: {formatDate(milestone.completedDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={milestone.status === "COMPLETED" ? "default" : "secondary"}>
                        {getStatusLabel(milestone.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Team members working on this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.team.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${member.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${member.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes to the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="font-medium">{activity.description}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(activity.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
                <CardDescription>Contracts, plans, and deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-500 mb-4">Upload project documents and deliverables here.</p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
