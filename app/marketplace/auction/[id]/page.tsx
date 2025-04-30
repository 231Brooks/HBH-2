import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getAuctionItem, getItemBids } from "@/app/actions/auction-actions"
import AuctionDetailClient from "./auction-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { item, success } = await getAuctionItem(params.id)

  if (!success || !item) {
    return {
      title: "Auction Not Found",
      description: "The requested auction could not be found",
    }
  }

  return {
    title: `${item.title} | HBH Auction`,
    description: item.description,
  }
}

export default async function AuctionDetailPage({ params }: { params: { id: string } }) {
  const { item, success, error } = await getAuctionItem(params.id)
  const { bids } = await getItemBids(params.id)

  if (!success || !item) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AuctionDetailSkeleton />}>
        <AuctionDetailClient item={item} bids={bids || []} />
      </Suspense>
    </div>
  )
}

function AuctionDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
      </div>
      <div>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
