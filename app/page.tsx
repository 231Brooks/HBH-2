import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, Briefcase, Gavel, FileText, Users, MapPin, ArrowRight } from "lucide-react"
import { FrontPageAds } from "@/components/advertising/ad-banner"

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section with responsive design */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Real Estate Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container relative z-10 py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Homes in Better Hands
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-slate-200 leading-relaxed max-w-3xl">
              The all-in-one platform connecting buyers, sellers, title companies, and service providers for seamless
              real estate transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/services">Find Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Front Page Ads with responsive container */}
      <section className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <FrontPageAds />
      </section>

      {/* Features Section with responsive design */}
      <section className="container mx-auto py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Everything You Need in One Place
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Our comprehensive platform streamlines the real estate process from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Transaction Progress</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Track closing progress, share documents, and collaborate with title companies in real-time.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/progress" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Property Marketplace</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Browse, list, and auction properties with interactive maps and direct messaging.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/marketplace" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Service Directory</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Find and hire trusted third-party services for all your real estate needs.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/services" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <Gavel className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Property Auctions</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Participate in transparent property auctions with real-time bidding and updates.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/marketplace?tab=auctions" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Integrated Calendar</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Manage all your appointments and deadlines in one centralized calendar.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/calendar" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 flex-shrink-0">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Contractor Jobs</h3>
                <p className="text-sm sm:text-base text-muted-foreground flex-grow leading-relaxed">
                  Post and find specialized real estate contracting jobs and projects.
                </p>
                <Button variant="link" asChild className="mt-4 flex-shrink-0">
                  <Link href="/contracts" className="flex items-center text-sm sm:text-base">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties with responsive design */}
      <section className="bg-slate-50 py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Properties</h2>
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/marketplace">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48 sm:h-56 flex-shrink-0">
                  <Image
                    src={`/placeholder.svg?height=400&width=600&text=Property+${i}`}
                    alt={`Property ${i}`}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary text-xs sm:text-sm">For Sale</Badge>
                </div>
                <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1">
                    <h3 className="text-base sm:text-lg font-semibold line-clamp-1">Modern Family Home</h3>
                    <p className="font-bold text-primary text-lg sm:text-xl flex-shrink-0">$425,000</p>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs sm:text-sm mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span>Phoenix, AZ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                    Beautiful 4 bedroom, 3 bathroom home with modern finishes and spacious backyard.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">4 Beds</Badge>
                      <Badge variant="outline" className="text-xs">3 Baths</Badge>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">2,400 sqft</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with responsive design */}
      <section className="container mx-auto py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Popular Services</h2>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/services">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {[
            { name: "Title Services", category: "TITLE_SERVICES", icon: "🏛️" },
            { name: "Home Inspection", category: "HOME_INSPECTION", icon: "🔍" },
            { name: "Real Estate Photography", category: "PHOTOGRAPHY", icon: "📸" },
            { name: "Renovation", category: "CONTRACTORS", icon: "🔨" }
          ].map((service, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="relative h-32 sm:h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl sm:text-4xl">{service.icon}</span>
              </div>
              <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                  Professional {service.name.toLowerCase()} from verified providers.
                </p>
                <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm" asChild>
                  <Link href={`/services?category=${service.category}`}>Find Providers</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section with responsive design */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of users who are streamlining their real estate transactions with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with responsive design */}
      <footer className="bg-slate-900 text-slate-200 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">HomesBH</h3>
              <p className="text-slate-400 mb-4 text-sm sm:text-base leading-relaxed">
                Streamlining real estate transactions for buyers, sellers, and service providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link href="/progress" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Transaction Progress
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Third Party Services
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/calendar" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Calendar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-slate-400">
            <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Homes in Better Hands. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
