import Link from "next/link"
import { Search, Filter, MapPin, Clock, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              My Applications
            </Button>
            <Button size="sm">Post a Job</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Job Type</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="remote" className="mr-2" />
                    <label htmlFor="remote" className="text-sm">
                      Remote
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="onsite" className="mr-2" />
                    <label htmlFor="onsite" className="text-sm">
                      On-site
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="hybrid" className="mr-2" />
                    <label htmlFor="hybrid" className="text-sm">
                      Hybrid
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Experience Level</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="entry" className="mr-2" />
                    <label htmlFor="entry" className="text-sm">
                      Entry Level
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="mid" className="mr-2" />
                    <label htmlFor="mid" className="text-sm">
                      Mid Level
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="senior" className="mr-2" />
                    <label htmlFor="senior" className="text-sm">
                      Senior Level
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Salary Range</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="salary-1" className="mr-2" />
                    <label htmlFor="salary-1" className="text-sm">
                      $0 - $50k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="salary-2" className="mr-2" />
                    <label htmlFor="salary-2" className="text-sm">
                      $50k - $100k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="salary-3" className="mr-2" />
                    <label htmlFor="salary-3" className="text-sm">
                      $100k - $150k
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="salary-4" className="mr-2" />
                    <label htmlFor="salary-4" className="text-sm">
                      $150k+
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Job Categories</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="tech" className="mr-2" />
                    <label htmlFor="tech" className="text-sm">
                      Technology
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="design" className="mr-2" />
                    <label htmlFor="design" className="text-sm">
                      Design
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="marketing" className="mr-2" />
                    <label htmlFor="marketing" className="text-sm">
                      Marketing
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="finance" className="mr-2" />
                    <label htmlFor="finance" className="text-sm">
                      Finance
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search jobs..." className="pl-8 w-full md:w-[300px]" />
                  </div>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="relevant">Most Relevant</SelectItem>
                      <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                      <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="remote">Remote</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="applied">Applied</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-4">
                    <JobCard
                      id="1"
                      title="Senior Frontend Developer"
                      company="TechCorp Inc."
                      location="Remote"
                      type="Full-time"
                      salary="$120k - $150k"
                      posted="2 days ago"
                      description="We're looking for a Senior Frontend Developer to join our team. You'll be responsible for building user interfaces for our web applications."
                      skills={["React", "TypeScript", "CSS", "HTML"]}
                    />
                    <JobCard
                      id="2"
                      title="UX/UI Designer"
                      company="DesignHub"
                      location="New York, NY"
                      type="Full-time"
                      salary="$90k - $110k"
                      posted="1 week ago"
                      description="Join our design team to create beautiful and intuitive user experiences for our clients' products."
                      skills={["Figma", "Adobe XD", "Sketch", "User Research"]}
                    />
                    <JobCard
                      id="3"
                      title="Marketing Manager"
                      company="GrowthBoost"
                      location="Hybrid (Chicago, IL)"
                      type="Full-time"
                      salary="$80k - $100k"
                      posted="3 days ago"
                      description="We're seeking a Marketing Manager to develop and implement marketing strategies to promote our products and services."
                      skills={["Digital Marketing", "SEO", "Content Strategy", "Analytics"]}
                    />
                    <JobCard
                      id="4"
                      title="Financial Analyst"
                      company="Capital Investments"
                      location="Boston, MA"
                      type="Full-time"
                      salary="$75k - $95k"
                      posted="5 days ago"
                      description="Join our finance team to analyze financial data, prepare reports, and provide insights to support business decisions."
                      skills={["Financial Modeling", "Excel", "Data Analysis", "Forecasting"]}
                    />
                    <JobCard
                      id="5"
                      title="Backend Developer"
                      company="ServerStack"
                      location="Remote"
                      type="Contract"
                      salary="$100k - $130k"
                      posted="1 day ago"
                      description="We're looking for a Backend Developer to design and implement server-side applications and APIs."
                      skills={["Node.js", "Python", "SQL", "AWS"]}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="remote" className="space-y-4">
                  <div className="space-y-4">
                    <JobCard
                      id="1"
                      title="Senior Frontend Developer"
                      company="TechCorp Inc."
                      location="Remote"
                      type="Full-time"
                      salary="$120k - $150k"
                      posted="2 days ago"
                      description="We're looking for a Senior Frontend Developer to join our team. You'll be responsible for building user interfaces for our web applications."
                      skills={["React", "TypeScript", "CSS", "HTML"]}
                    />
                    <JobCard
                      id="5"
                      title="Backend Developer"
                      company="ServerStack"
                      location="Remote"
                      type="Contract"
                      salary="$100k - $130k"
                      posted="1 day ago"
                      description="We're looking for a Backend Developer to design and implement server-side applications and APIs."
                      skills={["Node.js", "Python", "SQL", "AWS"]}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="saved" className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Star className="h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-medium">No saved jobs yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Jobs you save will appear here for easy access</p>
                  </div>
                </TabsContent>
                <TabsContent value="applied" className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Jobs you've applied to will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function JobCard({ id, title, company, location, type, salary, posted, description, skills }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/jobs/${id}`} className="hover:underline">
                <h3 className="text-lg font-semibold">{title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">{company}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {posted}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
              <span className="sr-only">Save job</span>
            </Button>
          </div>
          <p className="text-sm">{description}</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/20 px-6 py-4">
        <div className="font-medium">{salary}</div>
        <Button>Apply Now</Button>
      </CardFooter>
    </Card>
  )
}
