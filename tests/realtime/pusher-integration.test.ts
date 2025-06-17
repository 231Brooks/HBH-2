import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { RealtimeService, CHANNELS, EVENTS } from '@/lib/pusher-server'
import { getPusherServer } from '@/lib/pusher-server'

// Mock Pusher
const mockTrigger = jest.fn()
const mockTriggerBatch = jest.fn()

jest.mock('@/lib/pusher-server', () => ({
  ...jest.requireActual('@/lib/pusher-server'),
  getPusherServer: jest.fn(() => ({
    trigger: mockTrigger,
    triggerBatch: mockTriggerBatch,
  })),
}))

describe('RealtimeService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Learning Events', () => {
    it('should notify course enrollment', async () => {
      const userId = 'user-1'
      const courseData = {
        id: 'course-1',
        title: 'Test Course',
        instructor: { name: 'Instructor' },
      }

      await RealtimeService.notifyCourseEnrollment(userId, courseData)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.LEARNING_PROGRESS(userId),
        EVENTS.COURSE_ENROLLED,
        expect.objectContaining({
          userId,
          course: courseData,
          timestamp: expect.any(String),
        })
      )
    })

    it('should notify course completion with feature unlocks', async () => {
      const userId = 'user-1'
      const courseData = { id: 'course-1', title: 'Test Course' }
      const unlockedFeatures = [
        { featureName: 'advanced_bidding', platform: 'HBH2' },
      ]

      await RealtimeService.notifyCourseCompletion(
        userId,
        courseData,
        unlockedFeatures
      )

      expect(mockTrigger).toHaveBeenCalledTimes(2)
      
      // Course completion notification
      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.LEARNING_PROGRESS(userId),
        EVENTS.COURSE_COMPLETED,
        expect.objectContaining({
          userId,
          course: courseData,
          unlockedFeatures,
        })
      )

      // Feature unlock notification
      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.FEATURE_UNLOCKS(userId),
        EVENTS.FEATURE_UNLOCKED,
        expect.objectContaining({
          userId,
          features: unlockedFeatures,
          source: 'course_completion',
        })
      )
    })

    it('should notify certification earned', async () => {
      const userId = 'user-1'
      const certificationData = {
        id: 'cert-1',
        name: 'Real Estate Expert',
        issuer: 'HBH Portal',
      }

      await RealtimeService.notifyCertificationEarned(userId, certificationData)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.LEARNING_PROGRESS(userId),
        EVENTS.CERTIFICATION_EARNED,
        expect.objectContaining({
          userId,
          certification: certificationData,
        })
      )
    })
  })

  describe('Team Events', () => {
    it('should notify team member added', async () => {
      const teamId = 'team-1'
      const memberData = { id: 'user-2', name: 'New Member' }
      const addedBy = 'user-1'

      await RealtimeService.notifyTeamMemberAdded(teamId, memberData, addedBy)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.TEAM_UPDATES(teamId),
        EVENTS.TEAM_MEMBER_ADDED,
        expect.objectContaining({
          teamId,
          member: memberData,
          addedBy,
        })
      )
    })

    it('should notify team leader changed', async () => {
      const teamId = 'team-1'
      const oldLeader = { id: 'user-1', name: 'Old Leader' }
      const newLeader = { id: 'user-2', name: 'New Leader' }

      await RealtimeService.notifyTeamLeaderChanged(teamId, oldLeader, newLeader)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.TEAM_UPDATES(teamId),
        EVENTS.TEAM_LEADER_CHANGED,
        expect.objectContaining({
          teamId,
          oldLeader,
          newLeader,
        })
      )
    })
  })

  describe('Investment Events', () => {
    it('should notify investment made', async () => {
      const groupId = 'group-1'
      const investmentData = {
        userId: 'user-1',
        amount: 10000,
        groupName: 'Test Group',
      }

      await RealtimeService.notifyInvestmentMade(groupId, investmentData)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.INVESTMENT_UPDATES(groupId),
        EVENTS.INVESTMENT_MADE,
        expect.objectContaining({
          groupId,
          investment: investmentData,
        })
      )
    })

    it('should notify property linked', async () => {
      const groupId = 'group-1'
      const propertyData = {
        id: 'prop-1',
        title: 'Test Property',
        purchasePrice: 250000,
      }

      await RealtimeService.notifyPropertyLinked(groupId, propertyData)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.INVESTMENT_UPDATES(groupId),
        EVENTS.PROPERTY_LINKED,
        expect.objectContaining({
          groupId,
          property: propertyData,
        })
      )
    })

    it('should notify distribution made', async () => {
      const groupId = 'group-1'
      const distributionData = {
        totalAmount: 5000,
        type: 'PROFIT',
        propertyId: 'prop-1',
      }

      await RealtimeService.notifyDistributionMade(groupId, distributionData)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.INVESTMENT_UPDATES(groupId),
        EVENTS.DISTRIBUTION_MADE,
        expect.objectContaining({
          groupId,
          distribution: distributionData,
        })
      )
    })
  })

  describe('KPI Events', () => {
    it('should notify KPI updated', async () => {
      const kpiId = 'kpi-1'
      const kpiData = {
        id: 'kpi-1',
        name: 'Monthly Sales',
        currentValue: 15,
        targetValue: 20,
        unit: 'deals',
      }
      const previousValue = 12

      await RealtimeService.notifyKPIUpdated(kpiId, kpiData, previousValue)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.KPI_UPDATES(kpiId),
        EVENTS.KPI_UPDATED,
        expect.objectContaining({
          kpiId,
          kpi: kpiData,
          previousValue,
          change: 3,
        })
      )
    })

    it('should notify KPI alert to multiple recipients', async () => {
      const kpiId = 'kpi-1'
      const alertData = {
        id: 'alert-1',
        name: 'Sales Target Alert',
        message: 'Sales target at risk',
        condition: 'BELOW_THRESHOLD',
      }
      const recipients = ['user-1', 'user-2', 'user-3']

      await RealtimeService.notifyKPIAlert(kpiId, alertData, recipients)

      expect(mockTrigger).toHaveBeenCalledTimes(4) // 1 KPI channel + 3 user channels

      // KPI channel notification
      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.KPI_UPDATES(kpiId),
        EVENTS.KPI_ALERT_TRIGGERED,
        expect.objectContaining({
          kpiId,
          alert: alertData,
        })
      )

      // Individual user notifications
      recipients.forEach(userId => {
        expect(mockTrigger).toHaveBeenCalledWith(
          CHANNELS.USER_NOTIFICATIONS(userId),
          EVENTS.KPI_ALERT_TRIGGERED,
          expect.objectContaining({
            kpiId,
            alert: alertData,
          })
        )
      })
    })
  })

  describe('Cross-platform Events', () => {
    it('should notify feature unlock', async () => {
      const userId = 'user-1'
      const features = [
        { featureName: 'advanced_bidding', platform: 'HBH2' },
        { featureName: 'bulk_operations', platform: 'BOTH' },
      ]
      const source = 'course_completion'

      await RealtimeService.notifyFeatureUnlock(userId, features, source)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.FEATURE_UNLOCKS(userId),
        EVENTS.FEATURE_UNLOCKED,
        expect.objectContaining({
          userId,
          features,
          source,
        })
      )
    })

    it('should notify permission update', async () => {
      const userId = 'user-1'
      const permissions = {
        hbh2Access: true,
        portalAccess: true,
        role: 'PROFESSIONAL',
      }

      await RealtimeService.notifyPermissionUpdate(userId, permissions)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.FEATURE_UNLOCKS(userId),
        EVENTS.USER_PERMISSION_UPDATED,
        expect.objectContaining({
          userId,
          permissions,
        })
      )
    })

    it('should notify data sync completion', async () => {
      const syncType = 'transaction'
      const results = {
        syncedTransactions: 15,
        updatedKPIs: 8,
        errors: [],
      }

      await RealtimeService.notifyDataSync(syncType, results)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.PLATFORM_SYNC,
        EVENTS.DATA_SYNC_COMPLETE,
        expect.objectContaining({
          syncType,
          results,
        })
      )
    })
  })

  describe('Batch Notifications', () => {
    it('should send batch notifications to multiple users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3']
      const event = EVENTS.NOTIFICATION_CREATED
      const data = {
        title: 'System Update',
        message: 'Platform maintenance scheduled',
      }

      await RealtimeService.notifyMultipleUsers(userIds, event, data)

      expect(mockTriggerBatch).toHaveBeenCalledWith([
        {
          channel: CHANNELS.USER_NOTIFICATIONS('user-1'),
          name: event,
          data: expect.objectContaining(data),
        },
        {
          channel: CHANNELS.USER_NOTIFICATIONS('user-2'),
          name: event,
          data: expect.objectContaining(data),
        },
        {
          channel: CHANNELS.USER_NOTIFICATIONS('user-3'),
          name: event,
          data: expect.objectContaining(data),
        },
      ])
    })

    it('should handle empty user list', async () => {
      await RealtimeService.notifyMultipleUsers([], EVENTS.NOTIFICATION_CREATED, {})

      expect(mockTriggerBatch).not.toHaveBeenCalled()
    })
  })

  describe('Admin Notifications', () => {
    it('should notify admins of system events', async () => {
      const event = 'system.maintenance'
      const data = {
        type: 'scheduled_maintenance',
        startTime: '2024-01-01T02:00:00Z',
        duration: '2 hours',
      }

      await RealtimeService.notifyAdmins(event, data)

      expect(mockTrigger).toHaveBeenCalledWith(
        CHANNELS.ADMIN_UPDATES,
        event,
        expect.objectContaining(data)
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle Pusher connection errors', async () => {
      mockTrigger.mockRejectedValue(new Error('Pusher connection failed'))

      await expect(
        RealtimeService.notifyUser('user-1', { title: 'Test' })
      ).rejects.toThrow('Pusher connection failed')
    })

    it('should handle invalid channel names', async () => {
      // Test with undefined userId
      await expect(
        RealtimeService.notifyUser(undefined as any, { title: 'Test' })
      ).rejects.toThrow()
    })
  })
})
