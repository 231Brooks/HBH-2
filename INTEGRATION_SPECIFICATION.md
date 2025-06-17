# HBH-2 & HBH Portal Integration Specification

## Integration Points Detail

### 1. User Authentication & Authorization

#### Current State
- Supabase Auth handles authentication
- User roles stored in Prisma User model
- JWT tokens for session management

#### Integration Requirements
```typescript
// Enhanced User model additions
model User {
  // ... existing fields

  // Platform Access Control
  hbh2Access      Boolean @default(true)
  portalAccess    Boolean @default(false)
  
  // Portal-specific fields
  employeeId      String? @unique
  department      String?
  hireDate        DateTime?
  teamId          String?
  team            Team? @relation(fields: [teamId], references: [id])
  managerId       String?
  manager         User? @relation("ManagerEmployee", fields: [managerId], references: [id])
  directReports   User[] @relation("ManagerEmployee")
  
  // Investment participation
  investmentGroups InvestmentGroupMember[]
  
  // Learning & Development
  courseProgress   CourseProgress[]
  certifications   Certification[]
  learningPath     LearningPath?
}
```

#### Authentication Flow
1. **Single Sign-On**: User logs in once, gains access to both platforms
2. **Role Validation**: Check platform-specific permissions on each request
3. **Session Sync**: Maintain consistent session state across platforms
4. **Permission Updates**: Real-time permission updates when roles change

### 2. Investment Group ↔ Property Integration

#### Use Cases
1. **Investment Group Property Purchase**
   - Group decides to invest in HBH-2 property
   - Funds are pooled and tracked
   - Ownership is distributed among members

2. **Property Performance Tracking**
   - Track ROI for investment group properties
   - Generate reports for group members
   - Handle profit/loss distribution

#### Implementation
```typescript
// New models for investment integration
model InvestmentProperty {
  id              String @id @default(cuid())
  propertyId      String @unique
  property        Property @relation(fields: [propertyId], references: [id])
  groupId         String
  group           InvestmentGroup @relation(fields: [groupId], references: [id])
  purchasePrice   Float
  purchaseDate    DateTime
  currentValue    Float?
  roi             Float? // Return on Investment percentage
  status          InvestmentStatus
  distributions   InvestmentDistribution[]
  createdAt       DateTime @default(now())
}

model InvestmentDistribution {
  id              String @id @default(cuid())
  propertyId      String
  property        InvestmentProperty @relation(fields: [propertyId], references: [id])
  memberId        String
  member          InvestmentGroupMember @relation(fields: [memberId], references: [id])
  amount          Float
  type            DistributionType // PROFIT, LOSS, DIVIDEND
  distributedAt   DateTime @default(now())
}

enum InvestmentStatus {
  ACTIVE
  SOLD
  UNDER_CONTRACT
  FORECLOSURE
}

enum DistributionType {
  PROFIT
  LOSS
  DIVIDEND
  CAPITAL_RETURN
}
```

#### Integration Services
```typescript
class InvestmentPropertyService {
  async linkPropertyToGroup(propertyId: string, groupId: string) {
    // Create investment property record
    // Update property ownership in HBH-2
    // Notify group members
    // Set up tracking for ROI calculations
  }
  
  async calculateROI(investmentPropertyId: string) {
    // Get current property value from HBH-2
    // Calculate appreciation
    // Factor in rental income (if applicable)
    // Return ROI percentage
  }
  
  async distributeReturns(investmentPropertyId: string, totalAmount: float) {
    // Calculate each member's share based on contribution
    // Create distribution records
    // Update member balances
    // Send notifications
  }
}
```

### 3. Learning Progress ↔ Platform Permissions

#### Use Cases
1. **Feature Unlocking**: Complete courses to unlock advanced HBH-2 features
2. **Certification Requirements**: Mandatory training for certain roles
3. **Performance Tracking**: Monitor employee learning progress

#### Implementation
```typescript
// Learning models
model Course {
  id              String @id @default(cuid())
  title           String
  description     String @db.Text
  category        CourseCategory
  difficulty      CourseDifficulty
  duration        Int // minutes
  instructorId    String
  instructor      User @relation("CourseInstructor", fields: [instructorId], references: [id])
  modules         CourseModule[]
  prerequisites   CoursePrerequisite[]
  unlocks         FeatureUnlock[] // What HBH-2 features this unlocks
  isRequired      Boolean @default(false)
  requiredForRole String? // Required for specific roles
  createdAt       DateTime @default(now())
}

model CourseModule {
  id              String @id @default(cuid())
  courseId        String
  course          Course @relation(fields: [courseId], references: [id])
  title           String
  content         String @db.Text
  videoUrl        String?
  duration        Int // minutes
  order           Int
  quiz            Quiz?
  createdAt       DateTime @default(now())
}

model FeatureUnlock {
  id              String @id @default(cuid())
  courseId        String
  course          Course @relation(fields: [courseId], references: [id])
  featureName     String // e.g., "advanced_bidding", "bulk_operations"
  platform        Platform // HBH2 or PORTAL
  description     String
}

model CourseProgress {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(fields: [userId], references: [id])
  courseId        String
  course          Course @relation(fields: [courseId], references: [id])
  progress        Int @default(0) // 0-100
  currentModuleId String?
  currentModule   CourseModule? @relation(fields: [currentModuleId], references: [id])
  completedAt     DateTime?
  startedAt       DateTime @default(now())
  timeSpent       Int @default(0) // minutes
  quizScores      QuizScore[]
}

enum CourseCategory {
  ONBOARDING
  REAL_ESTATE_BASICS
  ADVANCED_BIDDING
  INVESTMENT_STRATEGIES
  TEAM_MANAGEMENT
  COMPLIANCE
  TECHNOLOGY_TRAINING
}

enum CourseDifficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum Platform {
  HBH2
  PORTAL
  BOTH
}
```

#### Learning Integration Service
```typescript
class LearningIntegrationService {
  async checkFeatureAccess(userId: string, featureName: string): Promise<boolean> {
    // Get user's completed courses
    // Check if any completed course unlocks the feature
    // Return access permission
  }
  
  async updateUserPermissions(userId: string, completedCourseId: string) {
    const course = await getCourseWithUnlocks(completedCourseId)
    
    for (const unlock of course.unlocks) {
      if (unlock.platform === 'HBH2' || unlock.platform === 'BOTH') {
        await this.grantHBH2Feature(userId, unlock.featureName)
      }
      if (unlock.platform === 'PORTAL' || unlock.platform === 'BOTH') {
        await this.grantPortalFeature(userId, unlock.featureName)
      }
    }
  }
  
  async enforceRequiredTraining(userId: string, newRole: UserRole) {
    // Get required courses for the role
    // Check completion status
    // Block role assignment if training incomplete
  }
}
```

### 4. KPI Tracking Integration

#### Data Flow
1. **HBH-2 → Portal**: Transaction data, property performance, user activity
2. **Portal → HBH-2**: Team assignments, performance targets
3. **Bidirectional**: User achievements, goal progress

#### Implementation
```typescript
// KPI models
model KPI {
  id              String @id @default(cuid())
  name            String
  description     String?
  category        KPICategory
  targetValue     Float
  currentValue    Float @default(0)
  unit            String // "deals", "dollars", "percentage", etc.
  period          KPIPeriod
  
  // Ownership (can be user, team, or company-wide)
  ownerId         String?
  owner           User? @relation("UserKPIs", fields: [ownerId], references: [id])
  teamId          String?
  team            Team? @relation("TeamKPIs", fields: [teamId], references: [id])
  
  // Data source configuration
  dataSource      KPIDataSource
  sourceConfig    String? // JSON config for data extraction
  
  // Tracking
  history         KPIHistory[]
  alerts          KPIAlert[]
  
  isActive        Boolean @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model KPIHistory {
  id              String @id @default(cuid())
  kpiId           String
  kpi             KPI @relation(fields: [kpiId], references: [id])
  value           Float
  previousValue   Float?
  changePercent   Float?
  recordedAt      DateTime @default(now())
  notes           String?
  dataSnapshot    String? // JSON snapshot of source data
}

model KPIAlert {
  id              String @id @default(cuid())
  kpiId           String
  kpi             KPI @relation(fields: [kpiId], references: [id])
  condition       AlertCondition
  threshold       Float
  isActive        Boolean @default(true)
  lastTriggered   DateTime?
  recipients      String[] // User IDs to notify
}

enum KPICategory {
  SALES_PERFORMANCE
  PROPERTY_METRICS
  USER_ENGAGEMENT
  FINANCIAL
  OPERATIONAL
  LEARNING_DEVELOPMENT
}

enum KPIPeriod {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum KPIDataSource {
  HBH2_TRANSACTIONS
  HBH2_PROPERTIES
  HBH2_USERS
  PORTAL_LEARNING
  PORTAL_TEAMS
  MANUAL_ENTRY
}

enum AlertCondition {
  ABOVE_THRESHOLD
  BELOW_THRESHOLD
  PERCENT_CHANGE
  NO_UPDATE
}
```

#### KPI Sync Service
```typescript
class KPISyncService {
  async syncTransactionKPIs() {
    // Pull completed transactions from HBH-2
    // Update sales performance KPIs
    // Calculate commission and revenue metrics
    // Update individual and team performance
  }
  
  async syncPropertyKPIs() {
    // Pull property listing data
    // Update listing performance metrics
    // Track time on market, price changes
    // Calculate conversion rates
  }
  
  async syncUserEngagementKPIs() {
    // Track user activity across both platforms
    // Monitor feature usage
    // Calculate engagement scores
  }
  
  async syncLearningKPIs() {
    // Track course completion rates
    // Monitor learning progress
    // Calculate training effectiveness
  }
}
```
