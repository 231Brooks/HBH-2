import { Suspense } from 'react'
import { TeamsList } from '@/components/portal/teams/teams-list'
import { CreateTeamButton } from '@/components/portal/teams/create-team-button'
import { TeamStats } from '@/components/portal/teams/team-stats'

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage teams and track performance across locations
          </p>
        </div>
        <CreateTeamButton />
      </div>

      {/* Team Stats */}
      <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>}>
        <TeamStats />
      </Suspense>

      {/* Teams List */}
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
        <TeamsList />
      </Suspense>
    </div>
  )
}
