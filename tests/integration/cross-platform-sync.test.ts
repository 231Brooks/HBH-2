import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { CrossPlatformSync } from '@/lib/cross-platform-sync'
import { LearningService } from '@/lib/learning-service'
import { InvestmentService } from '@/lib/investment-service'
import { RealtimeService } from '@/lib/pusher-server'
import prisma from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/prisma')
jest.mock('@/lib/pusher-server')
jest.mock('@/lib/learning-service')
jest.mock('@/lib/investment-service')

describe('CrossPlatformSync Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('syncUserData', () => {
    it('should sync user portal access and notify real-time', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        hbh2Access: true,
        portalAccess: false,
        role: 'USER',
        teamId: null,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        portalAccess: true,
      })
      ;(prisma.portalNotification.create as jest.Mock).mockResolvedValue({})

      const result = await CrossPlatformSync.syncUserData('user-1', {
        portalAccess: true,
      })

      expect(result.success).toBe(true)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { portalAccess: true },
      })
      expect(RealtimeService.notifyPermissionUpdate).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          portalAccess: true,
        })
      )
    })

    it('should handle team assignment changes', async () => {
      const mockUser = {
        id: 'user-1',
        teamId: null,
      }

      const mockTeam = {
        id: 'team-1',
        name: 'Sales Team',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        teamId: 'team-1',
      })
      ;(prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam)
      ;(prisma.portalNotification.create as jest.Mock).mockResolvedValue({})

      const result = await CrossPlatformSync.syncUserData('user-1', {
        teamId: 'team-1',
      })

      expect(result.success).toBe(true)
      expect(prisma.portalNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Team Assignment',
          message: 'You have been assigned to the team "Sales Team"',
        }),
      })
    })
  })

  describe('syncTransactionData', () => {
    it('should sync completed transaction to KPIs', async () => {
      const mockTransaction = {
        id: 'txn-1',
        status: 'COMPLETED',
        price: 250000,
        creatorId: 'user-1',
        propertyId: 'prop-1',
        creator: {
          id: 'user-1',
          teamId: 'team-1',
          team: { id: 'team-1', name: 'Sales Team' },
        },
        property: {
          id: 'prop-1',
          title: 'Test Property',
        },
      }

      ;(prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction)
      ;(prisma.investmentProperty.findUnique as jest.Mock).mockResolvedValue(null)

      // Mock KPI updates
      const mockUserKPIs = [
        {
          id: 'kpi-1',
          unit: 'deals',
          currentValue: 5,
          targetValue: 10,
        },
        {
          id: 'kpi-2',
          unit: 'dollars',
          currentValue: 1000000,
          targetValue: 2000000,
        },
      ]

      ;(prisma.kPI.findMany as jest.Mock).mockResolvedValue(mockUserKPIs)
      ;(prisma.kPI.update as jest.Mock).mockResolvedValue({})
      ;(prisma.kPIHistory.create as jest.Mock).mockResolvedValue({})

      const result = await CrossPlatformSync.syncTransactionData('txn-1')

      expect(result.success).toBe(true)
      expect(prisma.kPI.findMany).toHaveBeenCalledTimes(2) // User and team KPIs
      expect(RealtimeService.notifyDataSync).toHaveBeenCalledWith(
        'transaction',
        expect.objectContaining({
          transactionId: 'txn-1',
          userId: 'user-1',
          teamId: 'team-1',
          amount: 250000,
        })
      )
    })

    it('should handle investment property transactions', async () => {
      const mockTransaction = {
        id: 'txn-1',
        status: 'COMPLETED',
        price: 300000,
        creatorId: 'user-1',
        propertyId: 'prop-1',
        creator: {
          id: 'user-1',
          teamId: null,
        },
      }

      const mockInvestmentProperty = {
        id: 'inv-prop-1',
        groupId: 'group-1',
        purchasePrice: 250000,
        roi: 20,
        group: {
          id: 'group-1',
          name: 'Investment Group 1',
          members: [{ userId: 'user-1' }, { userId: 'user-2' }],
        },
      }

      ;(prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction)
      ;(prisma.investmentProperty.findUnique as jest.Mock).mockResolvedValue(mockInvestmentProperty)
      ;(InvestmentService.updatePropertyValue as jest.Mock).mockResolvedValue({})

      const result = await CrossPlatformSync.syncTransactionData('txn-1')

      expect(result.success).toBe(true)
      expect(InvestmentService.updatePropertyValue).toHaveBeenCalledWith(
        'inv-prop-1',
        300000,
        'Property sold via HBH-2 transaction'
      )
      expect(RealtimeService.notifyPropertyLinked).toHaveBeenCalledWith(
        'group-1',
        expect.objectContaining({
          propertyId: 'prop-1',
          transactionId: 'txn-1',
          salePrice: 300000,
        })
      )
    })

    it('should not sync incomplete transactions', async () => {
      const mockTransaction = {
        id: 'txn-1',
        status: 'PENDING',
        price: 250000,
      }

      ;(prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction)

      const result = await CrossPlatformSync.syncTransactionData('txn-1')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Transaction not completed')
    })
  })

  describe('syncLearningProgress', () => {
    it('should unlock features when course is completed', async () => {
      const mockCourse = {
        id: 'course-1',
        title: 'Advanced Bidding',
        unlocks: [
          {
            id: 'unlock-1',
            featureName: 'advanced_bidding',
            platform: 'HBH2',
            description: 'Advanced bidding tools',
          },
          {
            id: 'unlock-2',
            featureName: 'bulk_operations',
            platform: 'BOTH',
            description: 'Bulk property operations',
          },
        ],
      }

      const mockUnlockedFeatures = [
        { featureName: 'advanced_bidding', platform: 'HBH2' },
        { featureName: 'bulk_operations', platform: 'BOTH' },
      ]

      ;(prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse)
      ;(LearningService.unlockFeatures as jest.Mock).mockResolvedValue(mockUnlockedFeatures)

      const result = await CrossPlatformSync.syncLearningProgress(
        'user-1',
        'course-1',
        true
      )

      expect(result.success).toBe(true)
      expect(result.unlockedFeatures).toEqual(mockUnlockedFeatures)
      expect(LearningService.unlockFeatures).toHaveBeenCalledWith(
        'user-1',
        mockCourse.unlocks
      )
      expect(RealtimeService.notifyFeatureUnlock).toHaveBeenCalledWith(
        'user-1',
        mockUnlockedFeatures,
        'course_completion'
      )
    })

    it('should not unlock features for incomplete courses', async () => {
      const result = await CrossPlatformSync.syncLearningProgress(
        'user-1',
        'course-1',
        false
      )

      expect(result.success).toBe(true)
      expect(result.message).toBe('Course not completed')
      expect(LearningService.unlockFeatures).not.toHaveBeenCalled()
    })

    it('should handle courses with no unlocks', async () => {
      const mockCourse = {
        id: 'course-1',
        unlocks: [],
      }

      ;(prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse)

      const result = await CrossPlatformSync.syncLearningProgress(
        'user-1',
        'course-1',
        true
      )

      expect(result.success).toBe(true)
      expect(result.message).toBe('No features to unlock')
    })
  })

  describe('syncPropertyData', () => {
    it('should sync property changes to investment groups', async () => {
      const mockProperty = {
        id: 'prop-1',
        title: 'Test Property',
        price: 250000,
        creatorId: 'user-1',
        creator: {
          id: 'user-1',
          teamId: 'team-1',
        },
        investmentProperty: {
          id: 'inv-prop-1',
          groupId: 'group-1',
          purchasePrice: 200000,
          group: {
            id: 'group-1',
            name: 'Investment Group',
            members: [{ userId: 'user-1' }],
          },
        },
      }

      ;(prisma.property.findUnique as jest.Mock).mockResolvedValue(mockProperty)
      ;(InvestmentService.updatePropertyValue as jest.Mock).mockResolvedValue({})
      ;(InvestmentService.calculateROI as jest.Mock).mockResolvedValue(25)

      const result = await CrossPlatformSync.syncPropertyData('prop-1', {
        price: 300000,
      })

      expect(result.success).toBe(true)
      expect(InvestmentService.updatePropertyValue).toHaveBeenCalledWith(
        'inv-prop-1',
        300000,
        'Property value updated from HBH-2'
      )
      expect(RealtimeService.notifyInvestmentMade).toHaveBeenCalledWith(
        'group-1',
        expect.objectContaining({
          type: 'property_value_update',
          propertyId: 'prop-1',
          oldValue: 250000,
          newValue: 300000,
          roi: 25,
        })
      )
    })

    it('should handle properties without investment groups', async () => {
      const mockProperty = {
        id: 'prop-1',
        creatorId: 'user-1',
        creator: {
          id: 'user-1',
          teamId: 'team-1',
        },
        investmentProperty: null,
      }

      ;(prisma.property.findUnique as jest.Mock).mockResolvedValue(mockProperty)

      const result = await CrossPlatformSync.syncPropertyData('prop-1', {
        price: 300000,
      })

      expect(result.success).toBe(true)
      expect(InvestmentService.updatePropertyValue).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      await expect(
        CrossPlatformSync.syncUserData('user-1', { portalAccess: true })
      ).rejects.toThrow('Database connection failed')
    })

    it('should handle missing entities', async () => {
      ;(prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        CrossPlatformSync.syncTransactionData('non-existent')
      ).rejects.toThrow('Transaction not found')
    })
  })
})
