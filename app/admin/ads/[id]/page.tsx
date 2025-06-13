import { notFound } from "next/navigation"
import { getAdvertisementById } from "@/app/actions/advertising-actions"
import { AdForm } from "@/components/ad-management/ad-form"

export const dynamic = "force-dynamic"

interface AdminAdEditPageProps {
  params: {
    id: string
  }
}

export default async function AdminAdEditPage({ params }: AdminAdEditPageProps) {
  // Special case for "create" - render empty form
  if (params.id === "create") {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Create Advertisement</h1>
        <AdForm />
      </div>
    )
  }

  // Otherwise, fetch the ad and render the form with data
  const { ad } = await getAdvertisementById(params.id)

  if (!ad) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Advertisement</h1>
      <AdForm ad={ad} />
    </div>
  )
}
