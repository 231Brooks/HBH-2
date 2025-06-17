'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface KPIOverview {
  totalKPIs: number
  onTrack: number
  atRisk: number
  exceeded: number
}

export function KPIOverviewCard() {
  const [overview, setOverview] = useState<KPIOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with actual API call
    setTimeout(() => {
      setOverview({
        totalKPIs: 8,
        onTrack: 5,
        atRisk: 2,
        exceeded: 1,
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

  if (!overview) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  KPI Overview
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  No KPIs set up
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <Link
            href="/portal/kpis"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Set up your KPIs
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                KPI Overview
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {overview.totalKPIs} Active KPIs
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">On Track</span>
            <span className="text-sm font-medium text-green-600">{overview.onTrack}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">At Risk</span>
            <span className="text-sm font-medium text-yellow-600">{overview.atRisk}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Exceeded</span>
            <span className="text-sm font-medium text-green-600">{overview.exceeded}</span>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/portal/kpis"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View detailed analytics
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
