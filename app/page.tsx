import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"

export function generateMetadata(): Metadata {
  return baseGenerateMetadata({
    title: "Home",
    description: "Find your dream home with HBH - Homes in Better Hands",
    path: "/",
    canonicalPath: "/", // Explicitly set canonical URL for home page
  })
}

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Real Estate Platform</h1>
      <p>Welcome to the platform!</p>
    </div>
  )
}
