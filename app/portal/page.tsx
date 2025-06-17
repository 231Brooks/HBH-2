import { DashboardHeader } from '@/components/portal/dashboard-header'
import { LearningProgressCard } from '@/components/portal/learning-progress-card'
import { TeamPerformanceCard } from '@/components/portal/team-performance-card'
import { InvestmentSummaryCard } from '@/components/portal/investment-summary-card'
import { KPIOverviewCard } from '@/components/portal/kpi-overview-card'
import { QuickActionsCard } from '@/components/portal/quick-actions-card'
import { RecentActivityCard } from '@/components/portal/recent-activity-card'

export default function PortalDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Quick Actions */}
      <QuickActionsCard />
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <LearningProgressCard />
        <TeamPerformanceCard />
        <InvestmentSummaryCard />
        <KPIOverviewCard />
        <div className="lg:col-span-2 xl:col-span-1">
          <RecentActivityCard />
        </div>
      </div>
      
      {/* Additional sections can be added here */}
    </div>
  )
}
