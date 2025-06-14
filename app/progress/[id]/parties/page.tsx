"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare,
  Plus,
  AlertCircle,
  Building2,
  User
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock parties data - replace with actual API call
const mockParties = [
  {
    id: "1",
    name: "John Doe",
    role: "Buyer",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    avatar: "",
    company: "Self",
    status: "active"
  },
  {
    id: "2", 
    name: "Jane Smith",
    role: "Seller",
    email: "jane.smith@email.com",
    phone: "(555) 987-6543",
    avatar: "",
    company: "Smith Properties LLC",
    status: "active"
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "Real Estate Agent",
    email: "mike@realestate.com",
    phone: "(555) 456-7890",
    avatar: "",
    company: "Premier Realty",
    status: "active"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    role: "Title Agent",
    email: "sarah@titlecompany.com",
    phone: "(555) 321-0987",
    avatar: "",
    company: "Secure Title Co.",
    status: "active"
  }
]

export default function TransactionPartiesPage() {
  const params = useParams()
  const router = useRouter()
  const [parties, setParties] = useState(mockParties)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const transactionId = params.id as string

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "buyer":
        return "bg-blue-100 text-blue-800"
      case "seller":
        return "bg-green-100 text-green-800"
      case "real estate agent":
        return "bg-purple-100 text-purple-800"
      case "title agent":
        return "bg-orange-100 text-orange-800"
      case "lender":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "buyer":
      case "seller":
        return <User className="h-4 w-4" />
      case "real estate agent":
      case "title agent":
      case "lender":
        return <Building2 className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold">Transaction Parties</h1>
          <p className="text-muted-foreground">
            Contact information for all parties involved in this transaction
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
            <h2 className="text-xl font-semibold">Parties ({parties.length})</h2>
            <p className="text-sm text-muted-foreground">
              All individuals and companies involved in this transaction
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Party
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {parties.map((party) => (
            <Card key={party.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={party.avatar} alt={party.name} />
                    <AvatarFallback>
                      {party.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{party.name}</h3>
                      <Badge className={getRoleColor(party.role)}>
                        {getRoleIcon(party.role)}
                        <span className="ml-1">{party.role}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{party.company}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${party.email}`} className="text-blue-600 hover:underline">
                          {party.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${party.phone}`} className="text-blue-600 hover:underline">
                          {party.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/messages?contact=${party.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {parties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parties added</h3>
              <p className="text-gray-500 mb-4">
                Add parties involved in this transaction to keep track of contacts.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Party
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
