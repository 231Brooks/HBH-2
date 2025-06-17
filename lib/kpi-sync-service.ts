import prisma from './prisma'
import { RealtimeService } from './pusher-server'

export class KPISyncService {
  static async syncTransactionKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    // Get completed transactions in date range
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        creator: {
          include: {
            team: true
          }
        },
        parties: {
          include: { user: true }
        }
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'SALES_PERFORMANCE',
        dataSource: 'HBH2_TRANSACTIONS',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        // Calculate KPI value based on transactions
        if (kpi.unit === 'deals') {
          // Count transactions
          if (kpi.ownerId) {
            newValue = transactions.filter(t => t.creatorId === kpi.ownerId).length
          } else if (kpi.teamId) {
            newValue = transactions.filter(t => t.creator.teamId === kpi.teamId).length
          } else {
            newValue = transactions.length
          }
        } else if (kpi.unit === 'dollars') {
          // Sum transaction values
          if (kpi.ownerId) {
            newValue = transactions
              .filter(t => t.creatorId === kpi.ownerId)
              .reduce((sum, t) => sum + t.price, 0)
          } else if (kpi.teamId) {
            newValue = transactions
              .filter(t => t.creator.teamId === kpi.teamId)
              .reduce((sum, t) => sum + t.price, 0)
          } else {
            newValue = transactions.reduce((sum, t) => sum + t.price, 0)
          }
        }

        if (newValue !== kpi.currentValue) {
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from transactions')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  static async syncPropertyKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    // Get properties in date range
    const properties = await prisma.property.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        creator: {
          include: {
            team: true
          }
        }
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'PROPERTY_METRICS',
        dataSource: 'HBH2_PROPERTIES',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        if (kpi.unit === 'listings') {
          // Count property listings
          if (kpi.ownerId) {
            newValue = properties.filter(p => p.creatorId === kpi.ownerId).length
          } else if (kpi.teamId) {
            newValue = properties.filter(p => p.creator.teamId === kpi.teamId).length
          } else {
            newValue = properties.length
          }
        } else if (kpi.unit === 'dollars') {
          // Average property value
          const relevantProperties = kpi.ownerId 
            ? properties.filter(p => p.creatorId === kpi.ownerId)
            : kpi.teamId 
            ? properties.filter(p => p.creator.teamId === kpi.teamId)
            : properties

          if (relevantProperties.length > 0) {
            newValue = relevantProperties.reduce((sum, p) => sum + p.price, 0) / relevantProperties.length
          }
        }

        if (newValue !== kpi.currentValue) {
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from properties')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  static async syncUserEngagementKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    // Get user activity data
    const users = await prisma.user.findMany({
      where: {
        lastLoginAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        team: true
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'USER_ENGAGEMENT',
        dataSource: 'HBH2_USERS',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        if (kpi.unit === 'users') {
          // Count active users
          if (kpi.teamId) {
            newValue = users.filter(u => u.teamId === kpi.teamId).length
          } else {
            newValue = users.length
          }
        } else if (kpi.unit === 'percentage') {
          // Calculate engagement rate
          const totalUsers = await prisma.user.count({
            where: kpi.teamId ? { teamId: kpi.teamId } : {}
          })
          
          const activeUsers = kpi.teamId 
            ? users.filter(u => u.teamId === kpi.teamId).length
            : users.length

          newValue = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
        }

        if (Math.abs(newValue - kpi.currentValue) > 0.01) { // Allow for small floating point differences
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from user engagement')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  static async syncLearningKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    // Get learning progress data
    const completedCourses = await prisma.courseProgress.findMany({
      where: {
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          include: {
            team: true
          }
        }
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'LEARNING_DEVELOPMENT',
        dataSource: 'PORTAL_LEARNING',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        if (kpi.unit === 'courses') {
          // Count completed courses
          if (kpi.ownerId) {
            newValue = completedCourses.filter(c => c.userId === kpi.ownerId).length
          } else if (kpi.teamId) {
            newValue = completedCourses.filter(c => c.user.teamId === kpi.teamId).length
          } else {
            newValue = completedCourses.length
          }
        } else if (kpi.unit === 'percentage') {
          // Calculate completion rate
          const totalEnrollments = await prisma.courseProgress.count({
            where: {
              ...(kpi.ownerId && { userId: kpi.ownerId }),
              ...(kpi.teamId && { user: { teamId: kpi.teamId } })
            }
          })

          const completedCount = kpi.ownerId 
            ? completedCourses.filter(c => c.userId === kpi.ownerId).length
            : kpi.teamId 
            ? completedCourses.filter(c => c.user.teamId === kpi.teamId).length
            : completedCourses.length

          newValue = totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0
        }

        if (Math.abs(newValue - kpi.currentValue) > 0.01) {
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from learning progress')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  static async syncTeamKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    // Get team performance data
    const teams = await prisma.team.findMany({
      include: {
        members: true,
        kpis: true,
        goals: true
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'TEAM_PRODUCTIVITY',
        dataSource: 'PORTAL_TEAMS',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        if (kpi.unit === 'members') {
          // Count team members
          const team = teams.find(t => t.id === kpi.teamId)
          newValue = team ? team.members.length : 0
        } else if (kpi.unit === 'percentage') {
          // Calculate goal completion rate
          const team = teams.find(t => t.id === kpi.teamId)
          if (team) {
            const completedGoals = team.goals.filter(g => g.status === 'COMPLETED').length
            const totalGoals = team.goals.length
            newValue = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
          }
        }

        if (Math.abs(newValue - kpi.currentValue) > 0.01) {
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from team data')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  static async syncInvestmentKPIs(dateRange?: { start: string; end: string }, kpiIds?: string[]) {
    // Get investment data
    const investments = await prisma.investmentGroupMember.findMany({
      include: {
        user: {
          include: {
            team: true
          }
        },
        group: {
          include: {
            properties: true
          }
        }
      }
    })

    // Get relevant KPIs
    const kpis = await prisma.kPI.findMany({
      where: {
        category: 'FINANCIAL',
        dataSource: 'PORTAL_INVESTMENTS',
        isActive: true,
        ...(kpiIds && { id: { in: kpiIds } })
      }
    })

    let updated = 0
    let unchanged = 0
    let failed = 0

    for (const kpi of kpis) {
      try {
        let newValue = 0

        if (kpi.unit === 'dollars') {
          // Calculate total investment or returns
          if (kpi.ownerId) {
            const userInvestments = investments.filter(i => i.userId === kpi.ownerId)
            newValue = userInvestments.reduce((sum, i) => sum + i.contribution, 0)
          } else if (kpi.teamId) {
            const teamInvestments = investments.filter(i => i.user.teamId === kpi.teamId)
            newValue = teamInvestments.reduce((sum, i) => sum + i.contribution, 0)
          } else {
            newValue = investments.reduce((sum, i) => sum + i.contribution, 0)
          }
        } else if (kpi.unit === 'percentage') {
          // Calculate ROI
          if (kpi.ownerId) {
            const userInvestments = investments.filter(i => i.userId === kpi.ownerId)
            const totalInvested = userInvestments.reduce((sum, i) => sum + i.contribution, 0)
            const totalReturns = userInvestments.reduce((sum, i) => sum + i.totalReturns, 0)
            newValue = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
          }
        }

        if (Math.abs(newValue - kpi.currentValue) > 0.01) {
          await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from investment data')
          updated++
        } else {
          unchanged++
        }
      } catch (error) {
        console.error(`Failed to sync KPI ${kpi.id}:`, error)
        failed++
      }
    }

    return { updated, unchanged, failed }
  }

  private static async updateKPIValue(kpiId: string, newValue: number, notes?: string) {
    const kpi = await prisma.kPI.findUnique({
      where: { id: kpiId }
    })

    if (!kpi) throw new Error('KPI not found')

    const previousValue = kpi.currentValue
    const changePercent = previousValue > 0 ? ((newValue - previousValue) / previousValue) * 100 : 0

    // Update KPI
    await prisma.kPI.update({
      where: { id: kpiId },
      data: {
        currentValue: newValue,
        lastUpdated: new Date()
      }
    })

    // Create history record
    await prisma.kPIHistory.create({
      data: {
        kpiId,
        value: newValue,
        previousValue,
        changePercent,
        notes
      }
    })

    // Check alerts
    await this.checkKPIAlerts(kpiId, newValue)

    // Send real-time notification
    await RealtimeService.notifyKPIUpdated(kpiId, {
      id: kpiId,
      currentValue: newValue,
      targetValue: kpi.targetValue,
      unit: kpi.unit,
      name: kpi.name
    }, previousValue)
  }

  private static async checkKPIAlerts(kpiId: string, currentValue: number) {
    const alerts = await prisma.kPIAlert.findMany({
      where: {
        kpiId,
        isActive: true
      },
      include: {
        kpi: {
          include: {
            owner: true,
            team: true
          }
        }
      }
    })

    for (const alert of alerts) {
      let shouldTrigger = false

      switch (alert.condition) {
        case 'ABOVE_THRESHOLD':
          shouldTrigger = currentValue > alert.threshold
          break
        case 'BELOW_THRESHOLD':
          shouldTrigger = currentValue < alert.threshold
          break
        case 'TARGET_REACHED':
          shouldTrigger = currentValue >= alert.kpi.targetValue
          break
      }

      if (shouldTrigger) {
        // Update alert
        await prisma.kPIAlert.update({
          where: { id: alert.id },
          data: {
            lastTriggered: new Date(),
            triggerCount: alert.triggerCount + 1
          }
        })

        // Send notifications to recipients
        for (const recipientId of alert.recipients) {
          await prisma.portalNotification.create({
            data: {
              userId: recipientId,
              title: `KPI Alert: ${alert.name}`,
              message: alert.message,
              type: 'WARNING',
              category: 'KPI',
              relatedId: kpiId,
              relatedType: 'kpi',
              actionUrl: `/portal/kpis/${kpiId}`,
              actionText: 'View KPI'
            }
          })
        }
      }
    }
  }
}
