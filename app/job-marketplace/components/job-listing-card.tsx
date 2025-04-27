import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Users } from "lucide-react"

interface JobListingCardProps {
  title: string
  location: string
  budget: string
  postedTime: string
  description: string
  skills: string[]
  proposals: number
}

export default function JobListingCard({
  title,
  location,
  budget,
  postedTime,
  description,
  skills,
  proposals,
}: JobListingCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
              <Link href="#">{title}</Link>
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span>{budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{postedTime}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users size={14} />
            {proposals} proposals
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 bg-slate-50">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm">Submit Proposal</Button>
      </CardFooter>
    </Card>
  )
}
