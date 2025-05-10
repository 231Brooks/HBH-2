import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PostJobPage() {
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide information about the job you're looking to fill</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g. React Developer for E-commerce Website" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities, requirements, and any other relevant details"
                  className="min-h-[200px]"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="design">Design & Creative</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="admin-support">Admin Support</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="accounting">Accounting & Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <RadioGroup defaultValue="hourly">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly">Hourly rate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed price</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget-min">Budget</Label>
                  <div className="flex items-center gap-2">
                    <Input id="budget-min" placeholder="Min" type="number" />
                    <span>to</span>
                    <Input id="budget-max" placeholder="Max" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Project Duration</Label>
                  <Select>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 month</SelectItem>
                      <SelectItem value="1-3">1 to 3 months</SelectItem>
                      <SelectItem value="3-6">3 to 6 months</SelectItem>
                      <SelectItem value="more-than-6">More than 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Input id="skills" placeholder="e.g. React, JavaScript, CSS (separate with commas)" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Post Job</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t bg-white mt-12">
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
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Leadership
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Investor Relations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-green-600">
                    Careers
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
