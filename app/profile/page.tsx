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
    <div className="container py-4 md:py-8 px-2 md:px-4">
      <div className="relative mb-8">
        <div className="h-32 md:h-48 w-full rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden">
          <Image src="/vibrant-flow.png" alt="Cover" fill className="object-cover opacity-50" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-8 flex items-end">
          <div className="relative">
            <Image
              src="/confident-professional.png"
              alt="Profile"
              width={90}
              height={90}
              className="rounded-full border-4 border-white md:w-[120px] md:h-[120px]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 bg-white hover:bg-slate-100 text-slate-700 rounded-full h-6 w-6 md:h-8 md:w-8 shadow-sm"
            >
              <Edit className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
        <div className="w-full md:w-1/3 space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle>John Smith</CardTitle>
              <CardDescription>Real Estate Investor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">Member since January 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">john.smith@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">Phoenix, Arizona</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">4.9 Rating (24 reviews)</span>
                </div>
                <div className="pt-3 md:pt-4 border-t">
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Real estate investor with 5+ years of experience in residential and commercial properties. Focused
                    on property flips and long-term rentals in the Phoenix area.
                  </p>
                  <Button variant="outline" className="w-full text-sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-base md:text-lg">Verification Status</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your account verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Badge className="bg-green-500 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <Badge className="bg-green-500 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">ID Verification</span>
                  </div>
                  <Badge className="bg-green-500 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Business Verification</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-base md:text-lg">Quick Links</CardTitle>
              <CardDescription className="text-xs md:text-sm">Frequently used pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/marketplace/create">
                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" /> List New Property
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/progress/create">
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" /> Start New Transaction
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4 flex-shrink-0" /> View Calendar
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/services">
                    <Building className="mr-2 h-4 w-4 flex-shrink-0" /> Find Services
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4 flex-shrink-0" /> Account Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-4 md:mb-6 w-full overflow-x-auto flex flex-nowrap whitespace-nowrap">
              <TabsTrigger value="properties" className="text-xs md:text-sm px-2 md:px-4">
                My Properties
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs md:text-sm px-2 md:px-4">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs md:text-sm px-2 md:px-4">
                Projects
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs md:text-sm px-2 md:px-4">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-0 space-y-4 md:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Listed Properties</h3>
                <Button size="sm" className="text-xs md:text-sm" asChild>
                  <Link href="/marketplace/create">
                    <Plus className="mr-1 h-3 w-3 md:h-4 md:w-4" /> List Property
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="overflow-hidden">
                  <div className="relative h-40 md:h-48">
                    <Image src="/placeholder.svg?key=cjmtx" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary text-xs">For Sale</Badge>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm md:text-base">Modern Family Home</h3>
                      <p className="font-bold text-primary text-sm md:text-base">$425,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs md:text-sm mb-2 md:mb-3">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">123 Main Street, Phoenix, AZ</span>
                    </div>
                    <div className="flex flex-wrap justify-start mb-3 md:mb-4 gap-1 md:gap-2">
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        4 Beds
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        3 Baths
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        2,400 sqft
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8" asChild>
                        <Link href="/marketplace/1">
                          <ArrowUpRight className="mr-1 h-3 w-3 md:h-4 md:w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8">
                        <Edit className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-40 md:h-48">
                    <Image src="/house-key-growth.png" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-amber-500 text-xs">
                      <Gavel className="mr-1 h-3 w-3" /> Auction
                    </Badge>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm md:text-base">Investment Property</h3>
                      <p className="font-bold text-primary text-sm md:text-base">Starting Bid: $350,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs md:text-sm mb-2">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">789 Pine Road, Tempe, AZ</span>
                    </div>
                    <div className="flex items-center text-amber-600 text-xs md:text-sm mb-2">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                      <span>Ends: Jul 15, 2023</span>
                    </div>
                    <div className="flex flex-wrap justify-start mb-3 md:mb-4 gap-1 md:gap-2">
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        3 Beds
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        2 Baths
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        2,100 sqft
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8" asChild>
                        <Link href="/marketplace/3">
                          <ArrowUpRight className="mr-1 h-3 w-3 md:h-4 md:w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8">
                        <Edit className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mt-6 md:mt-8">
                <h3 className="text-base md:text-lg font-semibold">Saved Properties</h3>
                <Button variant="outline" size="sm" className="text-xs md:text-sm" asChild>
                  <Link href="/marketplace?tab=saved">View All Saved</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="overflow-hidden">
                  <div className="relative h-40 md:h-48">
                    <Image src="/city-lights-condo.png" alt="Property" fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary text-xs">For Sale</Badge>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm md:text-base">Downtown Condo</h3>
                      <p className="font-bold text-primary text-sm md:text-base">$750,000</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs md:text-sm mb-2 md:mb-3">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">456 Oak Avenue, Scottsdale, AZ</span>
                    </div>
                    <div className="flex flex-wrap justify-start mb-3 md:mb-4 gap-1 md:gap-2">
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        2 Beds
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        2 Baths
                      </Badge>
                      <Badge variant="outline" className="text-[10px] md:text-xs">
                        1,800 sqft
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8" asChild>
                        <Link href="/marketplace/2">
                          <ArrowUpRight className="mr-1 h-3 w-3 md:h-4 md:w-4" /> View
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1 text-xs md:text-sm h-8">
                        <MessageSquare className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-0 space-y-4 md:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Active Transactions</h3>
                <Button size="sm" className="text-xs md:text-sm" asChild>
                  <Link href="/progress/create">
                    <Plus className="mr-1 h-3 w-3 md:h-4 md:w-4" /> New Transaction
                  </Link>
                </Button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm md:text-base truncate">123 Main Street, Phoenix, AZ</h3>
                          <Badge className="bg-amber-500 text-xs">In Progress</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Purchase - $425,000 - Due: Jul 15, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">Progress: 65%</div>
                        <div className="w-full md:w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 w-[65%]"></div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto md:ml-0 h-7 text-xs" asChild>
                          <Link href="/progress/1">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm md:text-base truncate">
                            456 Oak Avenue, Scottsdale, AZ
                          </h3>
                          <Badge className="bg-blue-500 text-xs">Pending Approval</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Purchase - $750,000 - Due: Aug 3, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">Progress: 40%</div>
                        <div className="w-full md:w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 w-[40%]"></div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto md:ml-0 h-7 text-xs" asChild>
                          <Link href="/progress/2">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mt-6 md:mt-8">
                <h3 className="text-base md:text-lg font-semibold">Completed Transactions</h3>
                <Button variant="outline" size="sm" className="text-xs md:text-sm" asChild>
                  <Link href="/progress?tab=completed">View All Completed</Link>
                </Button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm md:text-base truncate">222 Valley View, Chandler, AZ</h3>
                          <Badge className="bg-green-600 text-xs">Completed</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Purchase - $475,000 - Closed: Jun 10, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">Progress: 100%</div>
                        <div className="w-full md:w-32 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 rounded-full h-2 w-full"></div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto md:ml-0 h-7 text-xs" asChild>
                          <Link href="/progress/3">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0 space-y-4 md:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Active Projects</h3>
                <Button size="sm" className="text-xs md:text-sm" asChild>
                  <Link href="/projects/create">
                    <Plus className="mr-1 h-3 w-3 md:h-4 md:w-4" /> New Project
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base md:text-lg">Kitchen Renovation</CardTitle>
                    <CardDescription className="text-xs md:text-sm">101 River Lane, Mesa, AZ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between text-xs md:text-sm mb-1">
                        <span>Progress</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 w-[45%]"></div>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span>Due: Aug 15, 2023</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Building className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="truncate">Contractor: Reliable Renovation</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8" asChild>
                          <Link href="/projects/1">
                            <ArrowUpRight className="mr-1 h-3 w-3 md:h-4 md:w-4" /> View
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 text-xs md:text-sm h-8">
                          <MessageSquare className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 space-y-4 md:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Reviews & Ratings</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-base md:text-lg">4.9</span>
                  <span className="text-muted-foreground text-xs md:text-sm">(24 reviews)</span>
                </div>
              </div>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4 md:space-y-6">
                    <div className="border-b pb-4 md:pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm md:text-base">Michael Thompson</h3>
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                              Buyer
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-xs md:text-sm">
                        John was exceptional in handling our property transaction. His attention to detail and proactive
                        communication made the process smooth and efficient. Highly recommend!
                      </p>
                    </div>

                    <div className="border-b pb-4 md:pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm md:text-base">Jennifer Garcia</h3>
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                              Seller
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-xs md:text-sm">
                        Working with John was a pleasure. He was responsive, knowledgeable, and made selling my property
                        a breeze. I got more than my asking price thanks to his market expertise.
                      </p>
                    </div>

                    <div className="border-b pb-4 md:pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm md:text-base">Robert Wilson</h3>
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                              Business Partner
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                            <Star className="h-3 w-3 md:h-4 md:w-4" />
                          </div>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">2 months ago</span>
                      </div>
                      <p className="text-xs md:text-sm">
                        I've worked with John on multiple investment properties and he consistently delivers excellent
                        results. He's thorough, professional, and always meets deadlines.
                      </p>
                    </div>

                    <Button variant="outline" className="w-full text-xs md:text-sm">
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
