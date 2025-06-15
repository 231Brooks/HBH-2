"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Clock, CheckCircle, AlertCircle, Users, Search, Plus, Filter, ArrowUpRight, Building2, Briefcase, Star, DollarSign, MapPin, TrendingUp, BarChart3, Upload } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { getUserTransactions } from "@/app/actions/transaction-actions"
import { getUserServiceProjects } from "@/app/actions/service-actions"
import { useSupabase } from "@/contexts/supabase-context"
import { usePermissions } from "@/hooks/use-permissions"

function ProgressPageContent() {
  const { user } = useSupabase()
  const { isProfessional } = usePermissions()
  const [transactions, setTransactions] = useState<any[]>([])
  const [serviceProjects, setServiceProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState(isProfessional ? "service-projects" : "active")

  useEffect(() => {
    loadData()
  }, [statusFilter, isProfessional])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load transactions for all users
      const result = await getUserTransactions({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 50
      })
      setTransactions(result.transactions || [])

      // Load service projects for professionals
      if (isProfessional) {
        try {
          const result = await getUserServiceProjects({ limit: 10 })
          if (result.success) {
            setServiceProjects(result.projects || [])
          } else {
            setServiceProjects([])
          }
        } catch (error) {
          console.error("Failed to load service projects:", error)
          setServiceProjects([])
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }



  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === "" ||
      transaction.property?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "active") {
      return matchesSearch && transaction.status !== "COMPLETED" && transaction.status !== "CANCELLED"
    } else if (activeTab === "completed") {
      return matchesSearch && (transaction.status === "COMPLETED" || transaction.status === "CANCELLED")
    }
    return matchesSearch
  })

  const activeTransactions = filteredTransactions.filter(t =>
    t.status !== "COMPLETED" && t.status !== "CANCELLED"
  )
  const completedTransactions = filteredTransactions.filter(t =>
    t.status === "COMPLETED" || t.status === "CANCELLED"
  )

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl overflow-x-hidden">
      {/* Header section with responsive design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {isProfessional ? "Progress & Projects" : "Transaction Progress"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isProfessional
              ? "Track your service projects and real estate transactions"
              : "Track and manage your real estate transactions with title companies"
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/progress/create">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Transaction</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
          {isProfessional && (
            <Button className="w-full sm:w-auto" asChild variant="outline">
              <Link href="/services">
                <Briefcase className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Manage Services</span>
                <span className="sm:hidden">Services</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main content area with responsive layout */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        <div className="xl:w-3/4">
          {/* Search and filter controls with responsive design */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                className="pl-10 w-full lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-1 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                  <SelectItem value="DOCUMENT_REVIEW">Document Review</SelectItem>
                  <SelectItem value="CLOSING_SOON">Closing Soon</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Responsive tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 sm:mb-6 w-full grid grid-cols-2 lg:grid-cols-4 h-auto p-1">
              {isProfessional && (
                <TabsTrigger value="service-projects" className="text-xs sm:text-sm p-2">
                  <span className="hidden sm:inline">Service Projects</span>
                  <span className="sm:hidden">Projects</span> ({serviceProjects.length})
                </TabsTrigger>
              )}
              <TabsTrigger value="active" className="text-xs sm:text-sm p-2">
                <span className="hidden sm:inline">Active Transactions</span>
                <span className="sm:hidden">Active</span> ({activeTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm p-2">
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span> ({completedTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm p-2">
                <span className="hidden sm:inline">All Transactions</span>
                <span className="sm:hidden">All</span> ({filteredTransactions.length})
              </TabsTrigger>
            </TabsList>

            {isProfessional && (
              <TabsContent value="service-projects" className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : serviceProjects.length > 0 ? (
                  serviceProjects.map((project) => (
                    <ServiceProjectCard
                      key={project.id}
                      project={project}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No service projects found</h3>
                    <p className="text-gray-500 mb-4">Start accepting service requests to see your projects here.</p>
                    <Button asChild>
                      <Link href="/services">
                        <Briefcase className="mr-2 h-4 w-4" /> Browse Service Requests
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            )}

            <TabsContent value="active" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : activeTransactions.length > 0 ? (
                activeTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active transactions found</p>
                  <Button asChild>
                    <Link href="/progress/create">
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Transaction
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : completedTransactions.length > 0 ? (
                completedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed transactions found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                  <Button asChild className="mt-4">
                    <Link href="/progress/create">
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Transaction
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with responsive design */}
        <div className="xl:w-1/4 space-y-4 sm:space-y-6">
          {isProfessional ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Service Stats</CardTitle>
                <CardDescription>Your professional performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <span className="font-semibold">{serviceProjects.filter(p => p.status === 'IN_PROGRESS').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed This Month</span>
                    <span className="font-semibold">{serviceProjects.filter(p => p.status === 'COMPLETED').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="font-semibold">
                      ${serviceProjects.reduce((sum, p) => p.status === 'COMPLETED' && p.budget ? sum + p.budget : sum, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/services">
                      <TrendingUp className="mr-2 h-4 w-4" /> View Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Title Companies</CardTitle>
                <CardDescription>Your connected title partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">Desert Title Company</p>
                      <p className="text-sm text-muted-foreground">3 active transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">First American Title</p>
                      <p className="text-sm text-muted-foreground">1 active transaction</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">Fidelity National Title</p>
                      <p className="text-sm text-muted-foreground">2 completed transactions</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Title Company
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{isProfessional ? "Recent Work" : "Recent Documents"}</CardTitle>
              <CardDescription>
                {isProfessional ? "Latest project deliverables" : "Latest transaction documents"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground">
                    {isProfessional ? "No recent deliverables" : "No recent documents"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isProfessional
                      ? "Deliverables will appear here when you upload them to projects"
                      : "Documents will appear here when they're uploaded to your transactions"
                    }
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  {isProfessional ? "View All Deliverables" : "View All Documents"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important dates to remember</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No upcoming deadlines</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Important dates and deadlines will appear here
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/calendar">View Calendar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  )
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

interface TransactionCardProps {
  transaction: any
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-amber-500"
      case "PENDING_APPROVAL": return "bg-blue-500"
      case "DOCUMENT_REVIEW": return "bg-purple-500"
      case "CLOSING_SOON": return "bg-green-500"
      case "COMPLETED": return "bg-green-600"
      case "CANCELLED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_PROGRESS": return "In Progress"
      case "PENDING_APPROVAL": return "Pending Approval"
      case "DOCUMENT_REVIEW": return "Document Review"
      case "CLOSING_SOON": return "Closing Soon"
      case "COMPLETED": return "Completed"
      case "CANCELLED": return "Cancelled"
      default: return status
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return "Not set"
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const getPartyNames = () => {
    if (!transaction.parties || transaction.parties.length === 0) {
      return ["No parties assigned"]
    }
    return transaction.parties.map((party: any) =>
      `${party.user?.name || 'Unknown'} (${party.role})`
    )
  }
  const progress = transaction.progress || 0
  const address = transaction.property?.address || transaction.property?.title || "Property Address"
  const price = transaction.property?.price ? formatPrice(transaction.property.price) : "Price TBD"
  const status = getStatusLabel(transaction.status)
  const statusColor = getStatusColor(transaction.status)
  const dueDate = formatDate(transaction.closingDate)
  const titleCompany = transaction.titleCompany?.name || "Title Company TBD"
  const parties = getPartyNames()
  const lastUpdate = transaction.lastUpdate || "No recent updates"
  const lastUpdateTime = transaction.updatedAt ? formatDate(transaction.updatedAt) : "Unknown"

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg">{address}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColor} text-white`}>{status}</Badge>
              <span className="font-bold">{price}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Due: {dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{titleCompany}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{parties.join(", ")}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            {progress < 100 ? (
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            )}
            <div>
              <p>{lastUpdate}</p>
              <p className="text-muted-foreground">{lastUpdateTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${transaction.id}/documents`}>
                <FileText className="mr-2 h-4 w-4" /> View Documents
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${transaction.id}/parties`}>
                <Users className="mr-2 h-4 w-4" /> Contact Parties
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${transaction.id}/timeline`}>
                <Clock className="mr-2 h-4 w-4" /> View Timeline
              </Link>
            </Button>
          </div>
          <Button className="mt-4 w-full" asChild>
            <Link href={`/progress/${transaction.id}`}>Manage Transaction</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

interface ServiceProjectCardProps {
  project: any
}

function ServiceProjectCard({ project }: ServiceProjectCardProps) {
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

  const formatDate = (date: string | Date) => {
    if (!date) return "Not set"
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const progress = project.progress || 0
  const status = getStatusLabel(project.status)
  const statusColor = getStatusColor(project.status)
  const dueDate = formatDate(project.endDate)
  const amount = project.budget ? formatPrice(project.budget) : "Budget TBD"

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColor} text-white`}>{status}</Badge>
              <span className="font-bold">{amount}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Due: {dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.service?.category || "General Service"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Service: {project.service?.name || "Custom Project"}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            {progress < 100 ? (
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            )}
            <div>
              <p>{progress < 100 ? "Project in progress" : "Project completed"}</p>
              <p className="text-muted-foreground">Last updated {formatDate(project.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${project.id}/details`}>
                <FileText className="mr-2 h-4 w-4" /> View Details
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${project.id}/update-progress`}>
                <Clock className="mr-2 h-4 w-4" /> Update Progress
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${project.id}/analytics`}>
                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/progress/${project.id}/deliverables`}>
                <Upload className="mr-2 h-4 w-4" /> Deliverables
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/messages">
                <Users className="mr-2 h-4 w-4" /> Contact Client
              </Link>
            </Button>
          </div>
          <Button className="mt-4 w-full" asChild>
            <Link href={`/progress/${project.id}/manage-project`}>Manage Project</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
