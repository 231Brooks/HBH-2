import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

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

interface TitleCompanyCardProps {
  company: TitleCompany
}

export default function TitleCompanyCard({ company }: TitleCompanyCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image
              src={
                company.logo || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(company.name)}+logo`
              }
              alt={`${company.name} logo`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle>{company.name}</CardTitle>
            <CardDescription>
              {company.city}, {company.state}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Address:</span> {company.address}, {company.city}, {company.state}{" "}
            {company.zipCode}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phone:</span> {company.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {company.email}
          </p>
          {company.website && (
            <p className="text-gray-700">
              <span className="font-medium">Website:</span>{" "}
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full">
          <Link href={`/title-companies/${company.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
          <Link href={`/title-companies/${company.id}/contact`}>
            <Button>Contact</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
