"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface ReservePriceIndicatorProps {
  reservePrice?: number
  currentBid?: number
  minimumBid?: number
  showAmount?: boolean // Whether to show the actual reserve price amount
  className?: string
}

export function ReservePriceIndicator({ 
  reservePrice, 
  currentBid, 
  minimumBid,
  showAmount = false,
  className = ""
}: ReservePriceIndicatorProps) {
  // If no reserve price is set, don't show the indicator
  if (!reservePrice) {
    return null
  }

  const highestBid = currentBid || 0
  const reserveMet = highestBid >= reservePrice
  const progressPercentage = Math.min((highestBid / reservePrice) * 100, 100)

  const getStatusIcon = () => {
    if (reserveMet) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (highestBid > 0) {
      return <AlertCircle className="h-5 w-5 text-amber-600" />
    } else {
      return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusBadge = () => {
    if (reserveMet) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Reserve Met</Badge>
    } else if (highestBid > 0) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Reserve Not Met</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Reserve Set</Badge>
    }
  }

  const getStatusMessage = () => {
    if (reserveMet) {
      return "The reserve price has been met. The seller is obligated to sell if this remains the winning bid."
    } else if (highestBid > 0) {
      const remaining = reservePrice - highestBid
      return `Reserve price not yet met. ${showAmount ? `$${remaining.toLocaleString()} more needed.` : 'Higher bids needed.'}`
    } else {
      return "This auction has a reserve price. The seller is not obligated to sell unless the reserve is met."
    }
  }

  const getProgressColor = () => {
    if (reserveMet) return "bg-green-600"
    if (progressPercentage > 75) return "bg-amber-600"
    if (progressPercentage > 50) return "bg-yellow-600"
    return "bg-blue-600"
  }

  return (
    <Card className={`border-l-4 ${reserveMet ? 'border-l-green-500' : 'border-l-amber-500'} ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <h3 className="font-semibold text-sm">Reserve Price</h3>
            </div>
            {getStatusBadge()}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Current Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Amount Information */}
          {showAmount && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Reserve Price</p>
                <p className="font-semibold">${reservePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Current Bid</p>
                <p className="font-semibold">
                  {highestBid > 0 ? `$${highestBid.toLocaleString()}` : 'No bids yet'}
                </p>
              </div>
            </div>
          )}

          {/* Status Message */}
          <div className={`text-xs p-3 rounded-md ${
            reserveMet 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <p>{getStatusMessage()}</p>
          </div>

          {/* Additional Information */}
          {!reserveMet && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>• The reserve price is the minimum amount the seller will accept</p>
              <p>• If the reserve is not met, the seller may choose not to sell</p>
              <p>• Bidding can continue even if the reserve is not met</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
