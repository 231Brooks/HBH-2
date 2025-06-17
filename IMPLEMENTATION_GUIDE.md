# HBH-2 & Portal Implementation Guide

## Phase 1: Foundation Setup (Weeks 1-2)

### 1.1 Database Schema Migration

#### Step 1: Backup Current Database
```bash
# Create backup of current HBH-2 database
pg_dump $DATABASE_URL > hbh2_backup_$(date +%Y%m%d).sql
```

#### Step 2: Apply Portal Schema Extensions
```bash
# Add new models to prisma/schema.prisma
# Copy content from PORTAL_SCHEMA_EXTENSION.prisma

# Generate and apply migration
npx prisma migrate dev --name "add-portal-features"
npx prisma generate
```

#### Step 3: Update User Model
```typescript
// Add to existing User model in schema.prisma
model User {
  // ... existing fields

  // Platform Access Control
  hbh2Access      Boolean @default(true)
  portalAccess    Boolean @default(false)
  
  // Portal-specific fields
  employeeId      String? @unique
  department      String?
  hireDate        DateTime?
  
  // Team relationships
  teamId          String?
  team            Team? @relation(fields: [teamId], references: [id])
  managerId       String?
  manager         User? @relation("ManagerEmployee", fields: [managerId], references: [id])
  directReports   User[] @relation("ManagerEmployee")
  ledTeams        Team[] @relation("TeamLeader")
  
  // Investment participation
  investmentMemberships InvestmentGroupMember[] @relation("InvestmentMemberships")
  createdInvestmentGroups InvestmentGroup[] @relation("CreatedInvestmentGroups")
  managedInvestmentGroups InvestmentGroup[] @relation("ManagedInvestmentGroups")
  
  // Learning & Development
  learningProgress CourseProgress[] @relation("LearningProgress")
  instructedCourses Course[] @relation("InstructedCourses")
  quizAttempts    QuizScore[] @relation("QuizAttempts")
  certifications  Certification[]
  
  // Goals & KPIs
  createdGoals    TeamGoal[] @relation("CreatedGoals")
  kpis            KPI[] @relation("UserKPIs")
  
  // Portal notifications
  portalNotifications PortalNotification[] @relation("PortalNotifications")
}
```

### 1.2 Enhanced Authentication System

#### Step 1: Update User Permissions
```typescript
// lib/user-roles.ts - Add portal permissions
interface PlatformPermissions {
  hbh2: UserPermissions
  portal: {
    canAccessLearningCenter: boolean
    canManageTeam: boolean
    canCreateInvestmentGroups: boolean
    canViewCompanyKPIs: boolean
    canManageEmployees: boolean
    canAccessReports: boolean
    canInstructCourses: boolean
    canManageInvestments: boolean
  }
}

export const PORTAL_PERMISSIONS: Record<UserRole, PlatformPermissions['portal']> = {
  USER: {
    canAccessLearningCenter: true,
    canManageTeam: false,
    canCreateInvestmentGroups: false,
    canViewCompanyKPIs: false,
    canManageEmployees: false,
    canAccessReports: false,
    canInstructCourses: false,
    canManageInvestments: false,
  },
  PROFESSIONAL: {
    canAccessLearningCenter: true,
    canManageTeam: false,
    canCreateInvestmentGroups: true,
    canViewCompanyKPIs: false,
    canManageEmployees: false,
    canAccessReports: false,
    canInstructCourses: true,
    canManageInvestments: true,
  },
  ADMIN: {
    canAccessLearningCenter: true,
    canManageTeam: true,
    canCreateInvestmentGroups: true,
    canViewCompanyKPIs: true,
    canManageEmployees: true,
    canAccessReports: true,
    canInstructCourses: true,
    canManageInvestments: true,
  },
}
```

#### Step 2: Cross-Platform Navigation
```typescript
// components/platform-switcher.tsx
export function PlatformSwitcher() {
  const { user } = useSupabase()
  const router = useRouter()
  
  const switchToPlatform = async (platform: 'hbh2' | 'portal') => {
    try {
      const response = await fetch('/api/shared/auth/switch-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlatform: platform })
      })
      
      const data = await response.json()
      if (data.success) {
        router.push(data.redirectUrl)
      }
    } catch (error) {
      console.error('Platform switch failed:', error)
    }
  }
  
  return (
    <div className="platform-switcher">
      {user?.hbh2Access && (
        <Button onClick={() => switchToPlatform('hbh2')}>
          HBH-2 Platform
        </Button>
      )}
      {user?.portalAccess && (
        <Button onClick={() => switchToPlatform('portal')}>
          HBH Portal
        </Button>
      )}
    </div>
  )
}
```

### 1.3 Basic Portal UI Structure

#### Step 1: Portal Layout
```typescript
// app/portal/layout.tsx
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="portal-layout">
      <PortalSidebar />
      <main className="portal-main">
        <PortalHeader />
        {children}
      </main>
    </div>
  )
}
```

#### Step 2: Portal Dashboard
```typescript
// app/portal/page.tsx
export default function PortalDashboard() {
  return (
    <div className="portal-dashboard">
      <DashboardHeader />
      <div className="dashboard-grid">
        <LearningProgressCard />
        <TeamPerformanceCard />
        <InvestmentSummaryCard />
        <KPIOverviewCard />
      </div>
    </div>
  )
}
```

## Phase 2: Core Features Implementation (Weeks 3-6)

### 2.1 Learning Center Implementation

#### Step 1: Course Management API
```typescript
// app/api/portal/learning/courses/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  
  const courses = await prisma.course.findMany({
    where: {
      ...(category && { category: category as CourseCategory }),
      ...(difficulty && { difficulty: difficulty as CourseDifficulty }),
      isPublished: true,
    },
    include: {
      instructor: true,
      modules: {
        orderBy: { order: 'asc' }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  })
  
  return NextResponse.json({ courses })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, 'canInstructCourses')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  const data = await request.json()
  const course = await prisma.course.create({
    data: {
      ...data,
      instructorId: user.id,
    }
  })
  
  return NextResponse.json({ course })
}
```

#### Step 2: Course Progress Tracking
```typescript
// lib/learning-service.ts
export class LearningService {
  static async enrollUser(userId: string, courseId: string) {
    // Check prerequisites
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { prerequisites: true }
    })
    
    if (!course) throw new Error('Course not found')
    
    // Verify prerequisites are met
    for (const prereq of course.prerequisites) {
      const completed = await this.isCourseCompleted(userId, prereq.prerequisiteId)
      if (!completed) {
        throw new Error(`Prerequisite course ${prereq.prerequisite.title} not completed`)
      }
    }
    
    // Create progress record
    return await prisma.courseProgress.create({
      data: {
        userId,
        courseId,
        progress: 0,
      }
    })
  }
  
  static async updateProgress(progressId: string, moduleId: string, timeSpent: number) {
    const progress = await prisma.courseProgress.findUnique({
      where: { id: progressId },
      include: { 
        course: { 
          include: { 
            modules: { orderBy: { order: 'asc' } },
            unlocks: true
          } 
        } 
      }
    })
    
    if (!progress) throw new Error('Progress not found')
    
    // Update time spent and current module
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: progressId },
      data: {
        currentModuleId: moduleId,
        timeSpent: progress.timeSpent + timeSpent,
        lastAccessedAt: new Date(),
      }
    })
    
    // Check if course is completed
    const completedModules = await this.getCompletedModules(progressId)
    const totalModules = progress.course.modules.length
    const newProgress = Math.round((completedModules.length / totalModules) * 100)
    
    if (newProgress === 100 && !progress.completedAt) {
      // Course completed - unlock features
      await this.completeCourse(progressId)
      await this.unlockFeatures(progress.userId, progress.course.unlocks)
    }
    
    return updatedProgress
  }
  
  static async unlockFeatures(userId: string, unlocks: FeatureUnlock[]) {
    for (const unlock of unlocks) {
      if (unlock.platform === 'HBH2' || unlock.platform === 'BOTH') {
        await this.updateHBH2Permissions(userId, unlock.featureName)
      }
      if (unlock.platform === 'PORTAL' || unlock.platform === 'BOTH') {
        await this.updatePortalPermissions(userId, unlock.featureName)
      }
    }
  }
}
```

### 2.2 Team Management System

#### Step 1: Team API Implementation
```typescript
// app/api/portal/teams/route.ts
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const type = searchParams.get('type')
  
  const teams = await prisma.team.findMany({
    where: {
      ...(location && { location }),
      ...(type && { type: type as TeamType }),
      isActive: true,
    },
    include: {
      leader: true,
      members: true,
      _count: {
        select: { 
          members: true,
          kpis: true,
          projects: true
        }
      }
    }
  })
  
  return NextResponse.json({ teams })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, 'canManageTeam')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  const data = await request.json()
  const team = await prisma.team.create({
    data: {
      ...data,
      members: {
        connect: [{ id: data.leaderId }] // Leader is also a member
      }
    },
    include: {
      leader: true,
      members: true
    }
  })
  
  return NextResponse.json({ team })
}
```

#### Step 2: Team Performance Dashboard
```typescript
// components/team-performance-dashboard.tsx
export function TeamPerformanceDashboard({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<Team | null>(null)
  const [kpis, setKPIs] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadTeamData()
  }, [teamId])
  
  const loadTeamData = async () => {
    try {
      const [teamResponse, kpiResponse] = await Promise.all([
        fetch(`/api/portal/teams/${teamId}`),
        fetch(`/api/portal/teams/${teamId}/kpis`)
      ])
      
      const teamData = await teamResponse.json()
      const kpiData = await kpiResponse.json()
      
      setTeam(teamData.team)
      setKPIs(kpiData.kpis)
    } catch (error) {
      console.error('Failed to load team data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <LoadingSpinner />
  
  return (
    <div className="team-dashboard">
      <TeamHeader team={team} />
      <div className="dashboard-grid">
        <TeamMembersCard team={team} />
        <TeamKPIsCard kpis={kpis} />
        <TeamProjectsCard teamId={teamId} />
        <TeamGoalsCard teamId={teamId} />
      </div>
    </div>
  )
}
```

### 2.3 Investment Group Functionality

#### Step 1: Investment Group API
```typescript
// app/api/portal/investments/groups/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, 'canCreateInvestmentGroups')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  const data = await request.json()
  
  const group = await prisma.investmentGroup.create({
    data: {
      ...data,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          contribution: 0,
          role: 'ADMIN'
        }
      }
    },
    include: {
      members: {
        include: { user: true }
      }
    }
  })
  
  return NextResponse.json({ group })
}
```

#### Step 2: Property Investment Integration
```typescript
// lib/investment-integration.ts
export class InvestmentIntegrationService {
  static async linkPropertyToGroup(propertyId: string, groupId: string, purchasePrice: number) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    const group = await prisma.investmentGroup.findUnique({
      where: { id: groupId },
      include: { members: true }
    })
    
    if (!property || !group) {
      throw new Error('Property or group not found')
    }
    
    // Create investment property record
    const investmentProperty = await prisma.investmentProperty.create({
      data: {
        propertyId,
        groupId,
        purchasePrice,
        purchaseDate: new Date(),
        currentValue: purchasePrice,
        status: 'ACTIVE'
      }
    })
    
    // Update property ownership in HBH-2
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        // Add investment group reference
        // This might require schema changes to Property model
      }
    })
    
    // Notify group members
    await this.notifyGroupMembers(group, 'property_linked', {
      propertyId,
      purchasePrice
    })
    
    return investmentProperty
  }
  
  static async calculateROI(investmentPropertyId: string) {
    const investment = await prisma.investmentProperty.findUnique({
      where: { id: investmentPropertyId },
      include: { property: true }
    })
    
    if (!investment) throw new Error('Investment property not found')
    
    const currentValue = investment.currentValue || investment.property.price
    const purchasePrice = investment.purchasePrice
    const roi = ((currentValue - purchasePrice) / purchasePrice) * 100
    
    await prisma.investmentProperty.update({
      where: { id: investmentPropertyId },
      data: { roi }
    })
    
    return roi
  }
}
```

### 2.4 KPI Tracking System

#### Step 1: KPI Management API
```typescript
// app/api/portal/kpis/route.ts
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const data = await request.json()
  
  const kpi = await prisma.kPI.create({
    data: {
      ...data,
      ownerId: data.ownerId || user.id,
    }
  })
  
  return NextResponse.json({ kpi })
}
```

#### Step 2: Automated KPI Sync
```typescript
// lib/kpi-sync-service.ts
export class KPISyncService {
  static async syncTransactionKPIs() {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        creator: true,
        parties: {
          include: { user: true }
        }
      }
    })
    
    for (const transaction of transactions) {
      await this.updateUserSalesKPIs(transaction.creatorId, transaction.price)
      
      // Update team KPIs if user is part of a team
      const user = await prisma.user.findUnique({
        where: { id: transaction.creatorId },
        include: { team: true }
      })
      
      if (user?.team) {
        await this.updateTeamSalesKPIs(user.team.id, transaction.price)
      }
    }
  }
  
  static async updateUserSalesKPIs(userId: string, amount: number) {
    const salesKPIs = await prisma.kPI.findMany({
      where: {
        ownerId: userId,
        category: 'SALES_PERFORMANCE',
        isActive: true
      }
    })
    
    for (const kpi of salesKPIs) {
      const newValue = kpi.currentValue + amount
      
      await prisma.kPI.update({
        where: { id: kpi.id },
        data: { 
          currentValue: newValue,
          lastUpdated: new Date()
        }
      })
      
      // Record history
      await prisma.kPIHistory.create({
        data: {
          kpiId: kpi.id,
          value: newValue,
          previousValue: kpi.currentValue,
          changePercent: ((newValue - kpi.currentValue) / kpi.currentValue) * 100
        }
      })
      
      // Check alerts
      await this.checkKPIAlerts(kpi.id, newValue)
    }
  }
}
```

This implementation guide provides a structured approach to building the integrated HBH-2 and Portal system. Each phase builds upon the previous one, ensuring a stable and scalable implementation.
