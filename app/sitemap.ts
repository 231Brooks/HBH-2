import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/url-utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  // Static routes
  const routes = [
    "",
    "/marketplace",
    "/services",
    "/job-marketplace",
    "/calendar",
    "/messages",
    "/progress",
    "/auth/login",
    "/auth/signup",
  ]

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // You can add dynamic routes here by fetching from your database
  // For example, property listings
  // const properties = await prisma.property.findMany();
  // const propertyRoutes = properties.map(property => ({
  //   url: `${baseUrl}/marketplace/property/${property.id}`,
  //   lastModified: property.updatedAt,
  //   changeFrequency: 'daily' as const,
  //   priority: 0.7,
  // }));

  return [
    ...staticRoutes,
    // ...propertyRoutes,
  ]
}
