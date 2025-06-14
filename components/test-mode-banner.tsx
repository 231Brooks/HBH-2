"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TestTube, CreditCard, DollarSign } from "lucide-react"
import { paperMoneyConfig } from "@/lib/paper-money-config"
import { useState } from "react"

export function TestModeBanner() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Only show banner if in paper money mode
  if (!paperMoneyConfig.mode.isPaperMoney || !paperMoneyConfig.mode.showBanner) {
    return null
  }

  return (
    <div className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <Alert className="border-0 bg-transparent text-white">
          <AlertTriangle className="h-5 w-5 text-white" />
          <AlertDescription className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                <span className="font-bold text-lg">PAPER MONEY TEST MODE</span>
              </div>
              <Badge variant="outline" className="bg-white text-orange-600 border-white">
                NO REAL PAYMENTS
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>
          </AlertDescription>
        </Alert>
        
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-semibold">Test Payment Info</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>• Visa: 4242 4242 4242 4242</li>
                <li>• Mastercard: 5555 5555 5555 4444</li>
                <li>• Declined: 4000 0000 0000 0002</li>
                <li>• Any future expiry date</li>
                <li>• Any 3-digit CVC</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">Test Amounts</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>• Small: $5.00 (TEST)</li>
                <li>• Medium: $25.00 (TEST)</li>
                <li>• Large: $100.00 (TEST)</li>
                <li>• All fees are simulated</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-4 w-4" />
                <span className="font-semibold">Environment</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>• Branch: papermoney</li>
                <li>• Mode: Testing</li>
                <li>• Real payments: Disabled</li>
                <li>• Mock transactions: Enabled</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface TestModeIndicatorProps {
  className?: string
}

export function TestModeIndicator({ className = "" }: TestModeIndicatorProps) {
  if (!paperMoneyConfig.mode.isPaperMoney) {
    return null
  }

  return (
    <Badge 
      variant="outline" 
      className={`bg-yellow-100 text-yellow-800 border-yellow-300 ${className}`}
    >
      <TestTube className="h-3 w-3 mr-1" />
      TEST MODE
    </Badge>
  )
}

interface TestAmountDisplayProps {
  amount: number
  className?: string
}

export function TestAmountDisplay({ amount, className = "" }: TestAmountDisplayProps) {
  if (!paperMoneyConfig.mode.isPaperMoney) {
    return <span className={className}>${(amount / 100).toFixed(2)}</span>
  }

  return (
    <span className={`${className} text-orange-600 font-medium`}>
      ${(amount / 100).toFixed(2)} 
      <Badge variant="outline" className="ml-2 text-xs bg-orange-100 text-orange-700 border-orange-300">
        TEST
      </Badge>
    </span>
  )
}

export function TestModeWarning() {
  if (!paperMoneyConfig.mode.isPaperMoney) {
    return null
  }

  return (
    <Alert className="mb-4 border-yellow-300 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Test Mode Active:</strong> This is a safe testing environment. 
        No real money will be charged. Use test credit card numbers for payments.
      </AlertDescription>
    </Alert>
  )
}
