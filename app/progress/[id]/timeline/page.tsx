"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Plus,
  User,
  FileText
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock timeline data - replace with actual API call
const mockTimelineEvents = [
  {
    id: "1",
    title: "Transaction Created",
    description: "Initial transaction setup completed",
    date: "2023-07-01",
    time: "10:00 AM",
    type: "milestone",
    status: "completed",
    user: "John Doe"
  },
  {
    id: "2",
    title: "Purchase Agreement Signed",
    description: "All parties have signed the purchase agreement",
    date: "2023-07-03",
    time: "2:30 PM",
    type: "document",
    status: "completed",
    user: "Jane Smith"
  },
  {
    id: "3",
    title: "Home Inspection Scheduled",
    description: "Professional home inspection appointment set",
    date: "2023-07-08",
    time: "9:00 AM",
    type: "appointment",
    status: "upcoming",
    user: "Mike Johnson"
  },
  {
    id: "4",
    title: "Financing Application",
    description: "Mortgage application submitted to lender",
    date: "2023-07-10",
    time: "11:00 AM",
    type: "milestone",
    status: "pending",
    user: "Sarah Wilson"
  },
  {
    id: "5",
    title: "Title Search",
    description: "Title company to begin property title search",
    date: "2023-07-15",
    time: "1:00 PM",
    type: "milestone",
    status: "upcoming",
    user: "Title Company"
  }
]

export default function TransactionTimelinePage() {
  const params = useParams()
  const router = useRouter()
  const [timelineEvents, setTimelineEvents] = useState(mockTimelineEvents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const transactionId = params.id as string

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "upcoming":
        return <Calendar className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "appointment":
        return <Calendar className="h-5 w-5" />
      case "milestone":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/progress/${transactionId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transaction
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Transaction Timeline</h1>
          <p className="text-muted-foreground">
            Track all events and milestones for this transaction
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Timeline ({timelineEvents.length} events)</h2>
            <p className="text-sm text-muted-foreground">
              Chronological view of all transaction activities
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-green-100' :
                      event.status === 'pending' ? 'bg-yellow-100' :
                      event.status === 'upcoming' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusIcon(event.status)}
                          <span className="ml-1 capitalize">{event.status}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{event.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {timelineEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline events</h3>
              <p className="text-gray-500 mb-4">
                Add events to track the progress of this transaction.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
