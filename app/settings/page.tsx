"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { SharedHeader } from "@/components/shared-header"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreditCard, User, Mail, Phone, Shield, Bell, LogOut, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [showCardNumber, setShowCardNumber] = useState(false)

  // Mock user data
  const userData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/mystical-forest-spirit.png",
    cardInfo: {
      cardNumber: "•••• •••• •••• 4242",
      cardNumberFull: "4242 4242 4242 4242",
      expiryDate: "12/25",
      cvv: "•••",
    },
    identification: {
      idType: "Driver's License",
      idNumber: "DL12345678",
      issuedDate: "01/15/2020",
      expiryDate: "01/15/2028",
      verificationStatus: "Verified",
    },
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SharedHeader />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
                <Separator />
                <nav className="w-full">
                  <div className="flex flex-col w-full bg-transparent space-y-1">
                    <Button
                      variant={activeTab === "account" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    <Button
                      variant={activeTab === "payment" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("payment")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button
                      variant={activeTab === "identification" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("identification")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Identification
                    </Button>
                    <Button
                      variant={activeTab === "notifications" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                  </div>
                </nav>
                <Separator />
                <Button variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userData.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="janesmith" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                          <Input id="email" defaultValue={userData.email} />
                          <Button variant="outline" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input id="phone" defaultValue={userData.phone} />
                          <Button variant="outline" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment cards and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Credit & Debit Cards</h3>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-12 w-16 rounded-md flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <span>
                                    {showCardNumber ? userData.cardInfo.cardNumberFull : userData.cardInfo.cardNumber}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setShowCardNumber(!showCardNumber)}
                                  >
                                    {showCardNumber ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  </Button>
                                </div>
                                <span>Expires {userData.cardInfo.expiryDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" defaultValue="123 Main Street" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="San Francisco" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" defaultValue="CA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" defaultValue="94105" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="identification" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Identification</CardTitle>
                  <CardDescription>Manage your identification documents and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Verification Status</h3>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {userData.identification.verificationStatus}
                      </div>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">ID Type</p>
                            <p>{userData.identification.idType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                            <p>{userData.identification.idNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                            <p>{userData.identification.issuedDate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                            <p>{userData.identification.expiryDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-muted-foreground">
                        Your identity has been verified. This allows you to access all platform features.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Update Identification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id-type">ID Type</Label>
                        <select id="id-type" className="w-full p-2 border rounded-md">
                          <option value="drivers-license">Driver's License</option>
                          <option value="passport">Passport</option>
                          <option value="national-id">National ID</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id-number">ID Number</Label>
                        <Input id="id-number" defaultValue={userData.identification.idNumber} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id-upload">Upload ID Document (Front)</Label>
                      <Input id="id-upload" type="file" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id-upload-back">Upload ID Document (Back)</Label>
                      <Input id="id-upload-back" type="file" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Identification</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing emails</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about new products, features, and more.
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-security">Security alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails for login attempts, password changes, etc.
                          </p>
                        </div>
                        <Switch id="email-security" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-updates">Account updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about your account activity and changes.
                          </p>
                        </div>
                        <Switch id="email-updates" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">SMS Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-security">Security alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive text messages for important security alerts.
                          </p>
                        </div>
                        <Switch id="sms-security" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-updates">Account updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive text messages about your account activity.
                          </p>
                        </div>
                        <Switch id="sms-updates" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-marketing">Marketing messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive text messages about promotions and offers.
                          </p>
                        </div>
                        <Switch id="sms-marketing" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
