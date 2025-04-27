import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, MapPin, DollarSign, CheckCircle, ArrowUpRight } from "lucide-react"
import type { Service } from "@/types"

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={service.image || "/placeholder.svg?height=300&width=300&query=service"}
            alt={service.name}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-primary">{service.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{service.name}</h3>
            {service.verified && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{service.price || (service.hourlyRate ? `$${service.hourlyRate}/hr` : "Custom")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{service.provider.rating || "New"}</span>
          <span className="text-sm text-muted-foreground">({service.provider.reviewCount || 0} reviews)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/services/${service.id}`}>
              <ArrowUpRight className="mr-1 h-4 w-4" /> Details
            </Link>
          </Button>
          <Button className="flex-1">Book Now</Button>
        </div>
      </CardContent>
    </Card>
  )
}
