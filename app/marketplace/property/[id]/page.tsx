import { notFound } from "next/navigation"
import PropertyDetailClient from "./property-detail-client"
import { getPropertyById } from "@/app/actions/property-actions"

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { property } = await getPropertyById(params.id)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}
