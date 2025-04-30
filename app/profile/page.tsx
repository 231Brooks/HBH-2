import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Building,
  FileText,
  Settings,
  Edit,
  Plus,
  MessageSquare,
  Calendar,
  Clock,
  ArrowUpRight,
  Gavel,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Cover" fill className="object-cover opacity-50" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-white"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 bg-white hover:bg-slate-100 text-slate-700 rounded-full h-8 w-8 shadow-sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>John Smith</CardTitle>
              <CardDescription>Real Estate Investor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Member since January 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>john.smith@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Phoenix, Arizona</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>4.9 Rating (24 reviews)</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    Real estate investor with 5+ years of experience in residential and commercial properties. Focused
                    on property flips and long-term rentals in the Phoenix area.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your account verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email</span>
                  </div>
                  <Badge className="bg-green-500">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Phone</span>
                  </div>
                  <Badge className="bg-green-500">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>ID Verification</span>
                  </div>
                  <Badge className="bg-green-500">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Business Verification</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Frequently used pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/marketplace/create">
                    <Plus className="mr-2 h-4 w-4" /> List New Property
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/progress/create">
                    <FileText className="mr-2 h-4 w-4" /> Start New Transaction
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" /> View Calendar
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/services">
                    <Building className="mr-2 h-4 w-4" /> Find Services
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" /> Account Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="properties">
            <TabsList className="mb-6">
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Listed Properties</h3>
                <Button asChild>
                  <Link href="/marketplace/create">
                    <Plus className="mr-2 h-4 w-4" /> List Property
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src="/placeholder.svg?height=400&width=600" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary">For Sale</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Modern Family Home</h3>
                      <p className="font-bold text-primary">$425,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>123 Main Street, Phoenix, AZ</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-2">
                        <Badge variant="outline">4 Beds</Badge>
                        <Badge variant="outline">3 Baths</Badge>
                        <Badge variant="outline">2,400 sqft</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href="/marketplace/1">
                          <ArrowUpRight className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src="/placeholder.svg?height=400&width=600" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      <Gavel className="mr-1 h-3 w-3" /> Auction
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Investment Property</h3>
                      <p className="font-bold text-primary">Starting Bid: $350,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>789 Pine Road, Tempe, AZ</span>
                    </div>
                    <div className="flex items-center text-amber-600 text-sm mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Ends: Jul 15, 2023</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-2">
                        <Badge variant="outline">3 Beds</Badge>
                        <Badge variant="outline">2 Baths</Badge>
                        <Badge variant="outline">2,100 sqft</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href="/marketplace/3">
                          <ArrowUpRight className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mt-8">
                <h3 className="text-lg font-semibold">Saved Properties</h3>
                <Button variant="outline" asChild>
                  <Link href="/marketplace?tab=saved">View All Saved</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src="/placeholder.svg?height=400&width=600" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary">For Sale</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Downtown Condo</h3>
                      <p className="font-bold text-primary">$750,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>456 Oak Avenue, Scottsdale, AZ</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-2">
                        <Badge variant="outline">2 Beds</Badge>
                        <Badge variant="outline">2 Baths</Badge>
                        <Badge variant="outline">1,800 sqft</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href="/marketplace/2">
                          <ArrowUpRight className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="mr-1 h-4 w-4" /> Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Transactions</h3>
                <Button asChild>
                  <Link href="/progress/create">
                    <Plus className="mr-2 h-4 w-4" /> New Transaction
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">123 Main Street, Phoenix, AZ</h3>
                          <Badge className="bg-amber-500">In Progress</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Purchase - $425,000 - Due: Jul 15, 2023</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Progress: 65%</div>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 w-[65%]"></div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/progress/1">
                            <ArrowUpRight className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">456 Oak Avenue, Scottsdale, AZ</h3>
                          <Badge className="bg-blue-500">Pending Approval</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Purchase - $750,000 - Due: Aug 3, 2023</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Progress: 40%</div>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 w-[40%]"></div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/progress/2">
                            <ArrowUpRight className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mt-8">
                <h3 className="text-lg font-semibold">Completed Transactions</h3>
                <Button variant="outline" asChild>
                  <Link href="/progress?tab=completed">View All Completed</Link>
                </Button>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">222 Valley View, Chandler, AZ</h3>
                          <Badge className="bg-green-600">Completed</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Purchase - $475,000 - Closed: Jun 10, 2023</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Progress: 100%</div>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 rounded-full h-2 w-full"></div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/progress/3">
                            <ArrowUpRight className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Projects</h3>
                <Button asChild>
                  <Link href="/projects/create">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Kitchen Renovation</CardTitle>
                    <CardDescription>101 River Lane, Mesa, AZ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 w-[45%]"></div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Due: Aug 15, 2023</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>Contractor: Reliable Renovation</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href="/projects/1">
                            <ArrowUpRight className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="mr-1 h-4 w-4" /> Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-lg">4.9</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Michael Thompson</h3>
                            <Badge variant="outline" className="text-xs">
                              Buyer
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-sm">
                        John was exceptional in handling our property transaction. His attention to detail and proactive
                        communication made the process smooth and efficient. Highly recommend!
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Jennifer Garcia</h3>
                            <Badge variant="outline" className="text-xs">
                              Seller
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-sm">
                        Working with John was a pleasure. He was responsive, knowledgeable, and made selling my property
                        a breeze. I got more than my asking price thanks to his market expertise.
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Robert Wilson</h3>
                            <Badge variant="outline" className="text-xs">
                              Business Partner
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-4 w-4" />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">2 months ago</span>
                      </div>
                      <p className="text-sm">
                        I've worked with John on multiple investment properties and he consistently delivers excellent
                        results. He's thorough, professional, and always meets deadlines.
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
