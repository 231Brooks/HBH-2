"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetPresence } from "@/lib/presence"

type UserPresenceIndicatorProps = {
  userId: string
  className?: string
  showTooltip?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserPresenceIndicator({
  userId,
  className,
  showTooltip = true,
  size = "md",
}: UserPresenceIndicatorProps) {
  const { isUserOnline, loading } = useGetPresence()

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  const indicator = (
    <span
      className={cn(
        "rounded-full",
        sizeClasses[size],
        loading ? "bg-gray-300" : isUserOnline(userId) ? "bg-green-500" : "bg-gray-400",
        className,
      )}
    />
  )

  if (!showTooltip) {
    return indicator
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{indicator}</TooltipTrigger>
        <TooltipContent>
          <p>{loading ? "Loading status..." : isUserOnline(userId) ? "Online" : "Offline"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
