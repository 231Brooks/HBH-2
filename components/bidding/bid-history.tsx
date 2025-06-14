"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Bid {
  id: string
  amount: number
  status: string
  createdAt: string
  bidder: {
    id: string
    name: string | null
    image: string | null
  }
}

interface BidHistoryProps {
  propertyId: string
}

export function BidHistory({ propertyId }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBidHistory() {
      try {
        setLoading(true)

        const response = await fetch(`/api/bidding/history?propertyId=${propertyId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch bid history")
        }

        setBids(data.bids || [])
      } catch (err: any) {
        console.error("Error fetching bid history:", err)
        setError(err.message || "Failed to load bid history")
      } finally {
        setLoading(false)
      }
    }

    fetchBidHistory()

    // Refresh bid history every 30 seconds for real-time updates
    const interval = setInterval(fetchBidHistory, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [propertyId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid History</CardTitle>
      </CardHeader>
      <CardContent>
        {bids.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No bids yet</p>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{bid.bidder.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${bid.amount.toLocaleString()}</p>
                  <StatusBadge status={bid.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    case "pending":
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}
