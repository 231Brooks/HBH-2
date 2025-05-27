"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<"individual" | "business">("individual")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // In a real app, this would submit to your authentication API
      console.log("Account creation submitted")
      router.push("/auth/verify")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Account Details" : "Profile Setup"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <Tabs defaultValue="individual" onValueChange={(v) => setAccountType(v as "individual" | "business")}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="individual">Individual</TabsTrigger>
                      <TabsTrigger value="business">Business</TabsTrigger>
                    </TabsList>

                    <TabsContent value="individual" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" placeholder="Smith" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="john.smith@example.com" type="email" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input id="phone" placeholder="(555) 123-4567" type="tel" required />
                      </div>
                    </TabsContent>

                    <TabsContent value="business" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business name</Label>
                        <Input id="business-name" placeholder="Acme Real Estate" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-email">Business email</Label>
                        <Input id="business-email" placeholder="contact@acmerealestate.com" type="email" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-phone">Business phone</Label>
                        <Input id="business-phone" placeholder="(555) 987-6543" type="tel" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-type">Business type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real-estate-agency">Real Estate Agency</SelectItem>
                            <SelectItem value="title-company">Title Company</SelectItem>
                            <SelectItem value="mortgage-broker">Mortgage Broker</SelectItem>
                            <SelectItem value="home-inspection">Home Inspection</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-password">Create password</Label>
                    <Input id="create-password" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Password requirements</Label>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li className="flex items-center">
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                        At least one uppercase letter
                      </li>
                      <li className="flex items-center">
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                        At least one number
                      </li>
                      <li className="flex items-center">
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                        At least one special character
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-question">Security question</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a security question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-pet">What was the name of your first pet?</SelectItem>
                        <SelectItem value="mother-maiden">What is your mother's maiden name?</SelectItem>
                        <SelectItem value="birth-city">What city were you born in?</SelectItem>
                        <SelectItem value="first-school">What was the name of your first school?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-answer">Your answer</Label>
                    <Input id="security-answer" type="text" required />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  {accountType === "individual" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="City, State" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profile-image">Profile image</Label>
                        <Input id="profile-image" type="file" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Brief bio</Label>
                        <Input id="bio" placeholder="Tell us about yourself" />
                      </div>

                      <div className="space-y-2">
                        <Label>Interested in</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="buying" />
                            <label htmlFor="buying" className="text-sm">
                              Buying property
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="selling" />
                            <label htmlFor="selling" className="text-sm">
                              Selling property
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="investing" />
                            <label htmlFor="investing" className="text-sm">
                              Investing
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="services" />
                            <label htmlFor="services" className="text-sm">
                              Finding services
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="business-location">Business location</Label>
                        <Input id="business-location" placeholder="City, State" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-logo">Business logo</Label>
                        <Input id="business-logo" type="file" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-description">Business description</Label>
                        <Input id="business-description" placeholder="Tell us about your business" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-website">Website (optional)</Label>
                        <Input id="business-website" placeholder="https://yourwebsite.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="license-number">License number (if applicable)</Label>
                        <Input id="license-number" placeholder="Professional license number" />
                      </div>
                    </>
                  )}

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox id="terms" required />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the terms and conditions
                      </label>
                      <p className="text-xs text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <Link href="#" className="text-primary underline hover:no-underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-primary underline hover:no-underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4 justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button type="submit" className={step > 1 ? "flex-1" : "w-full"}>
                  {step < 3 ? "Continue" : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t pt-5">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline hover:no-underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
