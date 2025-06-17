import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { userId, featureName, platform } = await request.json()

    if (!featureName || !platform) {
      return NextResponse.json(
        { error: 'Feature name and platform are required' },
        { status: 400 }
      )
    }

    const targetUserId = userId || user.id

    // Only allow checking other users' access if admin
    if (targetUserId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get user's completed courses
    const completedCourses = await prisma.courseProgress.findMany({
      where: {
        userId: targetUserId,
        completedAt: { not: null }
      },
      include: {
        course: {
          include: {
            unlocks: {
              where: {
                featureName,
                platform: {
                  in: [platform, 'BOTH']
                }
              }
            }
          }
        }
      }
    })

    // Check if any completed course unlocks this feature
    const hasAccess = completedCourses.some(progress => 
      progress.course.unlocks.length > 0
    )

    // Get required courses for this feature
    const requiredCourses = await prisma.course.findMany({
      where: {
        unlocks: {
          some: {
            featureName,
            platform: {
              in: [platform, 'BOTH']
            }
          }
        },
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true
      }
    })

    // Get completed courses that unlock this feature
    const completedRequiredCourses = completedCourses
      .filter(progress => progress.course.unlocks.length > 0)
      .map(progress => ({
        id: progress.course.id,
        title: progress.course.title,
        completedAt: progress.completedAt
      }))

    // Get missing requirements
    const missingRequirements = requiredCourses
      .filter(course => !completedRequiredCourses.some(completed => completed.id === course.id))
      .map(course => `Complete "${course.title}" course`)

    return NextResponse.json({
      hasAccess,
      requiredCourses,
      completedCourses: completedRequiredCourses,
      missingRequirements
    })
  } catch (error) {
    console.error('Error checking feature access:', error)
    return NextResponse.json(
      { error: 'Failed to check feature access' },
      { status: 500 }
    )
  }
}
