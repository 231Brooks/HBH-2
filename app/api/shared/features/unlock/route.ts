import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { CrossPlatformSync } from '@/lib/cross-platform-sync'
import { RealtimeService } from '@/lib/pusher-server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { userId, completedCourseId } = await request.json()

    if (!completedCourseId) {
      return NextResponse.json(
        { error: 'Completed course ID is required' },
        { status: 400 }
      )
    }

    const targetUserId = userId || user.id

    // Only allow unlocking for other users if admin
    if (targetUserId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify course completion
    const courseProgress = await prisma.courseProgress.findFirst({
      where: {
        userId: targetUserId,
        courseId: completedCourseId,
        completedAt: { not: null }
      },
      include: {
        course: {
          include: {
            unlocks: true
          }
        }
      }
    })

    if (!courseProgress) {
      return NextResponse.json(
        { error: 'Course not completed by user' },
        { status: 400 }
      )
    }

    const course = courseProgress.course
    const unlockedFeatures = course.unlocks

    if (unlockedFeatures.length === 0) {
      return NextResponse.json({
        unlockedFeatures: [],
        updatedPermissions: null,
        notifications: []
      })
    }

    // Sync learning progress to unlock features
    const syncResult = await CrossPlatformSync.syncLearningProgress(
      targetUserId,
      completedCourseId,
      true
    )

    // Get updated user permissions
    const updatedUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        role: true,
        hbh2Access: true,
        portalAccess: true
      }
    })

    // Create notifications for each unlocked feature
    const notifications = []
    for (const unlock of unlockedFeatures) {
      const notification = await prisma.portalNotification.create({
        data: {
          userId: targetUserId,
          title: 'Feature Unlocked!',
          message: `You've unlocked "${unlock.description}" by completing "${course.title}"`,
          type: 'SUCCESS',
          category: 'ACHIEVEMENT',
          relatedId: course.id,
          relatedType: 'course',
          actionUrl: unlock.platform === 'HBH2' ? '/' : '/portal',
          actionText: `Use ${unlock.featureName}`
        }
      })
      notifications.push(notification)
    }

    // Send real-time notifications
    await RealtimeService.notifyFeatureUnlock(
      targetUserId,
      unlockedFeatures,
      'course_completion'
    )

    // Notify user of feature unlocks
    for (const notification of notifications) {
      await RealtimeService.notifyUser(targetUserId, notification)
    }

    return NextResponse.json({
      unlockedFeatures,
      updatedPermissions: updatedUser,
      notifications
    })
  } catch (error) {
    console.error('Error unlocking features:', error)
    return NextResponse.json(
      { error: 'Failed to unlock features' },
      { status: 500 }
    )
  }
}
