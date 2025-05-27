import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"

interface SearchPageProps {
  searchParams?: {
    q?: string
    page?: string
    sort?: string
    type?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  // Search results pages should typically not be indexed, but we still set a canonical URL
  return baseGenerateMetadata({
    title: searchParams?.q ? `Search results for "${searchParams.q}"` : "Search",
    description: "Search properties, services, and professionals",
    path: "/search",
    canonicalPath: "/search", // Point to the base search page without parameters
    noIndex: true, // Search results should typically not be indexed
  })
}

// Rest of your search page component...

export default function SearchPage() {
  return (
    <div>
      {/* Your search page content here */}
      <h1>Search Page</h1>
    </div>
  )
}
