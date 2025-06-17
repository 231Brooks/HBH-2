import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'
import { KPISyncService } from '@/lib/kpi-sync-service'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!hasPortalPermission(user.role as any, 'canManageKPIs')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { source, kpiIds, dateRange } = await request.json()

    if (!source) {
      return NextResponse.json(
        { error: 'Data source is required' },
        { status: 400 }
      )
    }

    let syncResult
    const errors: string[] = []

    try {
      switch (source) {
        case 'HBH2_TRANSACTIONS':
          syncResult = await KPISyncService.syncTransactionKPIs(dateRange, kpiIds)
          break
        case 'HBH2_PROPERTIES':
          syncResult = await KPISyncService.syncPropertyKPIs(dateRange, kpiIds)
          break
        case 'HBH2_USERS':
          syncResult = await KPISyncService.syncUserEngagementKPIs(dateRange, kpiIds)
          break
        case 'PORTAL_LEARNING':
          syncResult = await KPISyncService.syncLearningKPIs(dateRange, kpiIds)
          break
        case 'PORTAL_TEAMS':
          syncResult = await KPISyncService.syncTeamKPIs(dateRange, kpiIds)
          break
        case 'PORTAL_INVESTMENTS':
          syncResult = await KPISyncService.syncInvestmentKPIs(dateRange, kpiIds)
          break
        default:
          return NextResponse.json(
            { error: 'Unsupported data source' },
            { status: 400 }
          )
      }
    } catch (error) {
      console.error(`Error syncing ${source}:`, error)
      errors.push(`Failed to sync ${source}: ${error.message}`)
      syncResult = { updated: 0, unchanged: 0, failed: 1 }
    }

    // Create notification for sync completion
    await prisma.portalNotification.create({
      data: {
        userId: user.id,
        title: 'KPI Sync Complete',
        message: `Synced ${syncResult.updated} KPIs from ${source}`,
        type: errors.length > 0 ? 'WARNING' : 'SUCCESS',
        category: 'KPI',
        relatedType: 'kpi_sync'
      }
    })

    return NextResponse.json({
      syncedKPIs: syncResult.updated + syncResult.unchanged,
      errors,
      summary: syncResult
    })
  } catch (error) {
    console.error('Error in KPI sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync KPIs' },
      { status: 500 }
    )
  }
}
