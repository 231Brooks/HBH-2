export type UserRole = 'USER' | 'PROFESSIONAL' | 'ADMIN'
export type PortalRole = 'EMPLOYEE' | 'TEAM_LEAD' | 'MANAGER' | 'EXECUTIVE' | 'INVESTOR' | 'TRAINER' | 'TITLE_COMPANY'

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

  // Title Company permissions
  canAccessTitleCompany: boolean
  canManageClosings: boolean
  canViewAllTransactions: boolean
}

// Portal-specific permissions
export interface PortalPermissions {
  // Learning Center
  canAccessLearningCenter: boolean
  canCreateCourses: boolean
  canManageCourses: boolean
  canInstructCourses: boolean
  canViewAllProgress: boolean

  // Team Management
  canViewTeams: boolean
  canManageTeam: boolean
  canCreateTeams: boolean
  canManageAllTeams: boolean

  // Investment Groups
  canViewInvestments: boolean
  canCreateInvestmentGroups: boolean
  canManageInvestments: boolean
  canViewAllInvestments: boolean

  // KPI & Analytics
  canViewKPIs: boolean
  canCreateKPIs: boolean
  canManageKPIs: boolean
  canViewCompanyKPIs: boolean
  canViewReports: boolean

  // Employee Management
  canViewEmployees: boolean
  canManageEmployees: boolean
  canViewPayroll: boolean
  canManageRoles: boolean
}

// Combined platform permissions
export interface PlatformPermissions {
  hbh2: UserPermissions
  portal: PortalPermissions
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

    // Title Company permissions
    canAccessTitleCompany: false,
    canManageClosings: false,
    canViewAllTransactions: false,
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

    // Title Company permissions
    canAccessTitleCompany: false,
    canManageClosings: false,
    canViewAllTransactions: false,
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

    // Title Company permissions
    canAccessTitleCompany: true,
    canManageClosings: true,
    canViewAllTransactions: true,
  },

  TITLE_COMPANY: {
    // Property permissions
    canCreateProperty: false,
    canEditOwnProperty: false,
    canEditAnyProperty: false,
    canDeleteOwnProperty: false,
    canDeleteAnyProperty: false,
    canViewAllProperties: true,

    // Transaction permissions
    canCreateTransaction: false,
    canViewOwnTransactions: true,
    canViewAllTransactions: true,
    canManageTransactions: true,

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
    canManageAppointments: true,

    // Marketplace permissions
    canPostJobs: false,
    canApplyToJobs: false,
    canManageJobs: false,

    // Subscription permissions
    canCreateServiceListings: false,
    canViewServiceRequests: false,
    canRespondToServiceRequests: false,
    canAccessProfessionalDashboard: false,

    // Title Company permissions
    canAccessTitleCompany: true,
    canManageClosings: true,
    canViewAllTransactions: true,
  },
}

// Portal permissions by role
export const PORTAL_PERMISSIONS: Record<UserRole, PortalPermissions> = {
  USER: {
    // Learning Center
    canAccessLearningCenter: true,
    canCreateCourses: false,
    canManageCourses: false,
    canInstructCourses: false,
    canViewAllProgress: false,

    // Team Management
    canViewTeams: false,
    canManageTeam: false,
    canCreateTeams: false,
    canManageAllTeams: false,

    // Investment Groups
    canViewInvestments: true,
    canCreateInvestmentGroups: false,
    canManageInvestments: false,
    canViewAllInvestments: false,

    // KPI & Analytics
    canViewKPIs: false,
    canCreateKPIs: false,
    canManageKPIs: false,
    canViewCompanyKPIs: false,
    canViewReports: false,

    // Employee Management
    canViewEmployees: false,
    canManageEmployees: false,
    canViewPayroll: false,
    canManageRoles: false,
  },

  PROFESSIONAL: {
    // Learning Center
    canAccessLearningCenter: true,
    canCreateCourses: true,
    canManageCourses: true,
    canInstructCourses: true,
    canViewAllProgress: false,

    // Team Management
    canViewTeams: true,
    canManageTeam: false,
    canCreateTeams: false,
    canManageAllTeams: false,

    // Investment Groups
    canViewInvestments: true,
    canCreateInvestmentGroups: true,
    canManageInvestments: true,
    canViewAllInvestments: false,

    // KPI & Analytics
    canViewKPIs: true,
    canCreateKPIs: true,
    canManageKPIs: true,
    canViewCompanyKPIs: false,
    canViewReports: true,

    // Employee Management
    canViewEmployees: false,
    canManageEmployees: false,
    canViewPayroll: false,
    canManageRoles: false,
  },

  ADMIN: {
    // Learning Center
    canAccessLearningCenter: true,
    canCreateCourses: true,
    canManageCourses: true,
    canInstructCourses: true,
    canViewAllProgress: true,

    // Team Management
    canViewTeams: true,
    canManageTeam: true,
    canCreateTeams: true,
    canManageAllTeams: true,

    // Investment Groups
    canViewInvestments: true,
    canCreateInvestmentGroups: true,
    canManageInvestments: true,
    canViewAllInvestments: true,

    // KPI & Analytics
    canViewKPIs: true,
    canCreateKPIs: true,
    canManageKPIs: true,
    canViewCompanyKPIs: true,
    canViewReports: true,

    // Employee Management
    canViewEmployees: true,
    canManageEmployees: true,
    canViewPayroll: true,
    canManageRoles: true,
  },
}

// Get combined platform permissions
export function getPlatformPermissions(role: UserRole): PlatformPermissions {
  return {
    hbh2: USER_PERMISSIONS[role],
    portal: PORTAL_PERMISSIONS[role]
  }
}

// Check if user has portal access
export function hasPortalAccess(userRole: UserRole, portalAccess: boolean): boolean {
  return portalAccess && (userRole === 'PROFESSIONAL' || userRole === 'ADMIN')
}

// Check portal permission
export function hasPortalPermission(userRole: UserRole, permission: keyof PortalPermissions): boolean {
  return PORTAL_PERMISSIONS[userRole][permission]
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
  },
  TITLE_COMPANY: {
    title: 'Title Company',
    description: 'Manage closings, title work, and transaction coordination',
    features: [
      'View and manage all assigned transactions',
      'Schedule and coordinate closings',
      'Upload and manage title documents',
      'Communicate with buyers, sellers, and agents',
      'Track transaction milestones',
      'Generate closing statements',
      'Manage title commitments and policies'
    ]
  }
} as const
