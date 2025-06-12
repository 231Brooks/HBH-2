"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

function PostJobContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/job-marketplace" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} />
        <span>Back to Job Marketplace</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-slate-600 mb-8">Find the perfect professional for your real estate needs</p>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide detailed information to attract qualified professionals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" placeholder="e.g., Title Services for Residential Property" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title Services</SelectItem>
                    <SelectItem value="inspection">Home Inspection</SelectItem>
                    <SelectItem value="legal">Legal Services</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="design">Interior Design</SelectItem>
                    <SelectItem value="moving">Moving Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State or Remote" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget-min">Budget Range</Label>
                <div className="flex items-center gap-2">
                  <Input id="budget-min" placeholder="Min" type="number" />
                  <span>to</span>
                  <Input id="budget-max" placeholder="Max" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Project Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job in detail, including requirements and expectations..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill1" />
                  <label htmlFor="skill1" className="text-sm">
                    Title Search
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill2" />
                  <label htmlFor="skill2" className="text-sm">
                    Escrow Services
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill3" />
                  <label htmlFor="skill3" className="text-sm">
                    Contract Review
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill4" />
                  <label htmlFor="skill4" className="text-sm">
                    Property Inspection
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill5" />
                  <label htmlFor="skill5" className="text-sm">
                    Photography
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill6" />
                  <label htmlFor="skill6" className="text-sm">
                    Renovation
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill7" />
                  <label htmlFor="skill7" className="text-sm">
                    Legal Advice
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="skill8" />
                  <label htmlFor="skill8" className="text-sm">
                    Mortgage Services
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <p className="text-sm text-slate-500 mb-2">Drag and drop files here, or click to browse</p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
                <p className="text-xs text-slate-400 mt-2">Max file size: 10MB. Supported formats: PDF, JPG, PNG</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
                <p className="text-sm text-slate-500">
                  By posting this job, you agree to our{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">Save as Draft</Button>
            <Button>Post Job</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function PostJob() {
  return (
    <ProtectedRoute>
      <RoleGuard
        requiredPermission="canPostJobs"
        fallback={
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
              <p className="text-muted-foreground mb-6">
                You need a User account to post jobs. Professionals can apply to existing jobs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/profile">Update Account Type</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/job-marketplace">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        }
      >
        <PostJobContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
