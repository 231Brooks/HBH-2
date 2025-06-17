import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const period = searchParams.get('period')
    const ownerId = searchParams.get('ownerId')
    const teamId = searchParams.get('teamId')
    const includeHistory = searchParams.get('includeHistory') === 'true'

    // Check if user can view company KPIs
    const canViewCompanyKPIs = hasPortalPermission(user.role as any, 'canViewCompanyKPIs')

    const kpis = await prisma.kPI.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(period && { period: period as any }),
        ...(ownerId && { ownerId }),
        ...(teamId && { teamId }),
        isActive: true,
        // If user can't view company KPIs, only show their own
        ...(!canViewCompanyKPIs && {
          OR: [
            { ownerId: user.id },
            { team: { members: { some: { id: user.id } } } }
          ]
        })
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        team: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        },
        ...(includeHistory && {
          history: {
            orderBy: { recordedAt: 'desc' },
            take: 10
          }
        }),
        alerts: {
          where: { isActive: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary statistics
    const summary = {
      totalKPIs: kpis.length,
      onTrack: 0,
      atRisk: 0,
      exceeded: 0
    }

    kpis.forEach(kpi => {
      const progress = kpi.targetValue > 0 ? (kpi.currentValue / kpi.targetValue) * 100 : 0
      
      if (progress >= 100) {
        summary.exceeded++
      } else if (progress >= 80) {
        summary.onTrack++
      } else {
        summary.atRisk++
      }
    })

    return NextResponse.json({ kpis, summary })
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!hasPortalPermission(user.role as any, 'canCreateKPIs')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.category || !data.targetValue || !data.unit || !data.period) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (data.targetValue <= 0) {
      return NextResponse.json(
        { error: 'Target value must be positive' },
        { status: 400 }
      )
    }

    // Set ownership
    const ownerId = data.ownerId || user.id
    const teamId = data.teamId || null

    // Validate ownership permissions
    if (ownerId !== user.id && !hasPortalPermission(user.role as any, 'canManageKPIs')) {
      return NextResponse.json(
        { error: 'Cannot create KPIs for other users' },
        { status: 403 }
      )
    }

    // Calculate period dates
    const now = new Date()
    let startDate = data.startDate ? new Date(data.startDate) : now
    let endDate = data.endDate ? new Date(data.endDate) : null

    if (!endDate) {
      switch (data.period) {
        case 'DAILY':
          endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
          break
        case 'WEEKLY':
          endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
        case 'MONTHLY':
          endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate())
          break
        case 'QUARTERLY':
          endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate())
          break
        case 'YEARLY':
          endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
          break
      }
    }

    // Create KPI
    const kpi = await prisma.kPI.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        targetValue: data.targetValue,
        unit: data.unit,
        period: data.period,
        startDate,
        endDate,
        ownerId,
        teamId,
        dataSource: data.dataSource || 'MANUAL_ENTRY',
        sourceConfig: data.sourceConfig,
        autoUpdate: data.autoUpdate || false,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        team: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      }
    })

    // Create initial history record
    await prisma.kPIHistory.create({
      data: {
        kpiId: kpi.id,
        value: 0,
        notes: 'KPI created'
      }
    })

    // Create notification
    await prisma.portalNotification.create({
      data: {
        userId: ownerId,
        title: 'KPI Created',
        message: `New KPI "${kpi.name}" has been created`,
        type: 'SUCCESS',
        category: 'KPI',
        relatedId: kpi.id,
        relatedType: 'kpi',
        actionUrl: `/portal/kpis/${kpi.id}`,
        actionText: 'View KPI'
      }
    })

    return NextResponse.json({ kpi }, { status: 201 })
  } catch (error) {
    console.error('Error creating KPI:', error)
    return NextResponse.json(
      { error: 'Failed to create KPI' },
      { status: 500 }
    )
  }
}
