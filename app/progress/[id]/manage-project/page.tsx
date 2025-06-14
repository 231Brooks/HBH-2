"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Settings,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  Mail,
  Phone,
  MessageSquare,
  Upload,
  Download
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ManageProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("settings")

  // Project settings state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [estimatedEndDate, setEstimatedEndDate] = useState("")

  // Team management state
  const [team, setTeam] = useState<any[]>([])
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: ""
  })
  const [showAddTeamMember, setShowAddTeamMember] = useState(false)

  // Contract management state
  const [contracts, setContracts] = useState<any[]>([])

  useEffect(() => {
    loadProject()
  }, [params.id])

  const loadProject = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockProject = {
        id: params.id,
        title: "Kitchen Renovation - 123 Main St",
        description: "Complete kitchen remodeling including cabinets, countertops, flooring, and appliances",
        budget: 25000,
        estimatedEndDate: "2024-03-15",
        team: [
          { id: 1, name: "Mike Johnson", role: "Project Manager", email: "mike@contractor.com", phone: "(555) 234-5678" },
          { id: 2, name: "Lisa Chen", role: "Designer", email: "lisa@design.com", phone: "(555) 345-6789" },
          { id: 3, name: "Tom Wilson", role: "Electrician", email: "tom@electric.com", phone: "(555) 456-7890" }
        ],
        contracts: [
          { id: 1, name: "Main Contract", type: "PRIMARY", status: "SIGNED", amount: 25000, signedDate: "2024-01-10" },
          { id: 2, name: "Change Order #1", type: "CHANGE_ORDER", status: "PENDING", amount: 2500, signedDate: null }
        ]
      }
      
      setProject(mockProject)
      setTitle(mockProject.title)
      setDescription(mockProject.description)
      setBudget(mockProject.budget.toString())
      setEstimatedEndDate(mockProject.estimatedEndDate)
      setTeam(mockProject.team)
      setContracts(mockProject.contracts)
    } catch (error) {
      console.error("Failed to load project:", error)
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: "Project settings updated successfully"
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.role || !newTeamMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const member = {
      id: Date.now(),
      ...newTeamMember
    }

    setTeam(prev => [...prev, member])
    setNewTeamMember({ name: "", role: "", email: "", phone: "" })
    setShowAddTeamMember(false)
    
    toast({
      title: "Success",
      description: "Team member added successfully"
    })
  }

  const removeTeamMember = (memberId: number) => {
    setTeam(prev => prev.filter(member => member.id !== memberId))
    toast({
      title: "Success",
      description: "Team member removed"
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
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
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/progress/${params.id}/details`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Manage Project</h1>
            <p className="text-muted-foreground">{project.title}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Project Settings
                </CardTitle>
                <CardDescription>Update basic project information and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the project scope and requirements"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Total Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                    <Input
                      id="estimatedEndDate"
                      type="date"
                      value={estimatedEndDate}
                      onChange={(e) => setEstimatedEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Management
                    </CardTitle>
                    <CardDescription>Manage project team members and their roles</CardDescription>
                  </div>
                  <Dialog open={showAddTeamMember} onOpenChange={setShowAddTeamMember}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Team Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>Add a new team member to this project</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="memberName">Name *</Label>
                          <Input
                            id="memberName"
                            value={newTeamMember.name}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberRole">Role *</Label>
                          <Input
                            id="memberRole"
                            value={newTeamMember.role}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="e.g., Project Manager, Electrician"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberEmail">Email *</Label>
                          <Input
                            id="memberEmail"
                            type="email"
                            value={newTeamMember.email}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberPhone">Phone</Label>
                          <Input
                            id="memberPhone"
                            type="tel"
                            value={newTeamMember.phone}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddTeamMember(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addTeamMember}>
                            Add Member
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email} {member.phone && `• ${member.phone}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${member.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        {member.phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${member.phone}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contract Management
                    </CardTitle>
                    <CardDescription>Manage project contracts and change orders</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Contract
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{contract.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {contract.type} • {formatPrice(contract.amount)}
                          {contract.signedDate && ` • Signed ${formatDate(contract.signedDate)}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={contract.status === "SIGNED" ? "default" : "secondary"}>
                          {contract.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Hub
                </CardTitle>
                <CardDescription>Manage project communications and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 flex-col" asChild>
                    <Link href="/messages">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Message Client
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Mail className="h-6 w-6 mb-2" />
                    Send Update Email
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="h-6 w-6 mb-2" />
                    Share Documents
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Schedule Meeting
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
