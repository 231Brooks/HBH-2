import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"
import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"

// Define the page props type
interface PropertyDetailPageProps {
  params: { id: string }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch property details
  const { data: property, error } = await supabase.from("properties").select("*").eq("id", params.id).single()

  if (error || !property) {
    return baseGenerateMetadata({
      title: "Property Not Found",
      description: "The requested property could not be found",
      path: `/marketplace/property/${params.id}`,
    })
  }

  return baseGenerateMetadata({
    title: property.title,
    description: property.description?.substring(0, 160) || "View this property listing",
    image: property.image_url,
    path: `/marketplace/property/${params.id}`,
    // Canonical URL is the same as the path for property detail pages
    canonicalPath: `/marketplace/property/${params.id}`,
  })
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch property details
  const { data: property, error } = await supabase.from("properties").select("*").eq("id", params.id).single()

  if (error || !property) {
    notFound()
  }

  // Rest of your property detail page component...
  return (
    <div>
      <h1>{property.title}</h1>
      {/* Property details */}
    </div>
  )
}
