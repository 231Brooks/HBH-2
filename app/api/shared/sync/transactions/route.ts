import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'
import { CrossPlatformSync } from '@/lib/cross-platform-sync'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Only admins can trigger manual sync
    if (!hasPortalPermission(user.role as any, 'canManageKPIs')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { dateRange, userIds, teamIds, transactionId } = await request.json()

    let syncResults = {
      syncedTransactions: 0,
      updatedKPIs: [] as string[],
      errors: [] as string[]
    }

    if (transactionId) {
      // Sync specific transaction
      try {
        const result = await CrossPlatformSync.syncTransactionData(transactionId)
        if (result.success) {
          syncResults.syncedTransactions = 1
        }
      } catch (error) {
        syncResults.errors.push(`Failed to sync transaction ${transactionId}: ${error.message}`)
      }
    } else {
      // Sync multiple transactions based on criteria
      const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

      const transactions = await prisma.transaction.findMany({
        where: {
          status: 'COMPLETED',
          updatedAt: {
            gte: startDate,
            lte: endDate
          },
          ...(userIds && { creatorId: { in: userIds } }),
          ...(teamIds && { 
            creator: {
              teamId: { in: teamIds }
            }
          })
        },
        include: {
          creator: {
            include: {
              team: true
            }
          }
        }
      })

      for (const transaction of transactions) {
        try {
          const result = await CrossPlatformSync.syncTransactionData(transaction.id)
          if (result.success) {
            syncResults.syncedTransactions++
          }
        } catch (error) {
          syncResults.errors.push(`Failed to sync transaction ${transaction.id}: ${error.message}`)
        }
      }
    }

    // Create notification for sync completion
    await prisma.portalNotification.create({
      data: {
        userId: user.id,
        title: 'Transaction Sync Complete',
        message: `Synced ${syncResults.syncedTransactions} transactions with ${syncResults.errors.length} errors`,
        type: syncResults.errors.length > 0 ? 'WARNING' : 'SUCCESS',
        category: 'SYSTEM',
        relatedType: 'sync'
      }
    })

    return NextResponse.json(syncResults)
  } catch (error) {
    console.error('Error in transaction sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync transactions' },
      { status: 500 }
    )
  }
}
