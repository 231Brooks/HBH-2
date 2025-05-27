import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"
import { getCanonicalPath } from "@/lib/canonical-utils"
import MarketplaceClientPage from "./MarketplaceClientPage"

// Define the page props type
interface MarketplacePageProps {
  searchParams?: {
    page?: string
    sort?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    view?: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ searchParams }: MarketplacePageProps): Promise<Metadata> {
  // Create a canonical path that excludes pagination and sorting parameters
  const canonicalPath = getCanonicalPath("/marketplace", searchParams)

  return baseGenerateMetadata({
    title: "Property Marketplace",
    description: "Browse our selection of properties for sale and rent",
    path: "/marketplace",
    canonicalPath,
  })
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
