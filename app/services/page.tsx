import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowUpRight,
  Camera,
  Home,
  FileText,
  Paintbrush,
  Truck,
  PenToolIcon as Tool,
  PiggyBank,
  Briefcase,
  Plus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ServicesPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Third Party Services</h1>
          <p className="text-muted-foreground">Find and hire trusted professionals for all your real estate needs</p>
        </div>
        <Button asChild>
          <Link href="/services/list">
            <Plus className="mr-2 h-4 w-4" /> List Your Service
          </Link>
        </Button>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search for services or professionals" className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <select className="border rounded-md px-3 py-2 text-sm bg-white">
              <option>All Categories</option>
              <option>Title Services</option>
              <option>Home Inspection</option>
              <option>Photography</option>
              <option>Renovation</option>
              <option>Legal Services</option>
              <option>Mortgage</option>
              <option>Moving Services</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
        {[
          { name: "Title Services", icon: <FileText className="h-5 w-5" /> },
          { name: "Home Inspection", icon: <Home className="h-5 w-5" /> },
          { name: "Photography", icon: <Camera className="h-5 w-5" /> },
          { name: "Renovation", icon: <Tool className="h-5 w-5" /> },
          { name: "Legal Services", icon: <Briefcase className="h-5 w-5" /> },
          { name: "Mortgage", icon: <PiggyBank className="h-5 w-5" /> },
          { name: "Interior Design", icon: <Paintbrush className="h-5 w-5" /> },
          { name: "Moving Services", icon: <Truck className="h-5 w-5" /> },
        ].map((category, i) => (
          <Link href={`/services?category=${category.name.toLowerCase().replace(" ", "-")}`} key={i}>
            <Card className="h-full transition-all hover:shadow-md hover:border-slate-300">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="p-3 rounded-full bg-slate-100 mb-3">{category.icon}</div>
                <h3 className="font-medium text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="popular">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
          <select className="border rounded-md px-3 py-2 text-sm bg-white">
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              id="1"
              name="Desert Title Company"
              category="Title Services"
              rating={4.9}
              reviews={124}
              price="$350+"
              location="Phoenix, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={true}
              description="Comprehensive title and escrow services for residential and commercial properties."
            />
            <ServiceCard
              id="2"
              name="Elite Home Inspections"
              category="Home Inspection"
              rating={4.8}
              reviews={87}
              price="$275+"
              location="Scottsdale, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={true}
              description="Thorough home inspections with detailed reports and same-day service."
            />
            <ServiceCard
              id="3"
              name="Premium Real Estate Photography"
              category="Photography"
              rating={4.9}
              reviews={56}
              price="$200+"
              location="Tempe, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={true}
              description="Professional photography, virtual tours, and drone footage for property listings."
            />
            <ServiceCard
              id="4"
              name="Johnson & Associates Law"
              category="Legal Services"
              rating={4.7}
              reviews={42}
              price="$150/hr"
              location="Phoenix, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={true}
              description="Specialized real estate attorneys for contract review, closings, and dispute resolution."
            />
            <ServiceCard
              id="5"
              name="Reliable Renovation Contractors"
              category="Renovation"
              rating={4.6}
              reviews={93}
              price="Custom"
              location="Mesa, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={false}
              description="Full-service renovation and remodeling for residential properties."
            />
            <ServiceCard
              id="6"
              name="Valley Mortgage Solutions"
              category="Mortgage"
              rating={4.8}
              reviews={78}
              price="Varies"
              location="Chandler, AZ"
              image="/placeholder.svg?height=300&width=300"
              verified={true}
              description="Competitive mortgage rates and financing options for all types of buyers."
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More Services</Button>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-0">
          {/* Featured services would be listed here */}
          <p className="text-muted-foreground">Showing featured services</p>
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          {/* New services would be listed here */}
          <p className="text-muted-foreground">Showing new services</p>
        </TabsContent>

        <TabsContent value="nearby" className="mt-0">
          {/* Nearby services would be listed here */}
          <p className="text-muted-foreground">Showing nearby services</p>
        </TabsContent>
      </Tabs>

      <div className="mt-16 bg-primary/5 rounded-lg p-8 border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Are You a Service Provider?</h2>
          <p className="text-muted-foreground mb-6">
            Join our marketplace to connect with clients, showcase your expertise, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/services/list">List Your Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ServiceCardProps {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  price: string
  location: string
  image: string
  verified: boolean
  description: string
}

function ServiceCard({
  id,
  name,
  category,
  rating,
  reviews,
  price,
  location,
  image,
  verified,
  description,
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          <Badge className="absolute top-2 right-2 bg-primary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            {verified && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{price}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/services/${id}`}>
              <ArrowUpRight className="mr-1 h-4 w-4" /> Details
            </Link>
          </Button>
          <Button className="flex-1">Book Now</Button>
        </div>
      </CardContent>
    </Card>
  )
}
