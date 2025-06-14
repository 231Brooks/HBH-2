"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  propertyAddress: string
  buyerName: string
  sellerName: string
  salePrice: number
  status: "PENDING" | "IN_PROGRESS" | "CLOSING_SCHEDULED" | "CLOSED" | "CANCELLED"
  scheduledClosingDate?: Date
  createdAt: Date
  documents: Document[]
  milestones: Milestone[]
}

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: Date
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED"
}

interface Milestone {
  id: string
  title: string
  dueDate: Date
  completedDate?: Date
  status: "PENDING" | "COMPLETED" | "OVERDUE"
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CLOSING_SCHEDULED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: FileText,
  CLOSING_SCHEDULED: Calendar,
  CLOSED: CheckCircle,
  CANCELLED: XCircle,
}

export default function TitleCompanyDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [activeTab, setActiveTab] = useState("transactions")

  useEffect(() => {
    loadTransactions()
  }, [statusFilter])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          propertyAddress: "123 Main St, Phoenix, AZ",
          buyerName: "John Smith",
          sellerName: "Jane Doe",
          salePrice: 450000,
          status: "IN_PROGRESS",
          scheduledClosingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          documents: [],
          milestones: []
        },
        {
          id: "2",
          propertyAddress: "456 Oak Ave, Scottsdale, AZ",
          buyerName: "Mike Johnson",
          sellerName: "Sarah Wilson",
          salePrice: 675000,
          status: "CLOSING_SCHEDULED",
          scheduledClosingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          documents: [],
          milestones: []
        }
      ]
      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Failed to load transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: transactions.length,
    inProgress: transactions.filter(t => t.status === "IN_PROGRESS").length,
    closingScheduled: transactions.filter(t => t.status === "CLOSING_SCHEDULED").length,
    closed: transactions.filter(t => t.status === "CLOSED").length,
    totalValue: transactions.reduce((sum, t) => sum + t.salePrice, 0)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Title Company Dashboard</h1>
          <p className="text-muted-foreground">Manage transactions and coordinate closings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/progress/create">
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closing Scheduled</p>
                <p className="text-2xl font-bold">{stats.closingScheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="calendar">Closing Calendar</TabsTrigger>
          <TabsTrigger value="documents">Document Center</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by property address, buyer, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="CLOSING_SCHEDULED">Closing Scheduled</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Closing Calendar</h3>
            <p className="text-gray-500">View and manage scheduled closings.</p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Center</h3>
            <p className="text-gray-500">Manage transaction documents and title commitments.</p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
            <p className="text-gray-500">View transaction reports and business analytics.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TransactionCardProps {
  transaction: Transaction
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const StatusIcon = statusIcons[transaction.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{transaction.propertyAddress}</CardTitle>
            <CardDescription className="text-base">
              ${transaction.salePrice.toLocaleString()} • {transaction.buyerName} ← {transaction.sellerName}
            </CardDescription>
          </div>
          <Badge className={statusColors[transaction.status]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {transaction.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {transaction.scheduledClosingDate 
              ? `Closing: ${transaction.scheduledClosingDate.toLocaleDateString()}`
              : "No closing date set"
            }
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Created {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-2" />
            {transaction.documents.length} documents
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
          <Button size="sm" asChild>
            <Link href={`/progress/${transaction.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
