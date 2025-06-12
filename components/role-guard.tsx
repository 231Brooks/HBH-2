"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { type UserPermissions, type UserRole } from "@/lib/user-roles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  requiredPermission?: keyof UserPermissions
  requiredRole?: UserRole
  fallback?: React.ReactNode
  showError?: boolean
}

export function RoleGuard({ 
  children, 
  requiredPermission, 
  requiredRole, 
  fallback,
  showError = true 
}: RoleGuardProps) {
  const { userRole, hasPermission } = usePermissions()
  
  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    if (fallback) return <>{fallback}</>
    if (!showError) return null
    
    return (
      <Alert className="border-destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You need {requiredRole} role to access this content.
        </AlertDescription>
      </Alert>
    )
  }
  
  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>
    if (!showError) return null
    
    return (
      <Alert className="border-destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content.
        </AlertDescription>
      </Alert>
    )
  }
  
  return <>{children}</>
}

interface ConditionalRenderProps {
  children: React.ReactNode
  condition: boolean
  fallback?: React.ReactNode
}

export function ConditionalRender({ children, condition, fallback }: ConditionalRenderProps) {
  if (condition) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}

// Specific role guards for common use cases
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RoleGuard requiredRole="ADMIN" fallback={fallback}>{children}</RoleGuard>
}

export function ProfessionalOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RoleGuard requiredRole="PROFESSIONAL" fallback={fallback}>{children}</RoleGuard>
}

export function UserOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RoleGuard requiredRole="USER" fallback={fallback}>{children}</RoleGuard>
}
