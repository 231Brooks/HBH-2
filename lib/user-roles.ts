export type UserRole = 'USER' | 'PROFESSIONAL' | 'ADMIN'

export interface UserPermissions {
  // Property permissions
  canCreateProperty: boolean
  canEditOwnProperty: boolean
  canEditAnyProperty: boolean
  canDeleteOwnProperty: boolean
  canDeleteAnyProperty: boolean
  canViewAllProperties: boolean
  
  // Transaction permissions
  canCreateTransaction: boolean
  canViewOwnTransactions: boolean
  canViewAllTransactions: boolean
  canManageTransactions: boolean
  
  // Service permissions
  canCreateService: boolean
  canEditOwnService: boolean
  canEditAnyService: boolean
  canDeleteOwnService: boolean
  canDeleteAnyService: boolean
  canViewAllServices: boolean
  
  // User management permissions
  canViewAllUsers: boolean
  canEditOwnProfile: boolean
  canEditAnyProfile: boolean
  canDeleteUsers: boolean
  canVerifyUsers: boolean
  
  // Admin permissions
  canAccessAdmin: boolean
  canManageSystem: boolean
  canViewAnalytics: boolean
  canManagePayments: boolean
  
  // Communication permissions
  canSendMessages: boolean
  canViewAllMessages: boolean
  canCreateAppointments: boolean
  canManageAppointments: boolean
  
  // Marketplace permissions
  canPostJobs: boolean
  canApplyToJobs: boolean
  canManageJobs: boolean

  // Subscription permissions
  canCreateServiceListings: boolean
  canViewServiceRequests: boolean
  canRespondToServiceRequests: boolean
  canAccessProfessionalDashboard: boolean
}

export const USER_PERMISSIONS: Record<UserRole, UserPermissions> = {
  USER: {
    // Property permissions
    canCreateProperty: true,
    canEditOwnProperty: true,
    canEditAnyProperty: false,
    canDeleteOwnProperty: true,
    canDeleteAnyProperty: false,
    canViewAllProperties: true,
    
    // Transaction permissions
    canCreateTransaction: true,
    canViewOwnTransactions: true,
    canViewAllTransactions: false,
    canManageTransactions: false,
    
    // Service permissions
    canCreateService: false,
    canEditOwnService: false,
    canEditAnyService: false,
    canDeleteOwnService: false,
    canDeleteAnyService: false,
    canViewAllServices: true,
    
    // User management permissions
    canViewAllUsers: false,
    canEditOwnProfile: true,
    canEditAnyProfile: false,
    canDeleteUsers: false,
    canVerifyUsers: false,
    
    // Admin permissions
    canAccessAdmin: false,
    canManageSystem: false,
    canViewAnalytics: false,
    canManagePayments: false,
    
    // Communication permissions
    canSendMessages: true,
    canViewAllMessages: false,
    canCreateAppointments: true,
    canManageAppointments: false,
    
    // Marketplace permissions
    canPostJobs: true,
    canApplyToJobs: false,
    canManageJobs: false,

    // Subscription permissions
    canCreateServiceListings: false,
    canViewServiceRequests: false,
    canRespondToServiceRequests: false,
    canAccessProfessionalDashboard: false,
  },
  
  PROFESSIONAL: {
    // Property permissions
    canCreateProperty: true,
    canEditOwnProperty: true,
    canEditAnyProperty: false,
    canDeleteOwnProperty: true,
    canDeleteAnyProperty: false,
    canViewAllProperties: true,
    
    // Transaction permissions
    canCreateTransaction: true,
    canViewOwnTransactions: true,
    canViewAllTransactions: false,
    canManageTransactions: false,
    
    // Service permissions
    canCreateService: true,
    canEditOwnService: true,
    canEditAnyService: false,
    canDeleteOwnService: true,
    canDeleteAnyService: false,
    canViewAllServices: true,
    
    // User management permissions
    canViewAllUsers: false,
    canEditOwnProfile: true,
    canEditAnyProfile: false,
    canDeleteUsers: false,
    canVerifyUsers: false,
    
    // Admin permissions
    canAccessAdmin: false,
    canManageSystem: false,
    canViewAnalytics: false,
    canManagePayments: false,
    
    // Communication permissions
    canSendMessages: true,
    canViewAllMessages: false,
    canCreateAppointments: true,
    canManageAppointments: true,
    
    // Marketplace permissions
    canPostJobs: false,
    canApplyToJobs: true,
    canManageJobs: false,

    // Subscription permissions
    canCreateServiceListings: true,
    canViewServiceRequests: true,
    canRespondToServiceRequests: true,
    canAccessProfessionalDashboard: true,
  },
  
  ADMIN: {
    // Property permissions
    canCreateProperty: true,
    canEditOwnProperty: true,
    canEditAnyProperty: true,
    canDeleteOwnProperty: true,
    canDeleteAnyProperty: true,
    canViewAllProperties: true,
    
    // Transaction permissions
    canCreateTransaction: true,
    canViewOwnTransactions: true,
    canViewAllTransactions: true,
    canManageTransactions: true,
    
    // Service permissions
    canCreateService: true,
    canEditOwnService: true,
    canEditAnyService: true,
    canDeleteOwnService: true,
    canDeleteAnyService: true,
    canViewAllServices: true,
    
    // User management permissions
    canViewAllUsers: true,
    canEditOwnProfile: true,
    canEditAnyProfile: true,
    canDeleteUsers: true,
    canVerifyUsers: true,
    
    // Admin permissions
    canAccessAdmin: true,
    canManageSystem: true,
    canViewAnalytics: true,
    canManagePayments: true,
    
    // Communication permissions
    canSendMessages: true,
    canViewAllMessages: true,
    canCreateAppointments: true,
    canManageAppointments: true,
    
    // Marketplace permissions
    canPostJobs: true,
    canApplyToJobs: true,
    canManageJobs: true,

    // Subscription permissions
    canCreateServiceListings: true,
    canViewServiceRequests: true,
    canRespondToServiceRequests: true,
    canAccessProfessionalDashboard: true,
  },
}

export function getUserPermissions(role: UserRole): UserPermissions {
  return USER_PERMISSIONS[role]
}

export function hasPermission(userRole: UserRole, permission: keyof UserPermissions): boolean {
  return USER_PERMISSIONS[userRole][permission]
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const permissions = getUserPermissions(userRole)
  
  // Define route access rules
  const routePermissions: Record<string, keyof UserPermissions> = {
    '/admin': 'canAccessAdmin',
    '/admin/*': 'canAccessAdmin',
    '/services/create': 'canCreateService',
    '/services/manage': 'canEditOwnService',
    '/job-marketplace/post-job': 'canPostJobs',
    '/job-marketplace/professional-profile': 'canApplyToJobs',
  }
  
  // Check exact route match first
  if (routePermissions[route]) {
    return permissions[routePermissions[route]]
  }
  
  // Check wildcard routes
  for (const [routePattern, permission] of Object.entries(routePermissions)) {
    if (routePattern.endsWith('/*') && route.startsWith(routePattern.slice(0, -2))) {
      return permissions[permission]
    }
  }
  
  // Default: allow access to most routes
  return true
}

export const ROLE_DESCRIPTIONS = {
  USER: {
    title: 'Regular User',
    description: 'Buy and sell properties, hire professionals, manage transactions',
    features: [
      'Create and manage property listings',
      'Search and save properties',
      'Hire service professionals',
      'Track transaction progress',
      'Schedule appointments',
      'Send and receive messages',
      'Post job listings'
    ]
  },
  PROFESSIONAL: {
    title: 'Service Professional',
    description: 'Provide services, manage clients, grow your business',
    features: [
      'Create and manage service listings',
      'Apply to job opportunities',
      'Manage client appointments',
      'Track project progress',
      'Build professional profile',
      'Receive client reviews',
      'Access professional tools'
    ]
  },
  ADMIN: {
    title: 'Administrator',
    description: 'Full system access and management capabilities',
    features: [
      'Manage all users and content',
      'Access system analytics',
      'Configure platform settings',
      'Monitor transactions',
      'Verify user accounts',
      'Manage payments and fees',
      'System diagnostics and optimization'
    ]
  }
} as const
