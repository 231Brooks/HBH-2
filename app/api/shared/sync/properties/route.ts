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

    if (!hasPortalPermission(user.role as any, 'canManageKPIs')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { propertyIds, includeInvestmentGroups } = await request.json()

    let syncResults = {
      syncedProperties: 0,
      updatedInvestments: 0,
      errors: [] as string[]
    }

    if (propertyIds && propertyIds.length > 0) {
      // Sync specific properties
      for (const propertyId of propertyIds) {
        try {
          const property = await prisma.property.findUnique({
            where: { id: propertyId }
          })

          if (property) {
            const result = await CrossPlatformSync.syncPropertyData(propertyId, {
              price: property.price,
              status: property.status
            })

            if (result.success) {
              syncResults.syncedProperties++
              
              if (result.property?.investmentProperty) {
                syncResults.updatedInvestments++
              }
            }
          }
        } catch (error) {
          syncResults.errors.push(`Failed to sync property ${propertyId}: ${error.message}`)
        }
      }
    } else {
      // Sync all properties with recent updates
      const recentProperties = await prisma.property.findMany({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        include: {
          investmentProperty: includeInvestmentGroups
        }
      })

      for (const property of recentProperties) {
        try {
          const result = await CrossPlatformSync.syncPropertyData(property.id, {
            price: property.price,
            status: property.status
          })

          if (result.success) {
            syncResults.syncedProperties++
            
            if (property.investmentProperty) {
              syncResults.updatedInvestments++
            }
          }
        } catch (error) {
          syncResults.errors.push(`Failed to sync property ${property.id}: ${error.message}`)
        }
      }
    }

    // Sync investment properties to HBH-2 if requested
    if (includeInvestmentGroups) {
      const investmentProperties = await prisma.investmentProperty.findMany({
        where: {
          ...(propertyIds && { propertyId: { in: propertyIds } })
        }
      })

      for (const investment of investmentProperties) {
        try {
          await CrossPlatformSync.syncInvestmentToProperty(investment.id)
        } catch (error) {
          syncResults.errors.push(`Failed to sync investment property ${investment.id}: ${error.message}`)
        }
      }
    }

    // Create notification
    await prisma.portalNotification.create({
      data: {
        userId: user.id,
        title: 'Property Sync Complete',
        message: `Synced ${syncResults.syncedProperties} properties and ${syncResults.updatedInvestments} investments`,
        type: syncResults.errors.length > 0 ? 'WARNING' : 'SUCCESS',
        category: 'SYSTEM',
        relatedType: 'sync'
      }
    })

    return NextResponse.json(syncResults)
  } catch (error) {
    console.error('Error in property sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync properties' },
      { status: 500 }
    )
  }
}
