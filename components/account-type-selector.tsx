"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, User, Briefcase, Shield } from "lucide-react"
import { type UserRole, ROLE_DESCRIPTIONS } from "@/lib/user-roles"
import { cn } from "@/lib/utils"

interface AccountTypeSelectorProps {
  selectedRole?: UserRole
  onRoleSelect: (role: UserRole) => void
  disabled?: boolean
  className?: string
}

export function AccountTypeSelector({ 
  selectedRole, 
  onRoleSelect, 
  disabled = false,
  className 
}: AccountTypeSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null)

  const roleIcons = {
    USER: User,
    PROFESSIONAL: Briefcase,
    ADMIN: Shield,
  }

  const roleColors = {
    USER: "bg-blue-50 border-blue-200 hover:border-blue-300",
    PROFESSIONAL: "bg-green-50 border-green-200 hover:border-green-300",
    ADMIN: "bg-purple-50 border-purple-200 hover:border-purple-300",
  }

  const selectedColors = {
    USER: "bg-blue-100 border-blue-400",
    PROFESSIONAL: "bg-green-100 border-green-400",
    ADMIN: "bg-purple-100 border-purple-400",
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Your Account Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the account type that best describes how you'll use the platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(ROLE_DESCRIPTIONS) as UserRole[]).map((role) => {
          const Icon = roleIcons[role]
          const description = ROLE_DESCRIPTIONS[role]
          const isSelected = selectedRole === role
          const isHovered = hoveredRole === role

          return (
            <Card
              key={role}
              className={cn(
                "cursor-pointer transition-all duration-200 relative",
                isSelected 
                  ? selectedColors[role]
                  : roleColors[role],
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onRoleSelect(role)}
              onMouseEnter={() => setHoveredRole(role)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 p-3 rounded-full bg-white/50">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{description.title}</CardTitle>
                <CardDescription className="text-sm">
                  {description.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {description.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="text-xs flex items-start gap-1">
                        <Check className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {description.features.length > 4 && (
                      <li className="text-xs text-muted-foreground">
                        +{description.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedRole && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{ROLE_DESCRIPTIONS[selectedRole].title}</Badge>
            <span className="text-sm text-muted-foreground">Selected</span>
          </div>
          <p className="text-sm">
            {ROLE_DESCRIPTIONS[selectedRole].description}
          </p>
        </div>
      )}
    </div>
  )
}

interface QuickAccountTypeSelectorProps {
  selectedRole?: UserRole
  onRoleSelect: (role: UserRole) => void
  disabled?: boolean
}

export function QuickAccountTypeSelector({ 
  selectedRole, 
  onRoleSelect, 
  disabled = false 
}: QuickAccountTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {(Object.keys(ROLE_DESCRIPTIONS) as UserRole[]).map((role) => {
        const description = ROLE_DESCRIPTIONS[role]
        const isSelected = selectedRole === role

        return (
          <Button
            key={role}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => !disabled && onRoleSelect(role)}
            disabled={disabled}
            className="flex-1"
          >
            {description.title}
          </Button>
        )
      })}
    </div>
  )
}
