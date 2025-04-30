import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CreateAuctionForm from "./create-auction-form"

export const metadata = {
  title: "Create Auction | HBH Marketplace",
  description: "Create a new auction listing in the HBH marketplace",
}

export default function CreateAuctionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace/auctions">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Auction Listing</h1>
        <CreateAuctionForm />
      </div>
    </div>
  )
}
