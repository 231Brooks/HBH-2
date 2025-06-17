import { Suspense } from 'react'
import { KPIDashboard } from '@/components/portal/kpis/kpi-dashboard'
import { CreateKPIButton } from '@/components/portal/kpis/create-kpi-button'
import { KPIList } from '@/components/portal/kpis/kpi-list'
import { KPISyncButton } from '@/components/portal/kpis/kpi-sync-button'

export default function KPIsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPIs & Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track performance metrics and monitor progress toward goals
          </p>
        </div>
        <div className="flex space-x-3">
          <KPISyncButton />
          <CreateKPIButton />
        </div>
      </div>

      {/* KPI Dashboard */}
      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>}>
        <KPIDashboard />
      </Suspense>

      {/* KPI List */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
        <KPIList />
      </Suspense>
    </div>
  )
}
