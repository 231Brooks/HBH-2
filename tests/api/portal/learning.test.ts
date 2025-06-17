import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/portal/learning/courses/route'
import { POST as enrollPost } from '@/app/api/portal/learning/courses/[courseId]/enroll/route'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/prisma', () => ({
  course: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  courseProgress: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  portalNotification: {
    create: jest.fn(),
  },
}))

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>

describe('/api/portal/learning/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/portal/learning/courses', () => {
    it('should return courses for authenticated user', async () => {
      // Mock user
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
        portalAccess: true,
      } as any)

      // Mock courses data
      const mockCourses = [
        {
          id: 'course-1',
          title: 'Real Estate Basics',
          description: 'Learn the fundamentals',
          category: 'REAL_ESTATE_BASICS',
          difficulty: 'BEGINNER',
          isPublished: true,
          instructor: {
            id: 'instructor-1',
            name: 'John Doe',
            image: null,
          },
          modules: [],
          prerequisites: [],
          unlocks: [],
          _count: { enrollments: 5 },
        },
      ]

      ;(prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/portal/learning/courses',
      })

      await GET(req)

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {
          isPublished: true,
        },
        include: expect.objectContaining({
          instructor: expect.any(Object),
          modules: expect.any(Object),
        }),
      })
    })

    it('should filter courses by category', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/learning/courses?category=ONBOARDING',
      })

      await GET(req)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'ONBOARDING',
          }),
        })
      )
    })

    it('should return 401 for unauthenticated user', async () => {
      mockGetCurrentUser.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'GET',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })
  })

  describe('POST /api/portal/learning/courses', () => {
    it('should create course for authorized user', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      } as any)

      const courseData = {
        title: 'Advanced Bidding',
        description: 'Learn advanced bidding strategies',
        category: 'ADVANCED_BIDDING',
        difficulty: 'ADVANCED',
        duration: 120,
      }

      const mockCreatedCourse = {
        id: 'course-2',
        ...courseData,
        instructorId: 'user-1',
        instructor: {
          id: 'user-1',
          name: 'Test User',
          image: null,
        },
      }

      ;(prisma.course.create as jest.Mock).mockResolvedValue(mockCreatedCourse)

      const { req } = createMocks({
        method: 'POST',
        body: courseData,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.course.title).toBe(courseData.title)
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: courseData.title,
          instructorId: 'user-1',
          isPublished: false,
        }),
        include: expect.any(Object),
      })
    })

    it('should return 403 for unauthorized user', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Course',
          description: 'Test',
          category: 'ONBOARDING',
          difficulty: 'BEGINNER',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should return 400 for missing required fields', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Course',
          // Missing required fields
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
    })
  })

  describe('POST /api/portal/learning/courses/[courseId]/enroll', () => {
    it('should enroll user in course', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        isPublished: true,
        prerequisites: [],
        modules: [{ id: 'module-1', order: 1 }],
      }

      const mockProgress = {
        id: 'progress-1',
        userId: 'user-1',
        courseId: 'course-1',
        progress: 0,
        course: mockCourse,
        currentModule: mockCourse.modules[0],
      }

      ;(prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse)
      ;(prisma.courseProgress.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.courseProgress.create as jest.Mock).mockResolvedValue(mockProgress)

      const { req } = createMocks({
        method: 'POST',
        body: {},
      })

      const response = await enrollPost(req, { params: { courseId: 'course-1' } })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.progress.courseId).toBe('course-1')
      expect(prisma.courseProgress.create).toHaveBeenCalled()
      expect(prisma.portalNotification.create).toHaveBeenCalled()
    })

    it('should return 400 if already enrolled', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      const mockCourse = {
        id: 'course-1',
        isPublished: true,
        prerequisites: [],
        modules: [],
      }

      const existingProgress = {
        id: 'progress-1',
        userId: 'user-1',
        courseId: 'course-1',
      }

      ;(prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse)
      ;(prisma.courseProgress.findUnique as jest.Mock).mockResolvedValue(existingProgress)

      const { req } = createMocks({
        method: 'POST',
        body: {},
      })

      const response = await enrollPost(req, { params: { courseId: 'course-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Already enrolled in this course')
    })

    it('should return 404 for non-existent course', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      ;(prisma.course.findUnique as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {},
      })

      const response = await enrollPost(req, { params: { courseId: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Course not found')
    })
  })
})
