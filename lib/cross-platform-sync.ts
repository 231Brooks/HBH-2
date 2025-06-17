import prisma from './prisma'
import { RealtimeService } from './pusher-server'
import { LearningService } from './learning-service'
import { InvestmentService } from './investment-service'
import { KPISyncService } from './kpi-sync-service'

export class CrossPlatformSync {
  // Sync user data between platforms
  static async syncUserData(userId: string, changes: any) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          team: true,
          investmentMemberships: {
            include: {
              group: true
            }
          },
          learningProgress: {
            include: {
              course: true
            }
          }
        }
      })

      if (!user) throw new Error('User not found')

      // Update user permissions based on changes
      if (changes.portalAccess !== undefined) {
        await this.updatePortalAccess(userId, changes.portalAccess)
      }

      if (changes.teamId !== undefined) {
        await this.updateTeamAssignment(userId, changes.teamId)
      }

      if (changes.role !== undefined) {
        await this.updateUserRole(userId, changes.role)
      }

      // Notify real-time updates
      await RealtimeService.notifyPermissionUpdate(userId, {
        hbh2Access: user.hbh2Access,
        portalAccess: user.portalAccess,
        role: user.role,
        teamId: user.teamId
      })

      return { success: true, user }
    } catch (error) {
      console.error('Error syncing user data:', error)
      throw error
    }
  }

  // Sync transaction data from HBH-2 to Portal KPIs
  static async syncTransactionData(transactionId: string) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          creator: {
            include: {
              team: true
            }
          },
          property: true
        }
      })

      if (!transaction || transaction.status !== 'COMPLETED') {
        return { success: false, message: 'Transaction not completed' }
      }

      // Update user KPIs
      await this.updateUserSalesKPIs(transaction.creatorId, transaction.price)

      // Update team KPIs if user is part of a team
      if (transaction.creator.teamId) {
        await this.updateTeamSalesKPIs(transaction.creator.teamId, transaction.price)
      }

      // Check for investment group properties
      const investmentProperty = await prisma.investmentProperty.findUnique({
        where: { propertyId: transaction.propertyId },
        include: {
          group: {
            include: {
              members: true
            }
          }
        }
      })

      if (investmentProperty) {
        // Update investment property value
        await InvestmentService.updatePropertyValue(
          investmentProperty.id,
          transaction.price,
          'Property sold via HBH-2 transaction'
        )

        // Notify investment group members
        await RealtimeService.notifyPropertyLinked(
          investmentProperty.groupId,
          {
            propertyId: transaction.propertyId,
            transactionId: transaction.id,
            salePrice: transaction.price,
            roi: investmentProperty.roi
          }
        )
      }

      // Notify real-time updates
      await RealtimeService.notifyDataSync('transaction', {
        transactionId,
        userId: transaction.creatorId,
        teamId: transaction.creator.teamId,
        amount: transaction.price
      })

      return { success: true, transaction }
    } catch (error) {
      console.error('Error syncing transaction data:', error)
      throw error
    }
  }

  // Sync property data from HBH-2 to Portal
  static async syncPropertyData(propertyId: string, changes: any) {
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          creator: {
            include: {
              team: true
            }
          },
          investmentProperty: {
            include: {
              group: {
                include: {
                  members: true
                }
              }
            }
          }
        }
      })

      if (!property) throw new Error('Property not found')

      // Update property metrics KPIs
      await this.updatePropertyKPIs(property.creatorId, property.creator.teamId)

      // If this is an investment property, update investment data
      if (property.investmentProperty) {
        const investment = property.investmentProperty

        // Update property value if price changed
        if (changes.price && changes.price !== property.price) {
          await InvestmentService.updatePropertyValue(
            investment.id,
            changes.price,
            'Property value updated from HBH-2'
          )

          // Recalculate ROI
          const newROI = await InvestmentService.calculateROI(investment.id)

          // Notify investment group
          await RealtimeService.notifyInvestmentMade(investment.groupId, {
            type: 'property_value_update',
            propertyId,
            oldValue: property.price,
            newValue: changes.price,
            roi: newROI
          })
        }

        // Update property status
        if (changes.status) {
          await prisma.investmentProperty.update({
            where: { id: investment.id },
            data: {
              status: this.mapPropertyStatusToInvestmentStatus(changes.status)
            }
          })
        }
      }

      return { success: true, property }
    } catch (error) {
      console.error('Error syncing property data:', error)
      throw error
    }
  }

  // Sync learning progress to unlock HBH-2 features
  static async syncLearningProgress(userId: string, courseId: string, completed: boolean) {
    try {
      if (!completed) return { success: true, message: 'Course not completed' }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          unlocks: true
        }
      })

      if (!course || course.unlocks.length === 0) {
        return { success: true, message: 'No features to unlock' }
      }

      // Unlock features
      const unlockedFeatures = await LearningService.unlockFeatures(userId, course.unlocks)

      // Update user permissions in HBH-2
      for (const unlock of course.unlocks) {
        if (unlock.platform === 'HBH2' || unlock.platform === 'BOTH') {
          await this.updateHBH2FeatureAccess(userId, unlock.featureName, true)
        }
      }

      // Notify real-time updates
      await RealtimeService.notifyFeatureUnlock(userId, unlockedFeatures, 'course_completion')

      return { success: true, unlockedFeatures }
    } catch (error) {
      console.error('Error syncing learning progress:', error)
      throw error
    }
  }

  // Sync investment data to HBH-2 property ownership
  static async syncInvestmentToProperty(investmentPropertyId: string) {
    try {
      const investment = await prisma.investmentProperty.findUnique({
        where: { id: investmentPropertyId },
        include: {
          property: true,
          group: {
            include: {
              members: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      })

      if (!investment) throw new Error('Investment property not found')

      // Update property ownership information in HBH-2
      // This would integrate with the existing property system
      const ownershipData = {
        propertyId: investment.propertyId,
        investmentGroupId: investment.groupId,
        groupName: investment.group.name,
        totalInvestors: investment.group.members.length,
        totalInvestment: investment.group.currentAmount,
        purchasePrice: investment.purchasePrice,
        currentValue: investment.currentValue,
        roi: investment.roi
      }

      // Store ownership data (this would be a new table in the schema)
      // For now, we'll just log it
      console.log('Property ownership data:', ownershipData)

      return { success: true, ownershipData }
    } catch (error) {
      console.error('Error syncing investment to property:', error)
      throw error
    }
  }

  // Helper methods
  private static async updatePortalAccess(userId: string, hasAccess: boolean) {
    await prisma.user.update({
      where: { id: userId },
      data: { portalAccess: hasAccess }
    })

    if (hasAccess) {
      // Create welcome notification
      await prisma.portalNotification.create({
        data: {
          userId,
          title: 'Welcome to HBH Portal!',
          message: 'You now have access to the Portal platform. Explore learning, teams, and investments.',
          type: 'SUCCESS',
          category: 'SYSTEM',
          actionUrl: '/portal',
          actionText: 'Explore Portal'
        }
      })
    }
  }

  private static async updateTeamAssignment(userId: string, teamId: string | null) {
    await prisma.user.update({
      where: { id: userId },
      data: { teamId }
    })

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId }
      })

      if (team) {
        await prisma.portalNotification.create({
          data: {
            userId,
            title: 'Team Assignment',
            message: `You have been assigned to the team "${team.name}"`,
            type: 'INFO',
            category: 'TEAM',
            relatedId: teamId,
            relatedType: 'team',
            actionUrl: `/portal/teams/${teamId}`,
            actionText: 'View Team'
          }
        })
      }
    }
  }

  private static async updateUserRole(userId: string, newRole: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any }
    })

    await prisma.portalNotification.create({
      data: {
        userId,
        title: 'Role Updated',
        message: `Your role has been updated to ${newRole}`,
        type: 'INFO',
        category: 'SYSTEM'
      }
    })
  }

  private static async updateUserSalesKPIs(userId: string, amount: number) {
    const userKPIs = await prisma.kPI.findMany({
      where: {
        ownerId: userId,
        category: 'SALES_PERFORMANCE',
        isActive: true
      }
    })

    for (const kpi of userKPIs) {
      let newValue = kpi.currentValue

      if (kpi.unit === 'deals') {
        newValue += 1
      } else if (kpi.unit === 'dollars') {
        newValue += amount
      }

      await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from HBH-2 transaction')
    }
  }

  private static async updateTeamSalesKPIs(teamId: string, amount: number) {
    const teamKPIs = await prisma.kPI.findMany({
      where: {
        teamId,
        category: 'SALES_PERFORMANCE',
        isActive: true
      }
    })

    for (const kpi of teamKPIs) {
      let newValue = kpi.currentValue

      if (kpi.unit === 'deals') {
        newValue += 1
      } else if (kpi.unit === 'dollars') {
        newValue += amount
      }

      await this.updateKPIValue(kpi.id, newValue, 'Auto-sync from HBH-2 transaction')
    }
  }

  private static async updatePropertyKPIs(userId: string, teamId?: string | null) {
    // Update property listing KPIs
    const propertyCount = await prisma.property.count({
      where: { creatorId: userId }
    })

    const userKPIs = await prisma.kPI.findMany({
      where: {
        ownerId: userId,
        category: 'PROPERTY_METRICS',
        unit: 'listings',
        isActive: true
      }
    })

    for (const kpi of userKPIs) {
      await this.updateKPIValue(kpi.id, propertyCount, 'Auto-sync from property data')
    }

    // Update team KPIs if applicable
    if (teamId) {
      const teamPropertyCount = await prisma.property.count({
        where: {
          creator: {
            teamId
          }
        }
      })

      const teamKPIs = await prisma.kPI.findMany({
        where: {
          teamId,
          category: 'PROPERTY_METRICS',
          unit: 'listings',
          isActive: true
        }
      })

      for (const kpi of teamKPIs) {
        await this.updateKPIValue(kpi.id, teamPropertyCount, 'Auto-sync from property data')
      }
    }
  }

  private static async updateKPIValue(kpiId: string, newValue: number, notes?: string) {
    const kpi = await prisma.kPI.findUnique({
      where: { id: kpiId }
    })

    if (!kpi) return

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

    // Notify real-time updates
    await RealtimeService.notifyKPIUpdated(kpiId, {
      id: kpiId,
      currentValue: newValue,
      targetValue: kpi.targetValue,
      unit: kpi.unit
    }, previousValue)
  }

  private static async updateHBH2FeatureAccess(userId: string, featureName: string, hasAccess: boolean) {
    // This would integrate with the existing HBH-2 permission system
    // For now, we'll just log the feature unlock
    console.log(`Feature ${featureName} ${hasAccess ? 'unlocked' : 'locked'} for user ${userId}`)
    
    // In a real implementation, this would update the user's permissions
    // in the HBH-2 system to enable/disable specific features
  }

  private static mapPropertyStatusToInvestmentStatus(propertyStatus: string): any {
    const statusMap: Record<string, any> = {
      'SOLD': 'SOLD',
      'UNDER_CONTRACT': 'UNDER_CONTRACT',
      'FORECLOSURE': 'FORECLOSURE',
      'ACTIVE': 'ACTIVE'
    }

    return statusMap[propertyStatus] || 'ACTIVE'
  }
}
