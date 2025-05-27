import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, DollarSign, Calendar, Clock, CheckCircle, Award, Briefcase, MessageSquare } from "lucide-react"

export default function ProfessionalProfile() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/job-marketplace" className="text-slate-600 hover:text-slate-900 mb-6 inline-block">
        ← Back to Job Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Sarah Johnson"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white shadow-sm"
                  />
                  <Badge className="absolute bottom-0 right-0 bg-green-500 text-white border-2 border-white">
                    <CheckCircle size={12} className="mr-1" />
                    Verified
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">Sarah Johnson</h1>
                <p className="text-slate-500 mb-2">Title Company Agent</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">4.9</span>
                  <span className="text-slate-500">(124 reviews)</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Phoenix, AZ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>$85/hr</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                <Button>Contact</Button>
                <Button variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Title Services</Badge>
                    <Badge variant="secondary">Escrow</Badge>
                    <Badge variant="secondary">Closing</Badge>
                    <Badge variant="secondary">Document Preparation</Badge>
                    <Badge variant="secondary">Title Insurance</Badge>
                    <Badge variant="secondary">Commercial Property</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Languages</h3>
                  <div className="text-sm text-slate-600">
                    <p>English (Native)</p>
                    <p>Spanish (Conversational)</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={16} />
                    <span>Available now - 30+ hrs/week</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Certifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Award size={16} className="text-slate-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Licensed Title Agent</p>
                        <p className="text-slate-500">Arizona Department of Insurance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award size={16} className="text-slate-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Certified Escrow Officer</p>
                        <p className="text-slate-500">American Escrow Association</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>About Sarah</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    I'm a licensed title agent with over 10 years of experience in residential and commercial real
                    estate transactions. My expertise includes title searches, escrow services, and ensuring smooth
                    closings for all parties involved.
                  </p>
                  <p>
                    Having worked with hundreds of clients across Arizona, I specialize in complex title issues and
                    pride myself on providing clear communication throughout the closing process. My goal is to make the
                    title and escrow process as seamless as possible for buyers, sellers, and real estate professionals.
                  </p>

                  <div className="mt-6">
                    <h3 className="font-medium text-lg mb-3">Work Experience</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Briefcase className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Senior Title Agent</h4>
                          <p className="text-slate-500">Desert Title Company • 2018 - Present</p>
                          <p className="text-sm mt-1">
                            Managing complex residential and commercial title transactions, overseeing escrow services,
                            and ensuring compliance with all regulations.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Briefcase className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Title Officer</h4>
                          <p className="text-slate-500">Southwest Escrow & Title • 2013 - 2018</p>
                          <p className="text-sm mt-1">
                            Conducted title searches, prepared title commitments, and facilitated closings for
                            residential properties.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>
                    Comprehensive title and escrow services for real estate transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Title Search & Examination</h3>
                        <Badge>$350</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Comprehensive title search and examination to identify any issues or encumbrances on the
                        property.
                      </p>
                      <Button size="sm">Book Service</Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Full Escrow Services</h3>
                        <Badge>$750+</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Complete escrow services including document preparation, fund management, and coordination with
                        all parties.
                      </p>
                      <Button size="sm">Book Service</Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Title Insurance</h3>
                        <Badge>Varies</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Owner's and lender's title insurance policies to protect against title defects and claims.
                      </p>
                      <Button size="sm">Request Quote</Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Document Preparation</h3>
                        <Badge>$200</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Preparation of deeds, affidavits, and other closing documents required for your transaction.
                      </p>
                      <Button size="sm">Book Service</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>A selection of recent real estate transactions I've helped close</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Commercial Property"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium">Commercial Office Building</h3>
                        <p className="text-sm text-slate-500">Phoenix, AZ • $4.2M</p>
                        <p className="text-sm mt-2">
                          Handled title and escrow for multi-tenant office building with complex ownership structure.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Residential Development"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium">Residential Development</h3>
                        <p className="text-sm text-slate-500">Scottsdale, AZ • $12.5M</p>
                        <p className="text-sm mt-2">
                          Managed title and escrow for 45-unit residential development project.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Luxury Home"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium">Luxury Residential Property</h3>
                        <p className="text-sm text-slate-500">Paradise Valley, AZ • $3.8M</p>
                        <p className="text-sm mt-2">
                          Provided title and escrow services for high-value residential transaction.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Retail Center"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium">Retail Shopping Center</h3>
                        <p className="text-sm text-slate-500">Tempe, AZ • $7.2M</p>
                        <p className="text-sm mt-2">
                          Facilitated title transfer and escrow for retail center with multiple tenants.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <CardDescription>Feedback from previous clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Michael Thompson</h3>
                            <Badge variant="outline" className="text-xs">
                              Real Estate Investor
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
                        <span className="text-sm text-slate-500">2 weeks ago</span>
                      </div>
                      <p className="text-sm">
                        Sarah was exceptional in handling our commercial property transaction. Her attention to detail
                        and proactive communication made the closing process smooth and efficient. Highly recommend her
                        services!
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Jennifer Garcia</h3>
                            <Badge variant="outline" className="text-xs">
                              First-time Homebuyer
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
                        <span className="text-sm text-slate-500">1 month ago</span>
                      </div>
                      <p className="text-sm">
                        As a first-time homebuyer, I was nervous about the closing process. Sarah explained everything
                        clearly and made sure I understood each step. She was patient, responsive, and truly cared about
                        making my experience positive.
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Robert Wilson</h3>
                            <Badge variant="outline" className="text-xs">
                              Real Estate Agent
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
                        <span className="text-sm text-slate-500">2 months ago</span>
                      </div>
                      <p className="text-sm">
                        I've worked with Sarah on multiple transactions and she consistently delivers excellent service.
                        She's thorough, professional, and always meets deadlines. My clients are always happy with her
                        work.
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

          <div className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contact Sarah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Button>
                    <MessageSquare size={16} className="mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <Calendar size={16} className="mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
                <p className="text-sm text-slate-500">Typically responds within 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
