import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { InvestmentService } from '@/lib/investment-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { groupId } = params
    const { amount, paymentMethodId } = await request.json()

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid investment amount' },
        { status: 400 }
      )
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method required' },
        { status: 400 }
      )
    }

    // Get investment group
    const group = await prisma.investmentGroup.findUnique({
      where: { id: groupId },
      include: {
        members: true
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Investment group not found' }, { status: 404 })
    }

    if (group.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Investment group is not active' },
        { status: 400 }
      )
    }

    // Check minimum investment
    if (amount < group.minimumInvestment) {
      return NextResponse.json(
        { error: `Minimum investment is $${group.minimumInvestment}` },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingMember = group.members.find(member => member.userId === user.id)

    if (existingMember) {
      // Update existing investment
      const updatedMember = await prisma.investmentGroupMember.update({
        where: { id: existingMember.id },
        data: {
          contribution: existingMember.contribution + amount
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            }
          }
        }
      })

      // Update group total
      await prisma.investmentGroup.update({
        where: { id: groupId },
        data: {
          currentAmount: group.currentAmount + amount
        }
      })

      // Process payment (mock implementation)
      const transaction = await InvestmentService.processPayment(
        user.id,
        amount,
        paymentMethodId,
        `Investment in ${group.name}`
      )

      // Create notification
      await prisma.portalNotification.create({
        data: {
          userId: user.id,
          title: 'Investment Added',
          message: `Successfully invested $${amount} in "${group.name}"`,
          type: 'SUCCESS',
          category: 'INVESTMENT',
          relatedId: groupId,
          relatedType: 'investment_group',
          actionUrl: `/portal/investments/groups/${groupId}`,
          actionText: 'View Investment'
        }
      })

      return NextResponse.json({
        membership: updatedMember,
        transaction,
        newGroupTotal: group.currentAmount + amount
      })
    } else {
      // Create new membership
      const membership = await prisma.investmentGroupMember.create({
        data: {
          groupId,
          userId: user.id,
          contribution: amount,
          role: 'MEMBER'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            }
          }
        }
      })

      // Update group total
      await prisma.investmentGroup.update({
        where: { id: groupId },
        data: {
          currentAmount: group.currentAmount + amount
        }
      })

      // Process payment (mock implementation)
      const transaction = await InvestmentService.processPayment(
        user.id,
        amount,
        paymentMethodId,
        `Investment in ${group.name}`
      )

      // Create notifications
      await prisma.portalNotification.create({
        data: {
          userId: user.id,
          title: 'Investment Group Joined',
          message: `Successfully joined "${group.name}" with $${amount} investment`,
          type: 'SUCCESS',
          category: 'INVESTMENT',
          relatedId: groupId,
          relatedType: 'investment_group',
          actionUrl: `/portal/investments/groups/${groupId}`,
          actionText: 'View Investment'
        }
      })

      // Notify group manager
      if (group.managerId && group.managerId !== user.id) {
        await prisma.portalNotification.create({
          data: {
            userId: group.managerId,
            title: 'New Group Member',
            message: `${user.name} joined "${group.name}" with $${amount} investment`,
            type: 'INFO',
            category: 'INVESTMENT',
            relatedId: groupId,
            relatedType: 'investment_group',
            actionUrl: `/portal/investments/groups/${groupId}`,
            actionText: 'View Group'
          }
        })
      }

      return NextResponse.json({
        membership,
        transaction,
        newGroupTotal: group.currentAmount + amount
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error processing investment:', error)
    return NextResponse.json(
      { error: 'Failed to process investment' },
      { status: 500 }
    )
  }
}
