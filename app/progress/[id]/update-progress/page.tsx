"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  X,
  Plus,
  Calendar,
  DollarSign
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function UpdateProgressPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [actualCost, setActualCost] = useState("")
  const [estimatedEndDate, setEstimatedEndDate] = useState("")
  const [milestones, setMilestones] = useState<any[]>([])
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "", description: "" })
  const [showAddMilestone, setShowAddMilestone] = useState(false)

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
        status: "IN_PROGRESS",
        progress: 65,
        actualCost: 16250,
        estimatedEndDate: "2024-03-15",
        notes: "Project is progressing well. Electrical and plumbing work completed ahead of schedule.",
        milestones: [
          { id: 1, title: "Design Approval", status: "COMPLETED", dueDate: "2024-01-20", description: "Client approved final design" },
          { id: 2, title: "Demolition", status: "COMPLETED", dueDate: "2024-01-25", description: "Kitchen demolition completed" },
          { id: 3, title: "Electrical & Plumbing", status: "COMPLETED", dueDate: "2024-02-05", description: "Rough electrical and plumbing work" },
          { id: 4, title: "Drywall & Painting", status: "IN_PROGRESS", dueDate: "2024-02-15", description: "Drywall installation and painting" },
          { id: 5, title: "Cabinet Installation", status: "PENDING", dueDate: "2024-02-25", description: "Install kitchen cabinets" },
          { id: 6, title: "Countertop Installation", status: "PENDING", dueDate: "2024-03-05", description: "Install countertops and backsplash" },
          { id: 7, title: "Final Inspection", status: "PENDING", dueDate: "2024-03-15", description: "Final walkthrough and inspection" }
        ]
      }
      
      setProject(mockProject)
      setProgress(mockProject.progress)
      setStatus(mockProject.status)
      setNotes(mockProject.notes)
      setActualCost(mockProject.actualCost.toString())
      setEstimatedEndDate(mockProject.estimatedEndDate)
      setMilestones(mockProject.milestones)
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

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Success",
        description: "Project progress updated successfully"
      })
      
      router.push(`/progress/${params.id}/details`)
    } catch (error) {
      console.error("Failed to update progress:", error)
      toast({
        title: "Error",
        description: "Failed to update project progress",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const updateMilestoneStatus = (milestoneId: number, newStatus: string) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, status: newStatus }
        : milestone
    ))
  }

  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in milestone title and due date",
        variant: "destructive"
      })
      return
    }

    const milestone = {
      id: Date.now(),
      title: newMilestone.title,
      dueDate: newMilestone.dueDate,
      description: newMilestone.description,
      status: "PENDING"
    }

    setMilestones(prev => [...prev, milestone])
    setNewMilestone({ title: "", dueDate: "", description: "" })
    setShowAddMilestone(false)
  }

  const removeMilestone = (milestoneId: number) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== milestoneId))
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
      <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/progress/${params.id}/details`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Update Progress</h1>
            <p className="text-muted-foreground">{project.title}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Update the overall project completion percentage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="progress">Progress Percentage</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Progress value={progress} className="flex-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Project Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="actualCost">Actual Cost ($)</Label>
                  <Input
                    id="actualCost"
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    placeholder="0"
                  />
                </div>
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

              <div>
                <Label htmlFor="notes">Progress Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about current progress, challenges, or updates..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>Update milestone status and manage project phases</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMilestone(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddMilestone && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="milestoneTitle">Milestone Title</Label>
                        <Input
                          id="milestoneTitle"
                          value={newMilestone.title}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter milestone title"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="milestoneDueDate">Due Date</Label>
                          <Input
                            id="milestoneDueDate"
                            type="date"
                            value={newMilestone.dueDate}
                            onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="milestoneDescription">Description (Optional)</Label>
                          <Input
                            id="milestoneDescription"
                            value={newMilestone.description}
                            onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addMilestone} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Milestone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddMilestone(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)}`} />
                  <div className="flex-1">
                    <div className="font-medium">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      {milestone.description && ` • ${milestone.description}`}
                    </div>
                  </div>
                  <Select
                    value={milestone.status}
                    onValueChange={(value) => updateMilestoneStatus(milestone.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestone.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href={`/progress/${params.id}/details`}>Cancel</Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
