"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPresenceIndicator } from "./user-presence-indicator"

type UserAvatarWithPresenceProps = {
  userId: string
  userName: string
  userAvatar?: string
  size?: "sm" | "md" | "lg"
  showPresence?: boolean
}

export function UserAvatarWithPresence({
  userId,
  userName,
  userAvatar,
  size = "md",
  showPresence = true,
}: UserAvatarWithPresenceProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const indicatorSizes = {
    sm: "sm",
    md: "sm",
    lg: "md",
  } as const

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={userAvatar || "/placeholder.svg"} />
        <AvatarFallback>{userName[0]}</AvatarFallback>
      </Avatar>
      {showPresence && (
        <div className="absolute bottom-0 right-0 rounded-full border-2 border-background">
          <UserPresenceIndicator userId={userId} size={indicatorSizes[size]} />
        </div>
      )}
    </div>
  )
}
