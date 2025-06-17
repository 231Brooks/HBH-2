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
    const status = searchParams.get('status')
    const memberId = searchParams.get('memberId')
    const managerId = searchParams.get('managerId')
    const includeProperties = searchParams.get('includeProperties') === 'true'

    // Check if user can view all investments
    const canViewAll = hasPortalPermission(user.role as any, 'canViewAllInvestments')

    const groups = await prisma.investmentGroup.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(memberId && { members: { some: { userId: memberId } } }),
        ...(managerId && { managerId }),
        // If user can't view all, only show groups they're part of
        ...(!canViewAll && {
          OR: [
            { createdById: user.id },
            { managerId: user.id },
            { members: { some: { userId: user.id } } }
          ]
        })
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        manager: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          }
        },
        ...(includeProperties && {
          properties: {
            include: {
              property: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  location: true,
                  images: true,
                }
              }
            }
          }
        }),
        _count: {
          select: {
            members: true,
            properties: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary statistics
    const userMemberships = groups.filter(group => 
      group.members.some(member => member.userId === user.id)
    )

    const totalInvested = userMemberships.reduce((sum, group) => {
      const userMembership = group.members.find(member => member.userId === user.id)
      return sum + (userMembership?.contribution || 0)
    }, 0)

    const totalReturns = userMemberships.reduce((sum, group) => {
      const userMembership = group.members.find(member => member.userId === user.id)
      return sum + (userMembership?.totalReturns || 0)
    }, 0)

    return NextResponse.json({ 
      groups,
      summary: {
        totalInvested,
        totalReturns,
        activeGroups: userMemberships.filter(g => g.status === 'ACTIVE').length
      }
    })
  } catch (error) {
    console.error('Error fetching investment groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investment groups' },
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

    if (!hasPortalPermission(user.role as any, 'canCreateInvestmentGroups')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.targetAmount || !data.minimumInvestment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (data.targetAmount <= 0 || data.minimumInvestment <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount values' },
        { status: 400 }
      )
    }

    // Create investment group
    const group = await prisma.investmentGroup.create({
      data: {
        name: data.name,
        description: data.description,
        targetAmount: data.targetAmount,
        minimumInvestment: data.minimumInvestment,
        isPrivate: data.isPrivate || false,
        autoInvest: data.autoInvest || false,
        createdById: user.id,
        managerId: user.id, // Creator is initially the manager
        members: {
          create: {
            userId: user.id,
            contribution: 0,
            role: 'ADMIN'
          }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        manager: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          }
        }
      }
    })

    // Generate invite code for private groups
    let inviteCode = null
    if (data.isPrivate) {
      inviteCode = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15)
    }

    // Create notification
    await prisma.portalNotification.create({
      data: {
        userId: user.id,
        title: 'Investment Group Created',
        message: `Your investment group "${group.name}" has been created successfully`,
        type: 'SUCCESS',
        category: 'INVESTMENT',
        relatedId: group.id,
        relatedType: 'investment_group',
        actionUrl: `/portal/investments/groups/${group.id}`,
        actionText: 'Manage Group'
      }
    })

    return NextResponse.json({ group, inviteCode }, { status: 201 })
  } catch (error) {
    console.error('Error creating investment group:', error)
    return NextResponse.json(
      { error: 'Failed to create investment group' },
      { status: 500 }
    )
  }
}
