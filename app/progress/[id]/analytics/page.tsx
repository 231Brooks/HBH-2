"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProjectAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [params.id])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockProject = {
        id: params.id,
        title: "Kitchen Renovation - 123 Main St",
        startDate: new Date("2024-01-15"),
        estimatedEndDate: new Date("2024-03-15"),
        actualEndDate: null,
        budget: 25000,
        actualCost: 16250,
        progress: 65
      }

      const mockAnalytics = {
        timeline: {
          totalDays: 60,
          daysElapsed: 39,
          daysRemaining: 21,
          onSchedule: true,
          scheduleVariance: 2 // days ahead
        },
        budget: {
          totalBudget: 25000,
          spent: 16250,
          remaining: 8750,
          onBudget: true,
          budgetVariance: -1250 // under budget
        },
        productivity: {
          milestonesCompleted: 3,
          totalMilestones: 7,
          completionRate: 43,
          averageTaskTime: 3.2,
          efficiency: 85
        },
        quality: {
          clientSatisfaction: 4.8,
          changeOrders: 1,
          reworkItems: 0,
          qualityScore: 92
        },
        team: {
          totalMembers: 3,
          activeMembers: 3,
          averageUtilization: 78,
          topPerformer: "Mike Johnson"
        },
        risks: [
          { id: 1, type: "SCHEDULE", description: "Weather delays possible", severity: "MEDIUM", probability: 30 },
          { id: 2, type: "BUDGET", description: "Material cost increase", severity: "LOW", probability: 20 }
        ],
        trends: {
          progressTrend: [
            { week: "Week 1", progress: 10 },
            { week: "Week 2", progress: 25 },
            { week: "Week 3", progress: 40 },
            { week: "Week 4", progress: 50 },
            { week: "Week 5", progress: 60 },
            { week: "Week 6", progress: 65 }
          ],
          costTrend: [
            { week: "Week 1", cost: 2500 },
            { week: "Week 2", cost: 6000 },
            { week: "Week 3", cost: 9500 },
            { week: "Week 4", cost: 12000 },
            { week: "Week 5", cost: 14500 },
            { week: "Week 6", cost: 16250 }
          ]
        }
      }
      
      setProject(mockProject)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error("Failed to load analytics:", error)
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

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "bg-red-500"
      case "MEDIUM": return "bg-yellow-500"
      case "LOW": return "bg-green-500"
      default: return "bg-gray-500"
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

  if (!project || !analytics) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics Not Available</h1>
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
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/progress/${params.id}/details`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Project Analytics</h1>
            <p className="text-muted-foreground">{project.title}</p>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={project.progress} className="flex-1" />
                <span className="text-xs text-muted-foreground">Complete</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.budget.remaining)}</div>
              <div className="flex items-center gap-1 text-xs">
                {analytics.budget.onBudget ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={analytics.budget.onBudget ? "text-green-600" : "text-red-600"}>
                  {analytics.budget.onBudget ? "Under budget" : "Over budget"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.timeline.daysRemaining}</div>
              <div className="flex items-center gap-1 text-xs">
                {analytics.timeline.onSchedule ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                )}
                <span className={analytics.timeline.onSchedule ? "text-green-600" : "text-yellow-600"}>
                  Days remaining
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.quality.qualityScore}%</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600">Excellent</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Progress Trend
                  </CardTitle>
                  <CardDescription>Weekly progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.trends.progressTrend.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm w-16">{item.week}</span>
                        <Progress value={item.progress} className="flex-1" />
                        <span className="text-sm w-12">{item.progress}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Milestone Status
                  </CardTitle>
                  <CardDescription>Project milestone completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <span className="font-semibold">{analytics.productivity.milestonesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Remaining</span>
                      <span className="font-semibold">
                        {analytics.productivity.totalMilestones - analytics.productivity.milestonesCompleted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-semibold">{analytics.productivity.completionRate}%</span>
                    </div>
                    <Progress value={analytics.productivity.completionRate} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                  <CardDescription>Current budget allocation and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Budget</span>
                      <span className="font-semibold">{formatPrice(analytics.budget.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spent</span>
                      <span className="font-semibold text-red-600">{formatPrice(analytics.budget.spent)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Remaining</span>
                      <span className="font-semibold text-green-600">{formatPrice(analytics.budget.remaining)}</span>
                    </div>
                    <Progress 
                      value={(analytics.budget.spent / analytics.budget.totalBudget) * 100} 
                      className="w-full" 
                    />
                    <div className="text-xs text-muted-foreground">
                      {((analytics.budget.spent / analytics.budget.totalBudget) * 100).toFixed(1)}% of budget used
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Trend</CardTitle>
                  <CardDescription>Weekly spending pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.trends.costTrend.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.week}</span>
                        <span className="font-medium">{formatPrice(item.cost)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Team productivity and utilization metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Team Members</span>
                      <span className="font-semibold">{analytics.team.totalMembers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Utilization</span>
                      <span className="font-semibold">{analytics.team.averageUtilization}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Top Performer</span>
                      <span className="font-semibold">{analytics.team.topPerformer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficiency Score</span>
                      <span className="font-semibold">{analytics.productivity.efficiency}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                  <CardDescription>Project quality and client satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Client Satisfaction</span>
                      <span className="font-semibold">{analytics.quality.clientSatisfaction}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Change Orders</span>
                      <span className="font-semibold">{analytics.quality.changeOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rework Items</span>
                      <span className="font-semibold">{analytics.quality.reworkItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quality Score</span>
                      <span className="font-semibold">{analytics.quality.qualityScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Identified risks and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.risks.map((risk: any) => (
                    <div key={risk.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.severity)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{risk.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {risk.type} • {risk.probability}% probability
                        </div>
                      </div>
                      <Badge variant={risk.severity === "HIGH" ? "destructive" : "secondary"}>
                        {risk.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
