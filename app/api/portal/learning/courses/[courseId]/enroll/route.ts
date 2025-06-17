import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { courseId } = params
    const { userId: targetUserId } = await request.json().catch(() => ({}))
    
    // Use target user ID if provided (admin feature) or current user
    const enrollUserId = targetUserId || user.id

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        modules: {
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (!course.isPublished) {
      return NextResponse.json({ error: 'Course not available' }, { status: 400 })
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: enrollUserId,
          courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    // Check prerequisites
    for (const prereq of course.prerequisites) {
      const completedPrereq = await prisma.courseProgress.findFirst({
        where: {
          userId: enrollUserId,
          courseId: prereq.prerequisiteId,
          completedAt: { not: null }
        }
      })

      if (!completedPrereq) {
        return NextResponse.json({
          error: `Prerequisite course "${prereq.prerequisite.title}" must be completed first`,
          missingPrerequisites: [prereq.prerequisite]
        }, { status: 400 })
      }
    }

    // Create enrollment
    const progress = await prisma.courseProgress.create({
      data: {
        userId: enrollUserId,
        courseId,
        progress: 0,
        currentModuleId: course.modules[0]?.id || null,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            modules: {
              orderBy: { order: 'asc' }
            }
          }
        },
        currentModule: true
      }
    })

    // Create notification for enrollment
    await prisma.portalNotification.create({
      data: {
        userId: enrollUserId,
        title: 'Course Enrollment',
        message: `You have been enrolled in "${course.title}"`,
        type: 'SUCCESS',
        category: 'LEARNING',
        relatedId: courseId,
        relatedType: 'course',
        actionUrl: `/portal/learning/courses/${courseId}`,
        actionText: 'Start Learning'
      }
    })

    return NextResponse.json({
      progress,
      nextModule: course.modules[0] || null,
      prerequisites: []
    }, { status: 201 })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  }
}
