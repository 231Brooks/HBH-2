'use client'

import { useEffect, useState } from 'react'
import { useRealtimeLearning, useRealtimeKPI } from '@/hooks/use-realtime'

interface DashboardData {
  learningProgress: {
    activeCourses: number
    completedCourses: number
    totalTimeSpent: number
    certificationsEarned: number
  }
  kpiSummary: {
    totalKPIs: number
    onTrack: number
    atRisk: number
    exceeded: number
  }
  recentActivity: any[]
  lastUpdated: string
}

export function LiveDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Subscribe to real-time updates
  useRealtimeLearning()

  useEffect(() => {
    loadDashboardData()

    // Listen for real-time updates
    const handleLearningUpdate = (event: CustomEvent) => {
      const { type, data: updateData } = event.detail
      
      if (type === 'enrolled' || type === 'completed') {
        // Refresh learning data
        refreshLearningData()
      }
    }

    const handleKPIUpdate = (event: CustomEvent) => {
      // Refresh KPI data
      refreshKPIData()
    }

    const handleTeamUpdate = (event: CustomEvent) => {
      // Refresh team-related data
      refreshTeamData()
    }

    const handleInvestmentUpdate = (event: CustomEvent) => {
      // Refresh investment data
      refreshInvestmentData()
    }

    // Add event listeners
    window.addEventListener('learning-update', handleLearningUpdate as EventListener)
    window.addEventListener('kpi-update', handleKPIUpdate as EventListener)
    window.addEventListener('team-update', handleTeamUpdate as EventListener)
    window.addEventListener('investment-update', handleInvestmentUpdate as EventListener)

    return () => {
      window.removeEventListener('learning-update', handleLearningUpdate as EventListener)
      window.removeEventListener('kpi-update', handleKPIUpdate as EventListener)
      window.removeEventListener('team-update', handleTeamUpdate as EventListener)
      window.removeEventListener('investment-update', handleInvestmentUpdate as EventListener)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      const [learningRes, kpiRes, activityRes] = await Promise.all([
        fetch('/api/portal/learning/dashboard'),
        fetch('/api/portal/kpis/summary'),
        fetch('/api/portal/activity/recent')
      ])

      const [learningData, kpiData, activityData] = await Promise.all([
        learningRes.json(),
        kpiRes.json(),
        activityRes.json()
      ])

      setData({
        learningProgress: learningData.summary || {
          activeCourses: 0,
          completedCourses: 0,
          totalTimeSpent: 0,
          certificationsEarned: 0
        },
        kpiSummary: kpiData.summary || {
          totalKPIs: 0,
          onTrack: 0,
          atRisk: 0,
          exceeded: 0
        },
        recentActivity: activityData.activities || [],
        lastUpdated: new Date().toISOString()
      })

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshLearningData = async () => {
    try {
      const response = await fetch('/api/portal/learning/dashboard')
      const learningData = await response.json()
      
      setData(prev => prev ? {
        ...prev,
        learningProgress: learningData.summary,
        lastUpdated: new Date().toISOString()
      } : null)
      
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to refresh learning data:', error)
    }
  }

  const refreshKPIData = async () => {
    try {
      const response = await fetch('/api/portal/kpis/summary')
      const kpiData = await response.json()
      
      setData(prev => prev ? {
        ...prev,
        kpiSummary: kpiData.summary,
        lastUpdated: new Date().toISOString()
      } : null)
      
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to refresh KPI data:', error)
    }
  }

  const refreshTeamData = async () => {
    // Refresh team-related dashboard data
    await loadDashboardData()
  }

  const refreshInvestmentData = async () => {
    // Refresh investment-related dashboard data
    await loadDashboardData()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
        <button
          onClick={loadDashboardData}
          className="mt-2 text-blue-600 hover:text-blue-500"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Update Indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Live Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate}
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Learning Progress */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📚</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Learning Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.learningProgress.activeCourses} Active
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-600">
                {data.learningProgress.completedCourses} completed
              </span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">
                {data.learningProgress.certificationsEarned} certificates
              </span>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    KPI Performance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.kpiSummary.totalKPIs} KPIs
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">{data.kpiSummary.onTrack} on track</span>
              <span className="text-yellow-600">{data.kpiSummary.atRisk} at risk</span>
              <span className="text-blue-600">{data.kpiSummary.exceeded} exceeded</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs">{activity.icon || '•'}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {activity.title || activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp || activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
