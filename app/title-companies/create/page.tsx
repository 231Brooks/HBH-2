"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import { createTitleCompany } from "@/app/actions/title-company-actions"
import { toast } from "@/components/ui/use-toast"

export default function CreateTitleCompanyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?key=6gk1v")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    formData.append("logo", logoUrl)

    try {
      const result = await createTitleCompany(formData)

      if (result.success) {
        toast({
          title: "Title company created",
          description: "Your title company has been created successfully.",
        })
        router.push(`/title-companies/${result.titleCompanyId}/dashboard`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create title company",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // In a real app, this would upload to a storage service
  const handleLogoUpload = () => {
    // Placeholder for logo upload functionality
    // Would typically use a file input and upload to a service like Cloudinary
    const placeholderLogos = ["/placeholder.svg?key=4q9k0", "/placeholder.svg?key=dm3o1", "/placeholder.svg?key=3pubn"]

    const randomLogo = placeholderLogos[Math.floor(Math.random() * placeholderLogos.length)]
    setLogoUrl(randomLogo)

    toast({
      title: "Logo updated",
      description: "This is a placeholder. In a real app, you would upload your logo.",
    })
  }

  return (
    <div className="container py-8">
      <Link href="/title-companies" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} />
        <span>Back to Title Companies</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create Title Company</h1>
        <p className="text-muted-foreground mb-8">Register your title company to manage transactions</p>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Title Company Information</CardTitle>
              <CardDescription>Enter the details of your title company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center mb-4">
                <div
                  className="h-24 w-24 rounded-lg overflow-hidden border mb-4"
                  style={{ backgroundImage: `url(${logoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleLogoUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" name="zipCode" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" placeholder="https://" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" type="button" asChild>
                <Link href="/title-companies">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Title Company"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
