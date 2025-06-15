"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Upload,
  Download,
  FileText,
  Image,
  Video,
  File,
  Plus,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function DeliverablesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newDeliverable, setNewDeliverable] = useState({
    title: "",
    description: "",
    type: "",
    file: null as File | null
  })

  useEffect(() => {
    loadDeliverables()
  }, [params.id])

  const loadDeliverables = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockProject = {
        id: params.id,
        title: "Kitchen Renovation - 123 Main St"
      }

      const mockDeliverables = [
        {
          id: 1,
          title: "Initial Design Plans",
          description: "Detailed kitchen layout and design specifications",
          type: "DOCUMENT",
          status: "APPROVED",
          fileUrl: "/documents/design-plans.pdf",
          fileName: "kitchen-design-plans.pdf",
          fileSize: "2.4 MB",
          uploadedBy: "Lisa Chen",
          uploadedAt: new Date("2024-01-18"),
          approvedBy: "John Smith",
          approvedAt: new Date("2024-01-20")
        },
        {
          id: 2,
          title: "Before Photos",
          description: "Photos of kitchen before renovation",
          type: "IMAGE",
          status: "APPROVED",
          fileUrl: "/images/before-photos.zip",
          fileName: "before-photos.zip",
          fileSize: "15.2 MB",
          uploadedBy: "Mike Johnson",
          uploadedAt: new Date("2024-01-16"),
          approvedBy: "John Smith",
          approvedAt: new Date("2024-01-17")
        },
        {
          id: 3,
          title: "Electrical Inspection Report",
          description: "Electrical work inspection and certification",
          type: "DOCUMENT",
          status: "PENDING_REVIEW",
          fileUrl: "/documents/electrical-inspection.pdf",
          fileName: "electrical-inspection-report.pdf",
          fileSize: "1.8 MB",
          uploadedBy: "Tom Wilson",
          uploadedAt: new Date("2024-02-03"),
          approvedBy: null,
          approvedAt: null
        },
        {
          id: 4,
          title: "Progress Video - Week 4",
          description: "Weekly progress video showing current state",
          type: "VIDEO",
          status: "APPROVED",
          fileUrl: "/videos/progress-week4.mp4",
          fileName: "progress-week4.mp4",
          fileSize: "45.6 MB",
          uploadedBy: "Mike Johnson",
          uploadedAt: new Date("2024-02-01"),
          approvedBy: "John Smith",
          approvedAt: new Date("2024-02-02")
        },
        {
          id: 5,
          title: "Material Receipts",
          description: "Receipts for all materials purchased",
          type: "DOCUMENT",
          status: "DRAFT",
          fileUrl: null,
          fileName: null,
          fileSize: null,
          uploadedBy: "Mike Johnson",
          uploadedAt: new Date("2024-02-05"),
          approvedBy: null,
          approvedAt: null
        }
      ]
      
      setProject(mockProject)
      setDeliverables(mockDeliverables)
    } catch (error) {
      console.error("Failed to load deliverables:", error)
      toast({
        title: "Error",
        description: "Failed to load deliverables",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!newDeliverable.title || !newDeliverable.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      // TODO: Replace with actual file upload and API call
      const deliverable = {
        id: Date.now(),
        title: newDeliverable.title,
        description: newDeliverable.description,
        type: newDeliverable.type,
        status: "DRAFT",
        fileUrl: newDeliverable.file ? URL.createObjectURL(newDeliverable.file) : null,
        fileName: newDeliverable.file?.name || null,
        fileSize: newDeliverable.file ? `${(newDeliverable.file.size / 1024 / 1024).toFixed(1)} MB` : null,
        uploadedBy: "Current User",
        uploadedAt: new Date(),
        approvedBy: null,
        approvedAt: null
      }

      setDeliverables(prev => [deliverable, ...prev])
      setNewDeliverable({ title: "", description: "", type: "", file: null })
      setShowUploadDialog(false)
      
      toast({
        title: "Success",
        description: "Deliverable uploaded successfully"
      })
    } catch (error) {
      console.error("Failed to upload deliverable:", error)
      toast({
        title: "Error",
        description: "Failed to upload deliverable",
        variant: "destructive"
      })
    }
  }

  const deleteDeliverable = (id: number) => {
    setDeliverables(prev => prev.filter(d => d.id !== id))
    toast({
      title: "Success",
      description: "Deliverable deleted"
    })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "IMAGE": return <Image className="h-5 w-5" />
      case "VIDEO": return <Video className="h-5 w-5" />
      case "DOCUMENT": return <FileText className="h-5 w-5" />
      default: return <File className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-600"
      case "PENDING_REVIEW": return "bg-yellow-500"
      case "DRAFT": return "bg-gray-500"
      case "REJECTED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED": return "Approved"
      case "PENDING_REVIEW": return "Pending Review"
      case "DRAFT": return "Draft"
      case "REJECTED": return "Rejected"
      default: return status
    }
  }

  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || deliverable.type === filterType
    const matchesStatus = filterStatus === "all" || deliverable.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

  if (!project) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
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
      <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/progress/${params.id}/details`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Project Deliverables</h1>
              <p className="text-muted-foreground">{project.title}</p>
            </div>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Deliverable</DialogTitle>
                <DialogDescription>Add a new deliverable to this project</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newDeliverable.title}
                    onChange={(e) => setNewDeliverable(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter deliverable title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={newDeliverable.type} onValueChange={(value) => setNewDeliverable(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOCUMENT">Document</SelectItem>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDeliverable.description}
                    onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the deliverable"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setNewDeliverable(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deliverables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DOCUMENT">Documents</SelectItem>
                  <SelectItem value="IMAGE">Images</SelectItem>
                  <SelectItem value="VIDEO">Videos</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Deliverables List */}
        <div className="space-y-4">
          {filteredDeliverables.length > 0 ? (
            filteredDeliverables.map((deliverable) => (
              <Card key={deliverable.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {getFileIcon(deliverable.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{deliverable.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{deliverable.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {deliverable.uploadedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(deliverable.uploadedAt)}
                            </div>
                            {deliverable.fileSize && (
                              <span>{deliverable.fileSize}</span>
                            )}
                          </div>
                          {deliverable.approvedBy && deliverable.approvedAt && (
                            <div className="text-sm text-green-600 mt-1">
                              Approved by {deliverable.approvedBy} on {formatDate(deliverable.approvedAt)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(deliverable.status)} text-white`}>
                            {getStatusLabel(deliverable.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {deliverable.fileUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={deliverable.fileUrl} download={deliverable.fileName}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDeliverable(deliverable.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deliverables found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "No deliverables match your current filters."
                    : "Upload your first deliverable to get started."
                  }
                </p>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Deliverable
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
