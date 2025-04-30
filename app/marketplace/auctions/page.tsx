import { Suspense } from "react"
import Link from "next/link"
import { getAuctionItems } from "@/app/actions/auction-actions"
import AuctionsClient from "./auctions-client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Auctions | HBH Marketplace",
  description: "Browse and bid on real estate auctions in the HBH marketplace",
}

export default async function AuctionsPage() {
  const { items, success, error } = await getAuctionItems()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Real Estate Auctions</h1>
        <Button asChild>
          <Link href="/marketplace/auctions/create">Create Auction</Link>
        </Button>
      </div>

      <Suspense fallback={<AuctionsSkeleton />}>
        <AuctionsClient initialAuctions={items || []} />
      </Suspense>
    </div>
  )
}

function AuctionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}
