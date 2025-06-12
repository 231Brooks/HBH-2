import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Shield,
  Award,
  MessageCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServiceById } from "@/app/actions/service-actions"
import { QuickContactButton } from "@/components/contact-dialog"

interface ServiceDetailPageProps {
  params: {
    id: string
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params
  const { service } = await getServiceById(id)

  if (!service) {
    notFound()
  }

  const averageRating = service.provider.rating || 0
  const reviewCount = service.provider.reviewCount || 0

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{service.name}</h1>
                    {service.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {service.price || (service.hourlyRate ? `$${service.hourlyRate}/hr` : "Custom pricing")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviewCount} reviews)</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {service.category.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {service.image && (
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About This Service</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description || "No description provided."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Reviews ({service.reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {service.reviews.length > 0 ? (
                <div className="space-y-6">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.author.image || ""} />
                          <AvatarFallback>
                            {review.author.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.author.name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          {review.comment && (
                            <p className="text-sm">{review.comment}</p>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Be the first to review this service!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Info */}
          <Card>
            <CardHeader>
              <CardTitle>Service Provider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={service.provider.image || ""} />
                  <AvatarFallback>
                    {service.provider.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{service.provider.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {service.provider.bio && (
                <p className="text-sm text-muted-foreground">{service.provider.bio}</p>
              )}

              <div className="space-y-2">
                {service.provider.emailVerified && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span>Email verified</span>
                  </div>
                )}
                {service.provider.phoneVerified && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>Phone verified</span>
                  </div>
                )}
                {service.provider.identityVerified && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Identity verified</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickContactButton
                contactId={service.providerId}
                contactName={service.provider.name || "Service Provider"}
                contactAvatar={service.provider.image}
                contactType="professional"
                contextType="service"
                contextId={service.id}
                contextTitle={service.name}
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Provider
              </QuickContactButton>
              <Button variant="outline" className="w-full" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Request Quote
              </Button>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{service.category.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pricing</span>
                <span className="font-medium">
                  {service.price || (service.hourlyRate ? `$${service.hourlyRate}/hr` : "Custom")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{service.location || "Remote"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Listed</span>
                <span className="font-medium">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Trust & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Background checked</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-green-600" />
                <span>Licensed professional</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Insured & bonded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
