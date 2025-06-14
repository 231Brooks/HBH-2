import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ProtectedRoute } from "@/components/protected-route"
import { AuctionAnalyticsDashboard } from "@/components/auction/auction-analytics-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AuctionAnalyticsPageProps {
  params: {
    id: string
  }
}

async function AuctionAnalyticsContent({ params }: AuctionAnalyticsPageProps) {
  const user = await getCurrentUser()
  
  if (!user?.id) {
    return notFound()
  }

  // Get property details and verify ownership
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      address: true,
      city: true,
      state: true,
      status: true,
      ownerId: true,
      auctionEndDate: true,
      minimumBid: true,
      reservePrice: true,
      currentBid: true,
      createdAt: true
    }
  })

  if (!property) {
    return notFound()
  }

  if (property.ownerId !== user.id) {
    return notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AUCTION":
        return <Badge className="bg-blue-100 text-blue-800">Active Auction</Badge>
      case "SOLD":
        return <Badge className="bg-green-100 text-green-800">Sold</Badge>
      case "FOR_SALE":
        return <Badge className="bg-gray-100 text-gray-800">For Sale</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const isAuctionEnded = property.auctionEndDate && new Date() > new Date(property.auctionEndDate)

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Auction Analytics</h1>
            <p className="text-gray-600 mt-1">
              Detailed performance metrics for your auction
            </p>
          </div>
        </div>

        {/* Property Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{property.title}</CardTitle>
                <p className="text-gray-600 mt-1">
                  {property.address}, {property.city}, {property.state}
                </p>
              </div>
              {getStatusBadge(property.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Starting Bid</p>
                <p className="text-lg font-semibold">
                  ${property.minimumBid?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Bid</p>
                <p className="text-lg font-semibold">
                  {property.currentBid ? `$${property.currentBid.toLocaleString()}` : "No bids yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reserve Price</p>
                <p className="text-lg font-semibold">
                  {property.reservePrice ? `$${property.reservePrice.toLocaleString()}` : "None"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {isAuctionEnded ? "Ended" : "Ends"}
                </p>
                <p className="text-lg font-semibold">
                  {property.auctionEndDate
                    ? new Date(property.auctionEndDate).toLocaleDateString()
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <AuctionAnalyticsDashboard propertyId={property.id} />

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>About This Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Performance Score</h4>
                <p className="text-sm text-gray-600">
                  The performance score is calculated based on bid activity, bidder engagement, 
                  interest level (watchers), and whether the reserve price was met. A higher 
                  score indicates a more successful auction.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bidder Activity</h4>
                <p className="text-sm text-gray-600">
                  This shows how engaged bidders were with your auction, including the number 
                  of unique bidders, total bids placed, and average bid amounts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Watch List</h4>
                <p className="text-sm text-gray-600">
                  Users can watch auctions without bidding to receive notifications. A high 
                  watch count indicates strong interest in your property.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Extensions</h4>
                <p className="text-sm text-gray-600">
                  Auctions are automatically extended when bids are placed in the final 10 minutes. 
                  Multiple extensions indicate competitive bidding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuctionAnalyticsPage({ params }: AuctionAnalyticsPageProps) {
  return (
    <ProtectedRoute>
      <AuctionAnalyticsContent params={params} />
    </ProtectedRoute>
  )
}
