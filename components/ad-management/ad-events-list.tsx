"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { formatDate, formatTime } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AdEventsListProps {
  adId: string
}

export function AdEventsList({ adId }: AdEventsListProps) {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [adId, page])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      // This would be a real API call in production
      // For now, we'll simulate it with mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockEvents = Array.from({ length: 10 }, (_, i) => ({
        id: `event-${page}-${i}`,
        adId,
        type: Math.random() > 0.3 ? "IMPRESSION" : "CLICK",
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
        sessionId: `session-${Math.floor(Math.random() * 1000)}`,
        referrer: Math.random() > 0.5 ? "https://google.com" : "https://facebook.com",
      }))

      setEvents((prev) => (page === 1 ? mockEvents : [...prev, ...mockEvents]))
      setHasMore(page < 3) // Simulate 3 pages of data
    } catch (error) {
      console.error("Error fetching ad events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (events.length === 0 && !isLoading) {
    return <div className="text-center py-8 text-muted-foreground">No events recorded for this advertisement yet</div>
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Event</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Session</th>
              <th className="text-left py-2">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b last:border-0">
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      event.type === "IMPRESSION" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </td>
                <td className="py-2">{formatDate(event.timestamp)}</td>
                <td className="py-2">{formatTime(event.timestamp)}</td>
                <td className="py-2">{event.sessionId}</td>
                <td className="py-2 truncate max-w-[200px]">{event.referrer || "Direct"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Button onClick={loadMore} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
