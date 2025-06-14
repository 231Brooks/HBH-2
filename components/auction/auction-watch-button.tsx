"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Heart, HeartOff } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"

interface AuctionWatchButtonProps {
  propertyId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showText?: boolean
}

export function AuctionWatchButton({ 
  propertyId, 
  variant = "outline", 
  size = "default",
  showText = true 
}: AuctionWatchButtonProps) {
  const { user } = useSupabase()
  const { toast } = useToast()
  const [isWatching, setIsWatching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  // Check if user is already watching this auction
  useEffect(() => {
    async function checkWatchStatus() {
      if (!user?.id) {
        setIsCheckingStatus(false)
        return
      }

      try {
        const response = await fetch(`/api/auction/watchlist?propertyId=${propertyId}`)
        const data = await response.json()

        if (data.success) {
          setIsWatching(data.isWatching)
        }
      } catch (error) {
        console.error("Error checking watch status:", error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkWatchStatus()
  }, [propertyId, user?.id])

  const handleToggleWatch = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to watch auctions.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const method = isWatching ? "DELETE" : "POST"
      const url = isWatching 
        ? `/api/auction/watchlist?propertyId=${propertyId}`
        : "/api/auction/watchlist"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: method === "POST" ? JSON.stringify({ propertyId }) : undefined
      })

      const data = await response.json()

      if (data.success) {
        setIsWatching(!isWatching)
        toast({
          title: isWatching ? "Removed from Watch List" : "Added to Watch List",
          description: isWatching 
            ? "You will no longer receive notifications for this auction."
            : "You'll receive notifications about this auction.",
          variant: "default"
        })
      } else {
        throw new Error(data.error || "Failed to update watch list")
      }
    } catch (error: any) {
      console.error("Error toggling watch status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update watch list. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingStatus) {
    return (
      <Button variant={variant} size={size} disabled>
        <Eye className="h-4 w-4" />
        {showText && <span className="ml-2">Loading...</span>}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWatch}
      disabled={isLoading}
      className={isWatching ? "text-red-600 border-red-600 hover:bg-red-50" : ""}
    >
      {isWatching ? (
        <>
          <HeartOff className="h-4 w-4" />
          {showText && <span className="ml-2">Unwatch</span>}
        </>
      ) : (
        <>
          <Heart className="h-4 w-4" />
          {showText && <span className="ml-2">Watch</span>}
        </>
      )}
    </Button>
  )
}
