"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { getTitleCompanies } from "@/app/actions/title-company-actions"

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
}

export default function TitleCompaniesPage() {
  const [titleCompanies, setTitleCompanies] = useState<TitleCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadTitleCompanies() {
      try {
        const companies = await getTitleCompanies()
        setTitleCompanies(companies)
      } catch (error) {
        console.error("Failed to load title companies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTitleCompanies()
  }, [])

  const filteredCompanies = titleCompanies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Title Companies</h1>
        <Link href="/title-companies/create">
          <Button>Add Title Company</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>
                  {company.city}, {company.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="relative h-32 w-32">
                    <Image
                      src={company.logo || "/placeholder.svg?height=100&width=100&query=title+company+logo"}
                      alt={`${company.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-sm mb-2">{company.address}</p>
                <p className="text-sm mb-2">{company.phone}</p>
                <p className="text-sm mb-2">{company.email}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/title-companies/${company.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No title companies found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or add a new title company.</p>
          <Link href="/title-companies/create">
            <Button>Add Title Company</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
