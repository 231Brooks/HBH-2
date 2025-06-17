import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { GET as getCourses, POST as createCourse } from '@/app/api/portal/learning/courses/route'
import { GET as getTeams, POST as createTeam } from '@/app/api/portal/teams/route'
import { POST as createInvestmentGroup } from '@/app/api/portal/investments/groups/route'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'

jest.mock('@/lib/auth')
jest.mock('@/lib/user-roles')
jest.mock('@/lib/prisma', () => ({
  course: { findMany: jest.fn(), create: jest.fn() },
  team: { findMany: jest.fn(), create: jest.fn() },
  investmentGroup: { create: jest.fn() },
  user: { findUnique: jest.fn() },
}))

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
const mockHasPortalPermission = hasPortalPermission as jest.MockedFunction<typeof hasPortalPermission>

describe('Authorization Security', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Role-Based Access Control', () => {
    it('should enforce USER role limitations', async () => {
      const userRoleUser = {
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(userRoleUser as any)
      mockHasPortalPermission.mockReturnValue(false)

      // USER should not be able to create courses
      const { req: courseReq } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Course',
          description: 'Test',
          category: 'ONBOARDING',
          difficulty: 'BEGINNER',
        },
      })

      const courseResponse = await createCourse(courseReq)
      const courseData = await courseResponse.json()

      expect(courseResponse.status).toBe(403)
      expect(courseData.error).toBe('Insufficient permissions')

      // USER should not be able to create teams
      const { req: teamReq } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Team',
          location: 'Test',
          type: 'SALES',
          leaderId: 'user-1',
        },
      })

      const teamResponse = await createTeam(teamReq)
      const teamData = await teamResponse.json()

      expect(teamResponse.status).toBe(403)
      expect(teamData.error).toBe('Insufficient permissions')
    })

    it('should allow PROFESSIONAL role to create courses', async () => {
      const professionalUser = {
        id: 'user-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(professionalUser as any)
      mockHasPortalPermission.mockReturnValue(true)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'Advanced Course',
          description: 'Advanced training',
          category: 'ADVANCED_BIDDING',
          difficulty: 'ADVANCED',
        },
      })

      // Mock successful course creation
      const mockCourse = {
        id: 'course-1',
        title: 'Advanced Course',
        instructorId: 'user-1',
      }

      require('@/lib/prisma').course.create.mockResolvedValue(mockCourse)

      const response = await createCourse(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.course.title).toBe('Advanced Course')
    })

    it('should allow ADMIN role full access', async () => {
      const adminUser = {
        id: 'admin-1',
        role: 'ADMIN',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(adminUser as any)
      mockHasPortalPermission.mockReturnValue(true)

      // Admin should be able to create teams
      const mockTeam = {
        id: 'team-1',
        name: 'Admin Team',
        leaderId: 'admin-1',
      }

      require('@/lib/prisma').team.create.mockResolvedValue(mockTeam)
      require('@/lib/prisma').user.findUnique.mockResolvedValue({ id: 'admin-1' })

      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'Admin Team',
          location: 'HQ',
          type: 'MANAGEMENT',
          leaderId: 'admin-1',
        },
      })

      const response = await createTeam(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.team.name).toBe('Admin Team')
    })
  })

  describe('Resource Access Control', () => {
    it('should limit team visibility for non-admin users', async () => {
      const regularUser = {
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(regularUser as any)
      mockHasPortalPermission.mockReturnValue(false)

      const { req } = createMocks({ method: 'GET' })

      await getTeams(req)

      // Verify that the query includes user-specific filters
      expect(require('@/lib/prisma').team.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { leaderId: 'user-1' },
              { members: { some: { id: 'user-1' } } },
            ],
          }),
        })
      )
    })

    it('should allow admin users to see all teams', async () => {
      const adminUser = {
        id: 'admin-1',
        role: 'ADMIN',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(adminUser as any)
      mockHasPortalPermission.mockReturnValue(true)

      const { req } = createMocks({ method: 'GET' })

      await getTeams(req)

      // Verify that admin sees all teams without user-specific filters
      expect(require('@/lib/prisma').team.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            OR: expect.any(Array),
          }),
        })
      )
    })
  })

  describe('Cross-Platform Permission Validation', () => {
    it('should validate portal access for portal-specific operations', async () => {
      const userWithoutPortalAccess = {
        id: 'user-1',
        role: 'USER',
        portalAccess: false,
      }

      mockGetCurrentUser.mockResolvedValue(userWithoutPortalAccess as any)

      const { req } = createMocks({ method: 'GET' })

      const response = await getCourses(req)
      const data = await response.json()

      // Should still work for viewing courses, but with limited functionality
      expect(response.status).toBe(200)
    })

    it('should prevent unauthorized investment group creation', async () => {
      const regularUser = {
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(regularUser as any)
      mockHasPortalPermission.mockReturnValue(false)

      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Investment Group',
          targetAmount: 100000,
          minimumInvestment: 5000,
        },
      })

      const response = await createInvestmentGroup(req)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })
  })

  describe('Data Isolation', () => {
    it('should prevent users from accessing other users data', async () => {
      const user1 = {
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(user1 as any)

      // Attempt to access another user's data through query parameters
      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/learning/courses?userId=user-2',
      })

      await getCourses(req)

      // Verify that the query doesn't include other user's data
      // The API should ignore the userId parameter for non-admin users
      expect(require('@/lib/prisma').course.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          where: expect.objectContaining({
            userId: 'user-2',
          }),
        })
      )
    })

    it('should allow admin users to access any user data', async () => {
      const adminUser = {
        id: 'admin-1',
        role: 'ADMIN',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(adminUser as any)
      mockHasPortalPermission.mockReturnValue(true)

      // Admin should be able to query specific user data
      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/learning/courses?userId=user-2',
      })

      await getCourses(req)

      // Admin queries should respect the userId parameter
      expect(require('@/lib/prisma').course.findMany).toHaveBeenCalled()
    })
  })

  describe('Permission Inheritance', () => {
    it('should respect team-based permissions', async () => {
      const teamLeader = {
        id: 'leader-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
        teamId: 'team-1',
      }

      mockGetCurrentUser.mockResolvedValue(teamLeader as any)
      mockHasPortalPermission.mockReturnValue(true)

      // Team leaders should have additional permissions for their team
      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/teams?teamId=team-1',
      })

      await getTeams(req)

      // Should be able to access team-specific data
      expect(require('@/lib/prisma').team.findMany).toHaveBeenCalled()
    })
  })

  describe('Privilege Escalation Prevention', () => {
    it('should prevent horizontal privilege escalation', async () => {
      const user1 = {
        id: 'user-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
        teamId: 'team-1',
      }

      mockGetCurrentUser.mockResolvedValue(user1 as any)

      // User should not be able to access another team's data
      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/teams?teamId=team-2',
      })

      await getTeams(req)

      // Should only see teams they have access to
      expect(require('@/lib/prisma').team.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { leaderId: 'user-1' },
              { members: { some: { id: 'user-1' } } },
            ],
          }),
        })
      )
    })

    it('should prevent vertical privilege escalation', async () => {
      const regularUser = {
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      }

      mockGetCurrentUser.mockResolvedValue(regularUser as any)
      mockHasPortalPermission.mockReturnValue(false)

      // User should not be able to perform admin actions
      const adminActions = [
        { endpoint: createTeam, body: { name: 'Test', type: 'SALES', leaderId: 'user-1' } },
        { endpoint: createCourse, body: { title: 'Test', category: 'ONBOARDING' } },
      ]

      for (const action of adminActions) {
        const { req } = createMocks({
          method: 'POST',
          body: action.body,
        })

        const response = await action.endpoint(req)
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.error).toBe('Insufficient permissions')
      }
    })
  })
})
