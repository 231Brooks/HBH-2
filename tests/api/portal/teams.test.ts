import { describe, it, expect, beforeEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/portal/teams/route'
import { PUT } from '@/app/api/portal/teams/[teamId]/members/route'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

jest.mock('@/lib/auth')
jest.mock('@/lib/prisma', () => ({
  team: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  portalNotification: {
    create: jest.fn(),
  },
}))

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>

describe('/api/portal/teams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/portal/teams', () => {
    it('should return teams for authorized user', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      const mockTeams = [
        {
          id: 'team-1',
          name: 'Sales Team Atlanta',
          location: 'Atlanta, GA',
          type: 'SALES',
          leader: {
            id: 'leader-1',
            name: 'Team Leader',
            image: null,
            email: 'leader@example.com',
          },
          _count: {
            members: 5,
            kpis: 3,
            goals: 2,
          },
        },
      ]

      ;(prisma.team.findMany as jest.Mock).mockResolvedValue(mockTeams)

      const { req } = createMocks({
        method: 'GET',
      })

      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.teams).toHaveLength(1)
      expect(data.teams[0].name).toBe('Sales Team Atlanta')
    })

    it('should filter teams by location', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'GET',
        url: '/api/portal/teams?location=Atlanta',
      })

      await GET(req)

      expect(prisma.team.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: 'Atlanta',
          }),
        })
      )
    })

    it('should only show user teams for non-admin', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'USER',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'GET',
      })

      await GET(req)

      expect(prisma.team.findMany).toHaveBeenCalledWith(
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
  })

  describe('POST /api/portal/teams', () => {
    it('should create team for authorized user', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      const teamData = {
        name: 'New Sales Team',
        description: 'A new sales team',
        location: 'Miami, FL',
        type: 'SALES',
        leaderId: 'leader-1',
      }

      const mockLeader = {
        id: 'leader-1',
        name: 'Team Leader',
        email: 'leader@example.com',
      }

      const mockCreatedTeam = {
        id: 'team-2',
        ...teamData,
        leader: mockLeader,
        members: [mockLeader],
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockLeader)
      ;(prisma.team.create as jest.Mock).mockResolvedValue(mockCreatedTeam)

      const { req } = createMocks({
        method: 'POST',
        body: teamData,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.team.name).toBe(teamData.name)
      expect(prisma.team.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: teamData.name,
          leaderId: teamData.leaderId,
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
          name: 'Test Team',
          location: 'Test',
          type: 'SALES',
          leaderId: 'leader-1',
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
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Team',
          // Missing required fields
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
    })

    it('should return 400 for non-existent leader', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Team',
          location: 'Test',
          type: 'SALES',
          leaderId: 'non-existent',
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Leader not found')
    })
  })

  describe('PUT /api/portal/teams/[teamId]/members', () => {
    it('should add members to team', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'leader-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      } as any)

      const mockTeam = {
        id: 'team-1',
        name: 'Test Team',
        leaderId: 'leader-1',
        leader: { id: 'leader-1', name: 'Leader' },
        members: [{ id: 'leader-1' }],
      }

      const mockUsers = [
        { id: 'user-1', name: 'User 1' },
        { id: 'user-2', name: 'User 2' },
      ]

      const updatedTeam = {
        ...mockTeam,
        members: [...mockTeam.members, ...mockUsers],
      }

      ;(prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam)
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers)
      ;(prisma.team.update as jest.Mock).mockResolvedValue(updatedTeam)

      const { req } = createMocks({
        method: 'PUT',
        body: {
          addMembers: ['user-1', 'user-2'],
        },
      })

      const response = await PUT(req, { params: { teamId: 'team-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(prisma.team.update).toHaveBeenCalledWith({
        where: { id: 'team-1' },
        data: {
          members: {
            connect: [{ id: 'user-1' }, { id: 'user-2' }],
          },
        },
      })
    })

    it('should remove members from team', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'leader-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      } as any)

      const mockTeam = {
        id: 'team-1',
        leaderId: 'leader-1',
        members: [
          { id: 'leader-1' },
          { id: 'user-1' },
          { id: 'user-2' },
        ],
      }

      ;(prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam)

      const { req } = createMocks({
        method: 'PUT',
        body: {
          removeMembers: ['user-1'],
        },
      })

      const response = await PUT(req, { params: { teamId: 'team-1' } })

      expect(response.status).toBe(200)
      expect(prisma.team.update).toHaveBeenCalledWith({
        where: { id: 'team-1' },
        data: {
          members: {
            disconnect: [{ id: 'user-1' }],
          },
        },
      })
    })

    it('should not allow removing team leader', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'leader-1',
        role: 'PROFESSIONAL',
        portalAccess: true,
      } as any)

      const mockTeam = {
        id: 'team-1',
        leaderId: 'leader-1',
        members: [{ id: 'leader-1' }],
      }

      ;(prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam)

      const { req } = createMocks({
        method: 'PUT',
        body: {
          removeMembers: ['leader-1'],
        },
      })

      const response = await PUT(req, { params: { teamId: 'team-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Cannot remove team leader')
    })

    it('should return 404 for non-existent team', async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: 'user-1',
        role: 'ADMIN',
        portalAccess: true,
      } as any)

      ;(prisma.team.findUnique as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'PUT',
        body: { addMembers: ['user-1'] },
      })

      const response = await PUT(req, { params: { teamId: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Team not found')
    })
  })
})
