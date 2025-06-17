import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'
import { CrossPlatformSync } from '@/lib/cross-platform-sync'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!hasPortalPermission(user.role as any, 'canManageEmployees')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { userIds, syncType } = await request.json()

    if (!syncType || !['permissions', 'profile', 'teams', 'all'].includes(syncType)) {
      return NextResponse.json(
        { error: 'Invalid sync type' },
        { status: 400 }
      )
    }

    let syncResults = {
      syncedUsers: 0,
      updatedPermissions: 0,
      errors: [] as string[]
    }

    const usersToSync = userIds && userIds.length > 0 
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          include: {
            team: true,
            investmentMemberships: true,
            learningProgress: true
          }
        })
      : await prisma.user.findMany({
          where: {
            updatedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          include: {
            team: true,
            investmentMemberships: true,
            learningProgress: true
          }
        })

    for (const userToSync of usersToSync) {
      try {
        const changes: any = {}

        if (syncType === 'permissions' || syncType === 'all') {
          // Sync permissions based on learning progress
          const completedCourses = await prisma.courseProgress.count({
            where: {
              userId: userToSync.id,
              completedAt: { not: null }
            }
          })

          // Grant portal access if user has completed onboarding
          const onboardingCompleted = await prisma.courseProgress.findFirst({
            where: {
              userId: userToSync.id,
              course: {
                category: 'ONBOARDING'
              },
              completedAt: { not: null }
            }
          })

          if (onboardingCompleted && !userToSync.portalAccess) {
            changes.portalAccess = true
          }

          // Update role based on achievements
          if (completedCourses >= 5 && userToSync.role === 'USER') {
            changes.role = 'PROFESSIONAL'
          }
        }

        if (syncType === 'teams' || syncType === 'all') {
          // Sync team assignments
          // This would be based on business logic for team assignments
        }

        if (syncType === 'profile' || syncType === 'all') {
          // Sync profile information
          // This would include any profile updates from HBH-2
        }

        if (Object.keys(changes).length > 0) {
          const result = await CrossPlatformSync.syncUserData(userToSync.id, changes)
          if (result.success) {
            syncResults.syncedUsers++
            if (changes.portalAccess || changes.role) {
              syncResults.updatedPermissions++
            }
          }
        } else {
          syncResults.syncedUsers++
        }
      } catch (error) {
        syncResults.errors.push(`Failed to sync user ${userToSync.id}: ${error.message}`)
      }
    }

    // Create notification
    await prisma.portalNotification.create({
      data: {
        userId: user.id,
        title: 'User Sync Complete',
        message: `Synced ${syncResults.syncedUsers} users with ${syncResults.updatedPermissions} permission updates`,
        type: syncResults.errors.length > 0 ? 'WARNING' : 'SUCCESS',
        category: 'SYSTEM',
        relatedType: 'sync'
      }
    })

    return NextResponse.json(syncResults)
  } catch (error) {
    console.error('Error in user sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync users' },
      { status: 500 }
    )
  }
}
