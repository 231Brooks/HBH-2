import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPlatformPermissions } from '@/lib/user-roles'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ 
        user: null, 
        permissions: null,
        platformAccess: {
          hbh2: false,
          portal: false
        }
      })
    }

    // Get platform permissions
    const permissions = getPlatformPermissions(user.role as any)
    
    // Check platform access
    const platformAccess = {
      hbh2: true, // All users have HBH-2 access by default
      portal: user.portalAccess || false
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        hbh2Access: platformAccess.hbh2,
        portalAccess: platformAccess.portal,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        identityVerified: user.identityVerified,
      },
      permissions,
      platformAccess
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}
