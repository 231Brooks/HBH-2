import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { BidForm } from "@/components/bidding/bid-form"
import { BidHistory } from "@/components/bidding/bid-history"

export const dynamic = "force-dynamic"

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch property details
  const { data: property, error } = await supabase.from("properties").select("*").eq("id", params.id).single()

  if (error || !property) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img
              src={property.image_url || "/placeholder.svg?height=400&width=800&query=property"}
              alt={property.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-3xl font-bold">${property.price.toLocaleString()}</p>
                  <p className="text-gray-500">{property.address}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {property.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-gray-500">Bedrooms</p>
                  <p className="font-bold">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bathrooms</p>
                  <p className="font-bold">{property.bathrooms}</p>
                </div>
                <div>
                  <p className="text-gray-500">Square Feet</p>
                  <p className="font-bold">{property.square_feet.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-gray-700">{property.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BidForm
            propertyId={property.id}
            currentBid={property.current_bid}
            minimumBid={property.minimum_bid || 5000}
          />

          <BidHistory propertyId={property.id} />
        </div>
      </div>
    </div>
  )
}
