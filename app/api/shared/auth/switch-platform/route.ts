import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalAccess } from '@/lib/user-roles'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { targetPlatform } = await request.json()

    if (!targetPlatform || !['hbh2', 'portal'].includes(targetPlatform)) {
      return NextResponse.json(
        { error: 'Invalid target platform' },
        { status: 400 }
      )
    }

    // Check access permissions
    if (targetPlatform === 'portal') {
      const hasAccess = hasPortalAccess(user.role as any, user.portalAccess || false)
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Portal access denied' },
          { status: 403 }
        )
      }
    }

    // Determine redirect URL
    const redirectUrl = targetPlatform === 'portal' ? '/portal' : '/'

    return NextResponse.json({
      success: true,
      redirectUrl,
      platform: targetPlatform
    })
  } catch (error) {
    console.error('Platform switch error:', error)
    return NextResponse.json(
      { error: 'Failed to switch platform' },
      { status: 500 }
    )
  }
}
