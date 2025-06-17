'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase-context'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon, BuildingOfficeIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export function PlatformSwitcher() {
  const { user } = useSupabase()
  const router = useRouter()
  const [switching, setSwitching] = useState(false)

  const switchToPlatform = async (platform: 'hbh2' | 'portal') => {
    setSwitching(true)
    try {
      const response = await fetch('/api/shared/auth/switch-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlatform: platform })
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push(data.redirectUrl)
      } else {
        console.error('Platform switch failed:', data.error)
        // Show error message to user
      }
    } catch (error) {
      console.error('Platform switch failed:', error)
      // Show error message to user
    } finally {
      setSwitching(false)
    }
  }

  // Don't show if user doesn't have portal access
  if (!user?.portalAccess) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            HBH-2 Platform
          </div>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem 
          onClick={() => switchToPlatform('hbh2')}
          disabled={switching}
          className="cursor-pointer"
        >
          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">HBH-2 Platform</div>
            <div className="text-xs text-gray-500">Properties & Auctions</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchToPlatform('portal')}
          disabled={switching}
          className="cursor-pointer"
        >
          <AcademicCapIcon className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">HBH Portal</div>
            <div className="text-xs text-gray-500">Learning & Teams</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
