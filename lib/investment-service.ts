import prisma from './prisma'

export class InvestmentService {
  static async linkPropertyToGroup(
    propertyId: string, 
    groupId: string, 
    purchasePrice: number
  ) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    const group = await prisma.investmentGroup.findUnique({
      where: { id: groupId },
      include: { members: true }
    })
    
    if (!property || !group) {
      throw new Error('Property or group not found')
    }
    
    // Create investment property record
    const investmentProperty = await prisma.investmentProperty.create({
      data: {
        propertyId,
        groupId,
        purchasePrice,
        purchaseDate: new Date(),
        currentValue: purchasePrice,
        status: 'ACTIVE'
      }
    })
    
    // Notify group members
    await this.notifyGroupMembers(group, 'property_linked', {
      propertyId,
      purchasePrice,
      propertyTitle: property.title
    })
    
    return investmentProperty
  }
  
  static async calculateROI(investmentPropertyId: string) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId },
      include: { property: true }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const currentValue = investment.currentValue || investment.property.price
    const purchasePrice = investment.purchasePrice
    const totalIncome = investment.totalIncome
    const totalExpenses = investment.expenses
    
    // Calculate ROI including income and expenses
    const netGain = (currentValue - purchasePrice) + totalIncome - totalExpenses
    const roi = (netGain / purchasePrice) * 100
    
    await prisma.investmentProperty.update({
      where: { id: investmentPropertyId },
      data: { roi }
    })
    
    return roi
  }
  
  static async distributeReturns(
    investmentPropertyId: string, 
    totalAmount: number,
    distributionType: 'PROFIT' | 'DIVIDEND' | 'CAPITAL_RETURN' = 'PROFIT'
  ) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId },
      include: {
        group: {
          include: {
            members: true
          }
        }
      }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const totalContributions = investment.group.members.reduce(
      (sum, member) => sum + member.contribution, 0
    )
    
    if (totalContributions === 0) {
      throw new Error('No contributions to distribute against')
    }
    
    // Calculate and create distributions for each member
    const distributions = []
    
    for (const member of investment.group.members) {
      const memberShare = (member.contribution / totalContributions) * totalAmount
      
      const distribution = await prisma.investmentDistribution.create({
        data: {
          propertyId: investmentPropertyId,
          memberId: member.id,
          amount: memberShare,
          type: distributionType,
          description: `${distributionType.toLowerCase()} distribution`
        }
      })
      
      // Update member's total returns
      await prisma.investmentGroupMember.update({
        where: { id: member.id },
        data: {
          totalReturns: member.totalReturns + memberShare
        }
      })
      
      distributions.push(distribution)
      
      // Create notification
      await prisma.portalNotification.create({
        data: {
          userId: member.userId,
          title: 'Investment Distribution',
          message: `You received $${memberShare.toFixed(2)} from ${investment.group.name}`,
          type: 'SUCCESS',
          category: 'INVESTMENT',
          relatedId: investment.groupId,
          relatedType: 'investment_group',
          actionUrl: `/portal/investments/groups/${investment.groupId}`,
          actionText: 'View Details'
        }
      })
    }
    
    return distributions
  }
  
  static async processPayment(
    userId: string,
    amount: number,
    paymentMethodId: string,
    description: string
  ) {
    // Mock payment processing - in real implementation, integrate with Stripe
    const transaction = {
      id: `txn_${Math.random().toString(36).substring(2, 15)}`,
      userId,
      amount,
      paymentMethodId,
      description,
      status: 'completed',
      processedAt: new Date(),
      fees: amount * 0.029, // 2.9% processing fee
      netAmount: amount * 0.971
    }
    
    // In real implementation, you would:
    // 1. Create Stripe payment intent
    // 2. Process the payment
    // 3. Handle webhooks
    // 4. Store transaction in database
    
    console.log('Processing payment:', transaction)
    
    return transaction
  }
  
  static async updatePropertyValue(
    investmentPropertyId: string,
    newValue: number,
    notes?: string
  ) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const updatedInvestment = await prisma.investmentProperty.update({
      where: { id: investmentPropertyId },
      data: {
        currentValue: newValue,
        lastValuation: new Date()
      }
    })
    
    // Recalculate ROI
    await this.calculateROI(investmentPropertyId)
    
    return updatedInvestment
  }
  
  static async addPropertyIncome(
    investmentPropertyId: string,
    amount: number,
    description: string
  ) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const updatedInvestment = await prisma.investmentProperty.update({
      where: { id: investmentPropertyId },
      data: {
        totalIncome: investment.totalIncome + amount,
        monthlyIncome: amount // Assuming this is monthly income
      }
    })
    
    // Distribute income to members
    await this.distributeReturns(investmentPropertyId, amount, 'DIVIDEND')
    
    return updatedInvestment
  }
  
  static async addPropertyExpense(
    investmentPropertyId: string,
    amount: number,
    description: string
  ) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const updatedInvestment = await prisma.investmentProperty.update({
      where: { id: investmentPropertyId },
      data: {
        expenses: investment.expenses + amount
      }
    })
    
    // Recalculate ROI
    await this.calculateROI(investmentPropertyId)
    
    return updatedInvestment
  }
  
  private static async notifyGroupMembers(
    group: any,
    eventType: string,
    data: any
  ) {
    const notifications = []
    
    for (const member of group.members) {
      let title = ''
      let message = ''
      
      switch (eventType) {
        case 'property_linked':
          title = 'Property Added to Group'
          message = `"${data.propertyTitle}" has been added to ${group.name} for $${data.purchasePrice.toLocaleString()}`
          break
        case 'member_joined':
          title = 'New Group Member'
          message = `${data.memberName} joined ${group.name}`
          break
        case 'distribution':
          title = 'Distribution Received'
          message = `You received $${data.amount} from ${group.name}`
          break
        default:
          continue
      }
      
      const notification = await prisma.portalNotification.create({
        data: {
          userId: member.userId,
          title,
          message,
          type: 'INFO',
          category: 'INVESTMENT',
          relatedId: group.id,
          relatedType: 'investment_group',
          actionUrl: `/portal/investments/groups/${group.id}`,
          actionText: 'View Group'
        }
      })
      
      notifications.push(notification)
    }
    
    return notifications
  }
}
