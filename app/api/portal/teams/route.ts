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
    const location = searchParams.get('location')
    const type = searchParams.get('type')
    const includeMembers = searchParams.get('includeMembers') === 'true'

    // Check if user can view teams
    const canViewAllTeams = hasPortalPermission(user.role as any, 'canManageAllTeams')
    
    const teams = await prisma.team.findMany({
      where: {
        ...(location && { location }),
        ...(type && { type: type as any }),
        isActive: true,
        // If user can't view all teams, only show their team
        ...(!canViewAllTeams && { 
          OR: [
            { leaderId: user.id },
            { members: { some: { id: user.id } } }
          ]
        })
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        },
        ...(includeMembers && {
          members: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              role: true,
            }
          }
        }),
        _count: {
          select: { 
            members: true,
            kpis: true,
            goals: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
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

    if (!hasPortalPermission(user.role as any, 'canCreateTeams')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.location || !data.type || !data.leaderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify leader exists and has appropriate permissions
    const leader = await prisma.user.findUnique({
      where: { id: data.leaderId }
    })

    if (!leader) {
      return NextResponse.json(
        { error: 'Leader not found' },
        { status: 400 }
      )
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        type: data.type,
        leaderId: data.leaderId,
        members: {
          connect: [{ id: data.leaderId }] // Leader is automatically a member
        }
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        }
      }
    })

    // Update leader's team assignment
    await prisma.user.update({
      where: { id: data.leaderId },
      data: { teamId: team.id }
    })

    // Create notification for team creation
    await prisma.portalNotification.create({
      data: {
        userId: data.leaderId,
        title: 'Team Created',
        message: `You have been assigned as the leader of "${team.name}"`,
        type: 'SUCCESS',
        category: 'TEAM',
        relatedId: team.id,
        relatedType: 'team',
        actionUrl: `/portal/teams/${team.id}`,
        actionText: 'View Team'
      }
    })

    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}
