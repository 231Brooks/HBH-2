import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Filter } from "lucide-react"
import JobListingCard from "./components/job-listing-card"
import ProfessionalCard from "./components/professional-card"
import FeaturedCategories from "./components/featured-categories"

export default function JobMarketplace() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Find Real Estate Professionals for Your Next Project
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Connect with verified title companies, inspectors, contractors, and more - all in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  placeholder="Search for services or professionals..."
                  className="pl-10 py-6 rounded-md border-slate-300 bg-white"
                />
              </div>
              <div className="relative flex-grow-0">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <Input placeholder="Location" className="pl-10 py-6 rounded-md border-slate-300 bg-white" />
              </div>
              <Button className="py-6 px-6">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <FeaturedCategories />

        <Tabs defaultValue="browse" className="mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="browse">Browse Professionals</TabsTrigger>
              <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={16} />
                Filters
              </Button>
              <select className="border rounded-md px-3 py-1 text-sm bg-white">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
              </select>
            </div>
          </div>

          <TabsContent value="browse" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProfessionalCard
                name="Sarah Johnson"
                title="Title Company Agent"
                rating={4.9}
                reviews={124}
                hourlyRate={85}
                location="Phoenix, AZ"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Title Services", "Escrow", "Closing"]}
                description="Experienced title agent with 10+ years in residential and commercial real estate transactions."
              />
              <ProfessionalCard
                name="Michael Rodriguez"
                title="Home Inspector"
                rating={4.8}
                reviews={87}
                hourlyRate={75}
                location="Dallas, TX"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Inspections", "Reports", "Residential"]}
                description="Certified home inspector specializing in thorough property evaluations and detailed reports."
              />
              <ProfessionalCard
                name="Jennifer Lee"
                title="Real Estate Attorney"
                rating={4.9}
                reviews={56}
                hourlyRate={150}
                location="Chicago, IL"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Legal", "Contracts", "Disputes"]}
                description="Specialized in real estate law with expertise in contract review and transaction guidance."
              />
              <ProfessionalCard
                name="David Wilson"
                title="Renovation Contractor"
                rating={4.7}
                reviews={93}
                hourlyRate={65}
                location="Miami, FL"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Renovations", "Remodeling", "Construction"]}
                description="Full-service contractor for home renovations, kitchen remodels, and property improvements."
              />
              <ProfessionalCard
                name="Amanda Taylor"
                title="Property Photographer"
                rating={4.8}
                reviews={42}
                hourlyRate={60}
                location="Seattle, WA"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Photography", "Virtual Tours", "Staging"]}
                description="Professional photographer specializing in real estate listings and virtual property tours."
              />
              <ProfessionalCard
                name="Robert Chen"
                title="Mortgage Broker"
                rating={4.6}
                reviews={78}
                hourlyRate={90}
                location="Boston, MA"
                imageUrl="/placeholder.svg?height=300&width=300"
                tags={["Mortgage", "Financing", "Loans"]}
                description="Experienced mortgage broker helping clients secure the best financing options for their property purchases."
              />
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Professionals</Button>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            <div className="flex justify-end mb-6">
              <Button>Post a Job</Button>
            </div>
            <div className="space-y-4">
              <JobListingCard
                title="Title Services for Multi-Family Property"
                location="Phoenix, AZ"
                budget="$1,500 - $2,000"
                postedTime="2 hours ago"
                description="Looking for a title company to handle closing for a 12-unit apartment building purchase. Need thorough title search and escrow services."
                skills={["Title Search", "Escrow", "Commercial Property"]}
                proposals={4}
              />
              <JobListingCard
                title="Home Inspector Needed for New Construction"
                location="Austin, TX"
                budget="$400 - $600"
                postedTime="5 hours ago"
                description="Seeking a certified home inspector for a newly constructed 4-bedroom home. Need thorough inspection and detailed report."
                skills={["New Construction", "Inspection Reports", "Electrical"]}
                proposals={7}
              />
              <JobListingCard
                title="Real Estate Attorney for Contract Review"
                location="Remote"
                budget="$300 - $500"
                postedTime="1 day ago"
                description="Need a real estate attorney to review purchase agreement for commercial property. Quick turnaround required."
                skills={["Contract Review", "Commercial Real Estate", "Legal Advice"]}
                proposals={12}
              />
              <JobListingCard
                title="Kitchen Renovation Contractor"
                location="Denver, CO"
                budget="$15,000 - $25,000"
                postedTime="2 days ago"
                description="Looking for an experienced contractor to renovate a kitchen in a 1990s home. Need design assistance and full renovation services."
                skills={["Kitchen Remodeling", "Cabinetry", "Countertops"]}
                proposals={9}
              />
              <JobListingCard
                title="Professional Photographer for Luxury Listing"
                location="Miami, FL"
                budget="$500 - $800"
                postedTime="3 days ago"
                description="Need a professional photographer for a luxury waterfront property. Drone photography and virtual tour capabilities required."
                skills={["Luxury Properties", "Drone Photography", "Virtual Tours"]}
                proposals={15}
              />
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline">View More Job Listings</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-slate-50 rounded-lg p-8 border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Are You a Real Estate Professional?</h2>
            <p className="text-slate-600 mb-6">
              Join our marketplace to connect with clients, showcase your expertise, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>Create Professional Profile</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
