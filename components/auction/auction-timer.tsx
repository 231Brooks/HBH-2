"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface AuctionTimerProps {
  endDate: Date
  onAuctionEnd?: () => void
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function AuctionTimer({ endDate, onAuctionEnd }: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  const calculateTimeRemaining = (endDate: Date): TimeRemaining => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const total = end - now

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((total % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, total }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(endDate)
      setTimeRemaining(remaining)

      if (remaining.total <= 0 && onAuctionEnd) {
        onAuctionEnd()
        clearInterval(timer)
      }
    }, 1000)

    // Set initial time
    setTimeRemaining(calculateTimeRemaining(endDate))

    return () => clearInterval(timer)
  }, [endDate, onAuctionEnd])

  const isEnding = timeRemaining.total > 0 && timeRemaining.total <= 24 * 60 * 60 * 1000 // Less than 24 hours
  const isUrgent = timeRemaining.total > 0 && timeRemaining.total <= 60 * 60 * 1000 // Less than 1 hour

  if (timeRemaining.total <= 0) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Auction Ended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">This auction has ended.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${isUrgent ? 'border-red-200 bg-red-50' : isEnding ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 ${isUrgent ? 'text-red-800' : isEnding ? 'text-amber-800' : 'text-blue-800'}`}>
          <Clock className="h-5 w-5" />
          Auction Ends In
          {isUrgent && (
            <Badge variant="destructive" className="ml-2">
              Ending Soon!
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isEnding ? 'text-amber-600' : 'text-blue-600'}`}>
              {timeRemaining.days}
            </div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isEnding ? 'text-amber-600' : 'text-blue-600'}`}>
              {timeRemaining.hours}
            </div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isEnding ? 'text-amber-600' : 'text-blue-600'}`}>
              {timeRemaining.minutes}
            </div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : isEnding ? 'text-amber-600' : 'text-blue-600'}`}>
              {timeRemaining.seconds}
            </div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className={`text-sm ${isUrgent ? 'text-red-700' : isEnding ? 'text-amber-700' : 'text-blue-700'}`}>
            Ends on {new Date(endDate).toLocaleDateString()} at {new Date(endDate).toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
