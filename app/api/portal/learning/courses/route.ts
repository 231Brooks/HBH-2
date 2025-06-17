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
    const difficulty = searchParams.get('difficulty')
    const instructorId = searchParams.get('instructorId')
    const isRequired = searchParams.get('isRequired')
    const userProgress = searchParams.get('userProgress') === 'true'

    const courses = await prisma.course.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(instructorId && { instructorId }),
        ...(isRequired && { isRequired: isRequired === 'true' }),
        isPublished: true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
          }
        },
        prerequisites: {
          include: {
            prerequisite: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        },
        unlocks: true,
        _count: {
          select: { enrollments: true }
        },
        ...(userProgress && {
          enrollments: {
            where: { userId: user.id },
            select: {
              id: true,
              progress: true,
              completedAt: true,
              startedAt: true,
              timeSpent: true,
              currentModuleId: true,
            }
          }
        })
      }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
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

    if (!hasPortalPermission(user.role as any, 'canCreateCourses')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration || 0,
        thumbnailUrl: data.thumbnailUrl,
        instructorId: user.id,
        isRequired: data.isRequired || false,
        requiredForRole: data.requiredForRole,
        isPublished: false, // Courses start as drafts
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
