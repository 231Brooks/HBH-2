# HBH-2 & Portal API Specification

## API Architecture Overview

### Base Structure
```
/api/
├── shared/           # Cross-platform APIs
│   ├── auth/
│   ├── users/
│   ├── notifications/
│   └── sync/
├── hbh2/            # HBH-2 specific APIs
│   ├── properties/
│   ├── auctions/
│   ├── transactions/
│   └── services/
└── portal/          # Portal specific APIs
    ├── teams/
    ├── learning/
    ├── investments/
    └── kpis/
```

## Shared APIs

### Authentication & User Management

#### POST /api/shared/auth/login
```typescript
interface LoginRequest {
  email: string
  password: string
  platform?: 'hbh2' | 'portal' | 'both'
}

interface LoginResponse {
  user: User
  session: Session
  permissions: PlatformPermissions
  redirectUrl?: string
}
```

#### GET /api/shared/auth/session
```typescript
interface SessionResponse {
  user: User | null
  permissions: PlatformPermissions
  platformAccess: {
    hbh2: boolean
    portal: boolean
  }
}
```

#### POST /api/shared/auth/switch-platform
```typescript
interface SwitchPlatformRequest {
  targetPlatform: 'hbh2' | 'portal'
}

interface SwitchPlatformResponse {
  success: boolean
  redirectUrl: string
  permissions: PlatformPermissions
}
```

### User Synchronization

#### POST /api/shared/users/sync
```typescript
interface UserSyncRequest {
  userId: string
  syncType: 'permissions' | 'profile' | 'all'
}

interface UserSyncResponse {
  success: boolean
  updatedFields: string[]
  errors?: string[]
}
```

#### PUT /api/shared/users/[userId]/platform-access
```typescript
interface PlatformAccessRequest {
  hbh2Access: boolean
  portalAccess: boolean
  roles?: {
    hbh2?: UserRole
    portal?: PortalRole
  }
}
```

### Cross-Platform Notifications

#### GET /api/shared/notifications
```typescript
interface NotificationQuery {
  platform?: 'hbh2' | 'portal' | 'both'
  type?: NotificationType[]
  unreadOnly?: boolean
  limit?: number
  offset?: number
}

interface NotificationResponse {
  notifications: Notification[]
  totalCount: number
  unreadCount: number
}
```

#### POST /api/shared/notifications/send
```typescript
interface SendNotificationRequest {
  recipients: string[] // User IDs
  title: string
  message: string
  type: NotificationType
  platform: 'hbh2' | 'portal' | 'both'
  actionUrl?: string
  actionText?: string
}
```

## Portal APIs

### Team Management

#### GET /api/portal/teams
```typescript
interface TeamsQuery {
  location?: string
  type?: TeamType
  leaderId?: string
  includeMembers?: boolean
}

interface TeamsResponse {
  teams: Team[]
  totalCount: number
}
```

#### POST /api/portal/teams
```typescript
interface CreateTeamRequest {
  name: string
  description?: string
  location: string
  type: TeamType
  leaderId: string
}

interface CreateTeamResponse {
  team: Team
  success: boolean
}
```

#### PUT /api/portal/teams/[teamId]/members
```typescript
interface UpdateTeamMembersRequest {
  addMembers?: string[] // User IDs
  removeMembers?: string[] // User IDs
  newLeaderId?: string
}
```

#### GET /api/portal/teams/[teamId]/kpis
```typescript
interface TeamKPIsResponse {
  kpis: KPI[]
  summary: {
    totalKPIs: number
    onTrack: number
    atRisk: number
    exceeded: number
  }
}
```

### Learning Center

#### GET /api/portal/learning/courses
```typescript
interface CoursesQuery {
  category?: CourseCategory
  difficulty?: CourseDifficulty
  instructorId?: string
  isRequired?: boolean
  userProgress?: boolean // Include user's progress
}

interface CoursesResponse {
  courses: Course[]
  userProgress?: CourseProgress[]
}
```

#### POST /api/portal/learning/courses/[courseId]/enroll
```typescript
interface EnrollRequest {
  userId?: string // Admin can enroll others
}

interface EnrollResponse {
  progress: CourseProgress
  nextModule?: CourseModule
  prerequisites?: Course[]
}
```

#### PUT /api/portal/learning/progress/[progressId]
```typescript
interface UpdateProgressRequest {
  moduleId?: string
  timeSpent: number
  completed?: boolean
}

interface UpdateProgressResponse {
  progress: CourseProgress
  unlockedFeatures?: FeatureUnlock[]
  certificationsEarned?: Certification[]
}
```

#### POST /api/portal/learning/quiz/[quizId]/submit
```typescript
interface QuizSubmissionRequest {
  answers: {
    questionId: string
    answer: string
  }[]
  timeSpent: number
}

interface QuizSubmissionResponse {
  score: QuizScore
  passed: boolean
  correctAnswers: number
  totalQuestions: number
  canRetake: boolean
  nextModule?: CourseModule
}
```

### Investment Groups

#### GET /api/portal/investments/groups
```typescript
interface InvestmentGroupsQuery {
  status?: InvestmentGroupStatus
  memberId?: string
  managerId?: string
  includeProperties?: boolean
}

interface InvestmentGroupsResponse {
  groups: InvestmentGroup[]
  totalInvested: number
  totalReturns: number
}
```

#### POST /api/portal/investments/groups
```typescript
interface CreateInvestmentGroupRequest {
  name: string
  description?: string
  targetAmount: number
  minimumInvestment: number
  isPrivate: boolean
}

interface CreateInvestmentGroupResponse {
  group: InvestmentGroup
  inviteCode?: string
}
```

#### POST /api/portal/investments/groups/[groupId]/invest
```typescript
interface InvestmentRequest {
  amount: number
  paymentMethodId: string
}

interface InvestmentResponse {
  membership: InvestmentGroupMember
  transaction: PaymentTransaction
  newGroupTotal: number
}
```

#### POST /api/portal/investments/groups/[groupId]/properties/link
```typescript
interface LinkPropertyRequest {
  propertyId: string // From HBH-2
  purchasePrice: number
  purchaseDate: string
}

interface LinkPropertyResponse {
  investmentProperty: InvestmentProperty
  membershipUpdates: InvestmentGroupMember[]
}
```

### KPI Management

#### GET /api/portal/kpis
```typescript
interface KPIsQuery {
  category?: KPICategory
  period?: KPIPeriod
  ownerId?: string
  teamId?: string
  includeHistory?: boolean
}

interface KPIsResponse {
  kpis: KPI[]
  summary: {
    totalKPIs: number
    onTrack: number
    atRisk: number
    exceeded: number
  }
}
```

#### POST /api/portal/kpis
```typescript
interface CreateKPIRequest {
  name: string
  description?: string
  category: KPICategory
  targetValue: number
  unit: string
  period: KPIPeriod
  startDate: string
  endDate?: string
  ownerId?: string
  teamId?: string
  dataSource: KPIDataSource
  sourceConfig?: object
}
```

#### PUT /api/portal/kpis/[kpiId]/value
```typescript
interface UpdateKPIValueRequest {
  value: number
  notes?: string
  recordedAt?: string
}

interface UpdateKPIValueResponse {
  kpi: KPI
  history: KPIHistory
  alertsTriggered?: KPIAlert[]
}
```

#### POST /api/portal/kpis/sync
```typescript
interface KPISyncRequest {
  source: KPIDataSource
  kpiIds?: string[] // Specific KPIs to sync, or all if empty
  dateRange?: {
    start: string
    end: string
  }
}

interface KPISyncResponse {
  syncedKPIs: number
  errors: string[]
  summary: {
    updated: number
    unchanged: number
    failed: number
  }
}
```

## Integration APIs

### HBH-2 ↔ Portal Data Sync

#### POST /api/shared/sync/transactions
```typescript
interface SyncTransactionsRequest {
  dateRange?: {
    start: string
    end: string
  }
  userIds?: string[]
  teamIds?: string[]
}

interface SyncTransactionsResponse {
  syncedTransactions: number
  updatedKPIs: string[]
  errors: string[]
}
```

#### POST /api/shared/sync/properties
```typescript
interface SyncPropertiesRequest {
  propertyIds?: string[]
  includeInvestmentGroups?: boolean
}

interface SyncPropertiesResponse {
  syncedProperties: number
  updatedInvestments: number
  errors: string[]
}
```

#### POST /api/shared/sync/users
```typescript
interface SyncUsersRequest {
  userIds?: string[]
  syncType: 'permissions' | 'profile' | 'teams' | 'all'
}

interface SyncUsersResponse {
  syncedUsers: number
  updatedPermissions: number
  errors: string[]
}
```

### Feature Unlock Integration

#### POST /api/shared/features/check-access
```typescript
interface FeatureAccessRequest {
  userId: string
  featureName: string
  platform: 'hbh2' | 'portal'
}

interface FeatureAccessResponse {
  hasAccess: boolean
  requiredCourses?: Course[]
  completedCourses?: Course[]
  missingRequirements?: string[]
}
```

#### POST /api/shared/features/unlock
```typescript
interface FeatureUnlockRequest {
  userId: string
  completedCourseId: string
}

interface FeatureUnlockResponse {
  unlockedFeatures: FeatureUnlock[]
  updatedPermissions: PlatformPermissions
  notifications: Notification[]
}
```

## Real-time Integration

### WebSocket Events

#### Portal → HBH-2 Events
```typescript
// Team assignment changes
interface TeamAssignmentEvent {
  type: 'team.member.added' | 'team.member.removed' | 'team.leader.changed'
  teamId: string
  userId: string
  timestamp: string
}

// Investment group property purchases
interface InvestmentPropertyEvent {
  type: 'investment.property.linked' | 'investment.property.sold'
  groupId: string
  propertyId: string
  amount: number
  timestamp: string
}

// Learning progress updates
interface LearningProgressEvent {
  type: 'course.completed' | 'certification.earned'
  userId: string
  courseId?: string
  certificationId?: string
  unlockedFeatures: string[]
  timestamp: string
}
```

#### HBH-2 → Portal Events
```typescript
// Transaction completion
interface TransactionEvent {
  type: 'transaction.completed' | 'transaction.cancelled'
  transactionId: string
  propertyId: string
  userId: string
  amount: number
  timestamp: string
}

// Property status changes
interface PropertyEvent {
  type: 'property.sold' | 'property.listed' | 'auction.ended'
  propertyId: string
  ownerId: string
  price: number
  timestamp: string
}
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  error: {
    code: string
    message: string
    details?: object
    timestamp: string
    requestId: string
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `PLATFORM_ACCESS_DENIED`: User doesn't have access to platform
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `VALIDATION_ERROR`: Request validation failed
- `SYNC_ERROR`: Cross-platform sync failed
- `FEATURE_LOCKED`: Feature requires course completion
