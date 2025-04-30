"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  getTitleCompanyById,
  getTitleCompanyUsers,
  getTitleCompanyTransactions,
  deleteTitleCompany,
} from "@/app/actions/title-company-actions"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Users, FileText, MapPin, Phone, Mail, Globe, Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TitleCompany {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  logo: string
  createdAt: string
  updatedAt: string
}

interface TitleCompanyUser {
  id: string
  userId: string
  titleCompanyId: string
  role: string
  name: string
  email: string
  avatar: string
}

interface Transaction {
  id: string
  status: string
  propertyTitle: string
  propertyAddress: string
  createdAt: string
  updatedAt: string
}

export default function TitleCompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [company, setCompany] = useState<TitleCompany | null>(null)
  const [users, setUsers] = useState<TitleCompanyUser[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [companyData, usersData, transactionsData] = await Promise.all([
          getTitleCompanyById(params.id),
          getTitleCompanyUsers(params.id),
          getTitleCompanyTransactions(params.id),
        ])

        setCompany(companyData)
        setUsers(usersData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to load title company data:", error)
        toast({
          title: "Error",
          description: "Failed to load title company data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteTitleCompany(params.id)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/title-companies")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting title company:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-48 w-48 rounded-md" />
              <div className="space-y-4 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Title Company Not Found</h1>
        <p className="mb-8">The title company you're looking for doesn't exist or has been removed.</p>
        <Link href="/title-companies">
          <Button>Back to Title Companies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <div className="flex gap-2">
          <Link href={`/title-companies/${company.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the title company and remove all associated
                  data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-48 w-48 mb-6">
              <Image
                src={company.logo || "/placeholder.svg?height=200&width=200&query=title+company+logo"}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full space-y-4">
              {company.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <p>{company.address}</p>
                    <p>
                      {company.city}, {company.state} {company.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-500" />
                  <p>{company.phone}</p>
                </div>
              )}

              {company.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                    {company.email}
                  </a>
                </div>
              )}

              {company.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-gray-500" />
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="transactions">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Company Details</CardTitle>
                <TabsList>
                  <TabsTrigger value="transactions">
                    <FileText className="h-4 w-4 mr-2" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="team">
                    <Users className="h-4 w-4 mr-2" />
                    Team
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="transactions" className="mt-0">
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{transaction.propertyTitle}</h3>
                            <p className="text-sm text-gray-500">{transaction.propertyAddress}</p>
                          </div>
                          <Badge>{transaction.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <p className="text-sm text-gray-500">
                            Updated: {new Date(transaction.updatedAt).toLocaleDateString()}
                          </p>
                          <Link href={`/progress/${transaction.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                    <p className="text-gray-500 mb-4">
                      This title company hasn't been assigned to any transactions yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="team" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Team Members</h3>
                  <Link href={`/title-companies/${company.id}/add-user`}>
                    <Button size="sm" variant="outline">
                      Add User
                    </Button>
                  </Link>
                </div>

                {users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 mr-4">
                            <Image
                              src={user.avatar || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                              alt={`${user.name} avatar`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Badge>{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Add team members to help manage transactions for this title company.
                    </p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
