import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, Briefcase, Gavel, FileText, Users, MapPin, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Real Estate Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Homes in Better Hands</h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              The all-in-one platform connecting buyers, sellers, title companies, and service providers for seamless
              real estate transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Find Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform streamlines the real estate process from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transaction Progress</h3>
                <p className="text-muted-foreground">
                  Track closing progress, share documents, and collaborate with title companies in real-time.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/progress" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Property Marketplace</h3>
                <p className="text-muted-foreground">
                  Browse, list, and auction properties with interactive maps and direct messaging.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/marketplace" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Service Directory</h3>
                <p className="text-muted-foreground">
                  Find and hire trusted third-party services for all your real estate needs.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/services" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Gavel className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Property Auctions</h3>
                <p className="text-muted-foreground">
                  Participate in transparent property auctions with real-time bidding and updates.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/marketplace?tab=auctions" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Integrated Calendar</h3>
                <p className="text-muted-foreground">
                  Manage all your appointments and deadlines in one centralized calendar.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/calendar" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contractor Jobs</h3>
                <p className="text-muted-foreground">
                  Post and find specialized real estate contracting jobs and projects.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/contracts" className="flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Button asChild>
              <Link href="/marketplace">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={`/placeholder.svg?height=400&width=600&text=Property+${i}`}
                    alt={`Property ${i}`}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary">For Sale</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">Modern Family Home</h3>
                    <p className="font-bold text-primary">$425,000</p>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Phoenix, AZ</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Beautiful 4 bedroom, 3 bathroom home with modern finishes and spacious backyard.
                  </p>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline">4 Beds</Badge>
                      <Badge variant="outline">3 Baths</Badge>
                      <Badge variant="outline">2,400 sqft</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-16 md:py-24">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Popular Services</h2>
          <Button asChild>
            <Link href="/services">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Title Services", "Home Inspection", "Real Estate Photography", "Renovation"].map((service, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=${service.replace(" ", "+")}`}
                  alt={service}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{service}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional {service.toLowerCase()} from verified providers.
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`/services?category=${service.toLowerCase().replace(" ", "-")}`}>Find Providers</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join thousands of users who are streamlining their real estate transactions with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/profile/create">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">HomesBH</h3>
              <p className="text-slate-400 mb-4">
                Streamlining real estate transactions for buyers, sellers, and service providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/progress" className="text-slate-400 hover:text-white">
                    Transaction Progress
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-slate-400 hover:text-white">
                    Third Party Services
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="text-slate-400 hover:text-white">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/calendar" className="text-slate-400 hover:text-white">
                    Calendar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Homes in Better Hands. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
