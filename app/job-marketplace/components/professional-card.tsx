import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star, MapPin, DollarSign } from "lucide-react"

interface ProfessionalCardProps {
  name: string
  title: string
  rating: number
  reviews: number
  hourlyRate: number
  location: string
  imageUrl: string
  tags: string[]
  description: string
}

export default function ProfessionalCard({
  name,
  title,
  rating,
  reviews,
  hourlyRate,
  location,
  imageUrl,
  tags,
  description,
}: ProfessionalCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold hover:text-blue-600 transition-colors">
              <Link href="#">{name}</Link>
            </h3>
            <p className="text-sm text-slate-500">{title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-slate-500">({reviews} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} />
            <span>${hourlyRate}/hr</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 bg-slate-50">
        <Button variant="outline" size="sm">
          View Profile
        </Button>
        <Button size="sm">Contact</Button>
      </CardFooter>
    </Card>
  )
}
