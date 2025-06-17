// Server-side Pusher configuration
import Pusher from "pusher"
import { env } from "@/lib/env-config"

let pusherServer: Pusher | null = null

export function getPusherServer(): Pusher {
  if (!pusherServer) {
    if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
      throw new Error("Pusher configuration is incomplete")
    }

    pusherServer = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    })
  }

  return pusherServer
}

// Helper function to trigger events from server-side
export async function triggerPusherEvent(channel: string, event: string, data: any, socketId?: string): Promise<void> {
  const pusher = getPusherServer()
  await pusher.trigger(channel, event, data, socketId)
}

// Channel naming conventions
export const CHANNELS = {
  // HBH-2 channels (existing)
  AUCTION_UPDATES: (propertyId: string) => `auction-${propertyId}`,
  TRANSACTION_UPDATES: (transactionId: string) => `transaction-${transactionId}`,
  PROPERTY_UPDATES: (propertyId: string) => `property-${propertyId}`,

  // Portal channels (new)
  LEARNING_PROGRESS: (userId: string) => `learning-${userId}`,
  TEAM_UPDATES: (teamId: string) => `team-${teamId}`,
  INVESTMENT_UPDATES: (groupId: string) => `investment-${groupId}`,
  KPI_UPDATES: (kpiId: string) => `kpi-${kpiId}`,
  USER_NOTIFICATIONS: (userId: string) => `notifications-${userId}`,

  // Cross-platform channels
  FEATURE_UNLOCKS: (userId: string) => `features-${userId}`,
  PLATFORM_SYNC: 'platform-sync',
  ADMIN_UPDATES: 'admin-updates',
}

// Event types
export const EVENTS = {
  // Learning events
  COURSE_ENROLLED: 'course.enrolled',
  COURSE_COMPLETED: 'course.completed',
  MODULE_COMPLETED: 'module.completed',
  CERTIFICATION_EARNED: 'certification.earned',
  FEATURE_UNLOCKED: 'feature.unlocked',

  // Team events
  TEAM_MEMBER_ADDED: 'team.member.added',
  TEAM_MEMBER_REMOVED: 'team.member.removed',
  TEAM_LEADER_CHANGED: 'team.leader.changed',
  TEAM_GOAL_UPDATED: 'team.goal.updated',

  // Investment events
  INVESTMENT_MADE: 'investment.made',
  PROPERTY_LINKED: 'investment.property.linked',
  DISTRIBUTION_MADE: 'investment.distribution.made',
  ROI_UPDATED: 'investment.roi.updated',

  // KPI events
  KPI_UPDATED: 'kpi.updated',
  KPI_ALERT_TRIGGERED: 'kpi.alert.triggered',
  KPI_TARGET_REACHED: 'kpi.target.reached',

  // Cross-platform events
  USER_PERMISSION_UPDATED: 'user.permission.updated',
  PLATFORM_SWITCH: 'platform.switch',
  DATA_SYNC_COMPLETE: 'data.sync.complete',

  // Notification events
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_READ: 'notification.read',
}

export class RealtimeService {
  // Learning events
  static async notifyCourseEnrollment(userId: string, courseData: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.LEARNING_PROGRESS(userId),
      EVENTS.COURSE_ENROLLED,
      {
        userId,
        course: courseData,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyCourseCompletion(userId: string, courseData: any, unlockedFeatures: any[] = []) {
    const pusher = getPusherServer()

    // Notify user's learning channel
    await pusher.trigger(
      CHANNELS.LEARNING_PROGRESS(userId),
      EVENTS.COURSE_COMPLETED,
      {
        userId,
        course: courseData,
        unlockedFeatures,
        timestamp: new Date().toISOString(),
      }
    )

    // Notify feature unlock channel if features were unlocked
    if (unlockedFeatures.length > 0) {
      await pusher.trigger(
        CHANNELS.FEATURE_UNLOCKS(userId),
        EVENTS.FEATURE_UNLOCKED,
        {
          userId,
          features: unlockedFeatures,
          source: 'course_completion',
          courseId: courseData.id,
          timestamp: new Date().toISOString(),
        }
      )
    }
  }

  static async notifyCertificationEarned(userId: string, certificationData: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.LEARNING_PROGRESS(userId),
      EVENTS.CERTIFICATION_EARNED,
      {
        userId,
        certification: certificationData,
        timestamp: new Date().toISOString(),
      }
    )
  }

  // Team events
  static async notifyTeamMemberAdded(teamId: string, memberData: any, addedBy: string) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.TEAM_UPDATES(teamId),
      EVENTS.TEAM_MEMBER_ADDED,
      {
        teamId,
        member: memberData,
        addedBy,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyTeamLeaderChanged(teamId: string, oldLeader: any, newLeader: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.TEAM_UPDATES(teamId),
      EVENTS.TEAM_LEADER_CHANGED,
      {
        teamId,
        oldLeader,
        newLeader,
        timestamp: new Date().toISOString(),
      }
    )
  }

  // Investment events
  static async notifyInvestmentMade(groupId: string, investmentData: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.INVESTMENT_UPDATES(groupId),
      EVENTS.INVESTMENT_MADE,
      {
        groupId,
        investment: investmentData,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyPropertyLinked(groupId: string, propertyData: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.INVESTMENT_UPDATES(groupId),
      EVENTS.PROPERTY_LINKED,
      {
        groupId,
        property: propertyData,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyDistributionMade(groupId: string, distributionData: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.INVESTMENT_UPDATES(groupId),
      EVENTS.DISTRIBUTION_MADE,
      {
        groupId,
        distribution: distributionData,
        timestamp: new Date().toISOString(),
      }
    )
  }

  // KPI events
  static async notifyKPIUpdated(kpiId: string, kpiData: any, previousValue?: number) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.KPI_UPDATES(kpiId),
      EVENTS.KPI_UPDATED,
      {
        kpiId,
        kpi: kpiData,
        previousValue,
        change: previousValue ? kpiData.currentValue - previousValue : 0,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyKPIAlert(kpiId: string, alertData: any, recipients: string[]) {
    const pusher = getPusherServer()

    // Notify KPI channel
    await pusher.trigger(
      CHANNELS.KPI_UPDATES(kpiId),
      EVENTS.KPI_ALERT_TRIGGERED,
      {
        kpiId,
        alert: alertData,
        timestamp: new Date().toISOString(),
      }
    )

    // Notify individual recipients
    for (const userId of recipients) {
      await pusher.trigger(
        CHANNELS.USER_NOTIFICATIONS(userId),
        EVENTS.KPI_ALERT_TRIGGERED,
        {
          kpiId,
          alert: alertData,
          timestamp: new Date().toISOString(),
        }
      )
    }
  }

  // Cross-platform events
  static async notifyFeatureUnlock(userId: string, features: any[], source: string) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.FEATURE_UNLOCKS(userId),
      EVENTS.FEATURE_UNLOCKED,
      {
        userId,
        features,
        source,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyPermissionUpdate(userId: string, permissions: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.FEATURE_UNLOCKS(userId),
      EVENTS.USER_PERMISSION_UPDATED,
      {
        userId,
        permissions,
        timestamp: new Date().toISOString(),
      }
    )
  }

  static async notifyDataSync(syncType: string, results: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.PLATFORM_SYNC,
      EVENTS.DATA_SYNC_COMPLETE,
      {
        syncType,
        results,
        timestamp: new Date().toISOString(),
      }
    )
  }

  // Notification events
  static async notifyUser(userId: string, notification: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.USER_NOTIFICATIONS(userId),
      EVENTS.NOTIFICATION_CREATED,
      {
        notification,
        timestamp: new Date().toISOString(),
      }
    )
  }

  // Batch notifications
  static async notifyMultipleUsers(userIds: string[], event: string, data: any) {
    const pusher = getPusherServer()
    const channels = userIds.map(id => CHANNELS.USER_NOTIFICATIONS(id))

    if (channels.length > 0) {
      await pusher.triggerBatch(
        channels.map(channel => ({
          channel,
          name: event,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
          }
        }))
      )
    }
  }

  // Admin notifications
  static async notifyAdmins(event: string, data: any) {
    const pusher = getPusherServer()
    await pusher.trigger(
      CHANNELS.ADMIN_UPDATES,
      event,
      {
        ...data,
        timestamp: new Date().toISOString(),
      }
    )
  }
}
