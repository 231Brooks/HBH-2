import Link from "next/link"
import { ArrowLeft, Briefcase, Clock, Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function JobPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              JobConnect
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/find-work" className="text-sm font-medium hover:text-green-600">
                Find Work
              </Link>
              <Link href="/my-jobs" className="text-sm font-medium hover:text-green-600">
                My Jobs
              </Link>
              <Link href="/reports" className="text-sm font-medium hover:text-green-600">
                Reports
              </Link>
              <Link href="/messages" className="text-sm font-medium hover:text-green-600">
                Messages
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Post a Job
            </Button>
            <Button size="sm" className="hidden md:flex">
              Sign Up
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-green-600 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">React Developer for E-commerce Website</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline">Hourly</Badge>
                    <Badge variant="outline">Intermediate</Badge>
                    <span className="text-sm text-gray-500">Posted 2 hours ago</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Star className="h-5 w-5" />
                  <span className="sr-only">Save job</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">CSS</Badge>
                <Badge variant="secondary">Redux</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Job Description</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We're looking for an experienced React developer to help build our e-commerce platform. You'll be
                  working with our team to implement new features and improve existing ones.
                </p>
                <p>
                  Our platform serves thousands of customers daily, and we're looking to enhance the user experience
                  with modern React practices and optimizations.
                </p>
                <h3 className="text-lg font-medium mt-6">Responsibilities:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Develop new user-facing features using React.js</li>
                  <li>Build reusable components and front-end libraries for future use</li>
                  <li>Translate designs and wireframes into high-quality code</li>
                  <li>Optimize components for maximum performance across devices and browsers</li>
                  <li>Collaborate with the back-end team to integrate front-end with APIs</li>
                </ul>
                <h3 className="text-lg font-medium mt-6">Requirements:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>3+ years of experience with React.js</li>
                  <li>Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model</li>
                  <li>Experience with popular React workflows (Redux, Hooks, etc)</li>
                  <li>Familiarity with RESTful APIs</li>
                  <li>Knowledge of modern authorization mechanisms, such as JWT</li>
                  <li>Experience with common front-end development tools</li>
                  <li>Ability to understand business requirements and translate them into technical requirements</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Activity on this job</h2>
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                  <span>15 proposals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>5 interviewing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>Client has hired 8 freelancers for similar projects</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About the client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Client" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">TechCorp Inc.</div>
                    <div className="text-sm text-gray-500">United States</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Member since Mar 2022</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Client Verification</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Payment verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Identity verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Email verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Experience Level</div>
                  <div className="font-medium">Intermediate</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Job Type</div>
                  <div className="font-medium">Hourly</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="font-medium">$30-50/hr</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">3+ months</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Hours per week</div>
                  <div className="font-medium">30+ hrs</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="container px-4 py-8 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold">For Clients</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    How to Hire
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Talent Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Project Catalog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">For Talent</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    How to Find Work
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Direct Contracts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Find Freelance Jobs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t md:flex-row">
            <p className="text-sm text-gray-500">© 2025 JobConnect Inc. All rights reserved.</p>
            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
