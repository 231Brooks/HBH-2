'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface TeamStats {
  teamName: string
  memberCount: number
  activeKPIs: number
  performance: number
}

export function TeamPerformanceCard() {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with actual API call
    setTimeout(() => {
      setTeamStats({
        teamName: 'Sales Team - Atlanta',
        memberCount: 8,
        activeKPIs: 5,
        performance: 85,
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

  if (!teamStats) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Team Performance
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  No team assigned
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3">
          <Link
            href="/portal/teams"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Join a team
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
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Team Performance
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {teamStats.teamName}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{teamStats.memberCount}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{teamStats.activeKPIs}</p>
            <p className="text-xs text-gray-500">Active KPIs</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-green-600">{teamStats.performance}%</p>
            <p className="text-xs text-gray-500">Performance</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/portal/teams"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View team details
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
