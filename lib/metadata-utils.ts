import type { Metadata } from "next"
import { getBaseUrl } from "./url-utils"

interface GenerateMetadataOptions {
  title?: string
  description?: string
  image?: string
  path?: string
  noIndex?: boolean
  canonicalPath?: string // Added for canonical URL support
}

export function generateMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
  canonicalPath,
}: GenerateMetadataOptions): Metadata {
  const baseUrl = getBaseUrl()
  const fullTitle = title ? `${title} | HBH - Homes in Better Hands` : "HBH - Homes in Better Hands"

  const fullDescription = description || "All-in-One Real Estate Platform for buying, selling, and managing properties."

  const ogImage = image || `${baseUrl}/api/og?title=${encodeURIComponent(title || "HBH")}`

  // Determine canonical URL - use specified canonicalPath if provided, otherwise use path
  const canonicalUrl = `${baseUrl}${canonicalPath || path}`

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(baseUrl),
    // Add canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl, // Use canonical URL for OpenGraph as well
      siteName: "HBH - Homes in Better Hands",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
