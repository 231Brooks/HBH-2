"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Mail, Phone, FileCheck, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VerifyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [identityVerified, setIdentityVerified] = useState(false)

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setEmailVerified(true)
      setLoading(false)
    }, 1500)
  }

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setPhoneVerified(true)
      setLoading(false)
    }, 1500)
  }

  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIdentityVerified(true)
      setLoading(false)
    }, 1500)
  }

  const continueToProfile = () => {
    router.push("/profile")
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Verify Your Account</CardTitle>
            <CardDescription className="text-center">
              Complete verification steps to access all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" disabled={emailVerified}>
                  Email
                  {emailVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-500" />}
                </TabsTrigger>
                <TabsTrigger value="phone" disabled={phoneVerified || !emailVerified}>
                  Phone
                  {phoneVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-500" />}
                </TabsTrigger>
                <TabsTrigger value="identity" disabled={identityVerified || !phoneVerified}>
                  Identity
                  {identityVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-500" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4 pt-4">
                {!emailVerified ? (
                  <form onSubmit={handleVerifyEmail}>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">A verification code has been sent to:</p>
                          <p className="font-medium">j***@example.com</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-code">Enter verification code</Label>
                        <Input
                          id="email-code"
                          placeholder="6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Email"}
                      </Button>

                      <div className="text-sm text-center text-muted-foreground">
                        Didn't receive the code?{" "}
                        <Button variant="link" className="p-0 h-auto">
                          Resend
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Email Verified</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Your email address has been successfully verified.
                    </p>
                    <Button onClick={() => setActiveTab("phone")}>Continue to Phone Verification</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="phone" className="space-y-4 pt-4">
                {!phoneVerified ? (
                  <form onSubmit={handleVerifyPhone}>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">A text message with a verification code has been sent to:</p>
                          <p className="font-medium">(555) ***-4567</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone-code">Enter verification code</Label>
                        <Input
                          id="phone-code"
                          placeholder="6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Phone"}
                      </Button>

                      <div className="text-sm text-center text-muted-foreground">
                        Didn't receive the code?{" "}
                        <Button variant="link" className="p-0 h-auto">
                          Resend
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Phone Verified</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Your phone number has been successfully verified.
                    </p>
                    <Button onClick={() => setActiveTab("identity")}>Continue to Identity Verification</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="identity" className="space-y-4 pt-4">
                {!identityVerified ? (
                  <form onSubmit={handleVerifyIdentity}>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">
                            Please upload a photo of your government-issued ID to verify your identity.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="id-front">Upload ID (front)</Label>
                        <Input id="id-front" type="file" accept="image/*" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="id-back">Upload ID (back)</Label>
                        <Input id="id-back" type="file" accept="image/*" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="selfie">Upload selfie with ID</Label>
                        <Input id="selfie" type="file" accept="image/*" required />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          Your ID information is encrypted and will only be used for verification purposes. We follow
                          strict privacy guidelines.
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Submit for Verification"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Identity Verified</h3>
                    <Badge className="mb-4 bg-green-500">Fully Verified</Badge>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Congratulations! Your account is now fully verified and you have access to all features.
                    </p>
                    <Button onClick={continueToProfile}>Continue to Profile</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t pt-5">
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{
                  width:
                    emailVerified && phoneVerified && identityVerified
                      ? "100%"
                      : emailVerified && phoneVerified
                        ? "66%"
                        : emailVerified
                          ? "33%"
                          : "0%",
                }}
              ></div>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {emailVerified && phoneVerified && identityVerified
                ? "100% Complete"
                : emailVerified && phoneVerified
                  ? "66% Complete - Identity Verification Pending"
                  : emailVerified
                    ? "33% Complete - Phone Verification Pending"
                    : "0% Complete - Email Verification Pending"}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
