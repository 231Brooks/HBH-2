import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { LearningService } from '@/lib/learning-service'
import prisma from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { progressId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { progressId } = params
    const { moduleId, timeSpent, completed } = await request.json()

    // Verify user owns this progress record
    const progress = await prisma.courseProgress.findUnique({
      where: { id: progressId },
      include: {
        course: {
          include: {
            modules: { orderBy: { order: 'asc' } },
            unlocks: true
          }
        }
      }
    })

    if (!progress) {
      return NextResponse.json({ error: 'Progress record not found' }, { status: 404 })
    }

    if (progress.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update progress
    const updatedProgress = await LearningService.updateProgress(
      progressId,
      moduleId,
      timeSpent,
      completed
    )

    return NextResponse.json({
      progress: updatedProgress.progress,
      unlockedFeatures: updatedProgress.unlockedFeatures || [],
      certificationsEarned: updatedProgress.certificationsEarned || []
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { progressId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { progressId } = params

    const progress = await prisma.courseProgress.findUnique({
      where: { id: progressId },
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
              orderBy: { order: 'asc' },
              include: {
                quiz: {
                  include: {
                    scores: {
                      where: { userId: user.id },
                      orderBy: { completedAt: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        },
        currentModule: true,
        quizScores: {
          include: {
            quiz: {
              include: {
                module: {
                  select: {
                    id: true,
                    title: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!progress) {
      return NextResponse.json({ error: 'Progress record not found' }, { status: 404 })
    }

    if (progress.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
