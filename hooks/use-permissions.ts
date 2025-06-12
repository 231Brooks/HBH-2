import { useSupabase } from "@/contexts/supabase-context"
import { getUserPermissions, hasPermission, canAccessRoute, type UserRole, type UserPermissions } from "@/lib/user-roles"

export function usePermissions() {
  const { user } = useSupabase()
  
  const userRole = (user?.user_metadata?.role || 'USER') as UserRole
  const permissions = getUserPermissions(userRole)
  
  return {
    userRole,
    permissions,
    hasPermission: (permission: keyof UserPermissions) => hasPermission(userRole, permission),
    canAccessRoute: (route: string) => canAccessRoute(userRole, route),
    isUser: userRole === 'USER',
    isProfessional: userRole === 'PROFESSIONAL',
    isAdmin: userRole === 'ADMIN',
  }
}

export function useRoleGuard(requiredPermission: keyof UserPermissions) {
  const { hasPermission } = usePermissions()
  return hasPermission(requiredPermission)
}

export function useRouteGuard(route: string) {
  const { canAccessRoute } = usePermissions()
  return canAccessRoute(route)
}
