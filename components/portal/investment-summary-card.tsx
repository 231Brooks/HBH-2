'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CurrencyDollarIcon, ArrowRightIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface InvestmentSummary {
  totalInvested: number
  totalReturns: number
  activeGroups: number
  roi: number
}

export function InvestmentSummaryCard() {
  const [summary, setSummary] = useState<InvestmentSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with actual API call
    setTimeout(() => {
      setSummary({
        totalInvested: 25000,
        totalReturns: 3750,
        activeGroups: 2,
        roi: 15,
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Investment Summary
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  No investments yet
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <Link
            href="/portal/investments"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Explore investment opportunities
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Investment Summary
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatCurrency(summary.totalInvested)} Invested
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(summary.totalReturns)}
            </p>
            <p className="text-xs text-gray-500">Total Returns</p>
          </div>
          <div>
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm font-medium text-green-600">{summary.roi}%</p>
            </div>
            <p className="text-xs text-gray-500">ROI</p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Active in {summary.activeGroups} investment groups
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/portal/investments"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all investments
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
