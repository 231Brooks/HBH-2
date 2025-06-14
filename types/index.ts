// User types
export type User = {
  id: string
  email: string
  name?: string
  image?: string
  coverPhoto?: string
  role: "USER" | "PROFESSIONAL" | "ADMIN"
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  location?: string
  bio?: string
  phone?: string
  rating?: number
  reviewCount: number
}

// Property types
export type Property = {
  id: string
  title: string
  description?: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  type: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "MULTI_FAMILY"
  status: "FOR_SALE" | "AUCTION" | "PENDING" | "SOLD"
  createdAt: Date
  updatedAt: Date
  images: PropertyImage[]
  features: string[]
  latitude?: number
  longitude?: number
  ownerId: string

  // Auction-specific fields
  auctionEndDate?: Date
  minimumBid?: number
  currentBid?: number
  bidIncrement?: number
  reservePrice?: number
  auctionWinnerId?: string
  auctionWinner?: User
  bids?: Bid[]
}

export type PropertyImage = {
  id: string
  url: string
  propertyId: string
  isPrimary: boolean
  createdAt: Date
}

export type SavedProperty = {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}

// Bid types
export type Bid = {
  id: string
  amount: number
  propertyId: string
  property?: Property
  bidderId: string
  bidder?: User
  status: "ACTIVE" | "OUTBID" | "WITHDRAWN" | "WINNING" | "EXPIRED"
  isWinning: boolean
  createdAt: Date
  updatedAt: Date
}

// Transaction types
export type Transaction = {
  id: string
  propertyId: string
  property: Property
  creatorId: string
  creator: User
  type: "PURCHASE" | "SALE"
  status: "IN_PROGRESS" | "PENDING_APPROVAL" | "DOCUMENT_REVIEW" | "CLOSING_SOON" | "COMPLETED" | "CANCELLED"
  price: number
  closingDate?: Date
  createdAt: Date
  updatedAt: Date
  progress: number
  notes?: string
  parties: TransactionParty[]
  documents: Document[]
  titleCompanyId?: string
  titleCompany?: TitleCompany
  milestones: Milestone[]
}

export type TransactionParty = {
  id: string
  transactionId: string
  userId: string
  user: User
  role: "BUYER" | "SELLER" | "AGENT" | "TITLE_AGENT" | "ATTORNEY" | "OTHER"
  createdAt: Date
  updatedAt: Date
}

export type Document = {
  id: string
  name: string
  url: string
  type:
    | "PURCHASE_AGREEMENT"
    | "DISCLOSURE"
    | "INSPECTION"
    | "APPRAISAL"
    | "TITLE_COMMITMENT"
    | "CLOSING_STATEMENT"
    | "OTHER"
  transactionId: string
  uploadedById?: string
  createdAt: Date
  updatedAt: Date
}

export type Milestone = {
  id: string
  transactionId: string
  title: string
  description?: string
  dueDate: Date
  completedDate?: Date
  status: "PENDING" | "COMPLETED" | "OVERDUE"
  createdAt: Date
  updatedAt: Date
}

// Title Company types
export type TitleCompany = {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

// Service types
export type Service = {
  id: string
  name: string
  description?: string
  category: ServiceCategory
  price?: string
  hourlyRate?: number
  providerId: string
  provider: User
  location?: string
  image?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  reviews: Review[]
}

export type ServiceCategory =
  | "TITLE_SERVICES"
  | "HOME_INSPECTION"
  | "PHOTOGRAPHY"
  | "CONTRACTORS"
  | "LEGAL_SERVICES"
  | "MORTGAGE"
  | "INTERIOR_DESIGN"
  | "MOVING_SERVICES"

// Project types
export type Project = {
  id: string
  title: string
  description?: string
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  progress: number
  startDate?: Date
  endDate?: Date
  budget?: number
  ownerId: string
  owner: User
  serviceId?: string
  service?: Service
  createdAt: Date
  updatedAt: Date
}

// Review types
export type Review = {
  id: string
  rating: number
  comment?: string
  authorId: string
  author: User
  receiverId: string
  receiver: User
  serviceId?: string
  service?: Service
  createdAt: Date
  updatedAt: Date
}

// Calendar/Appointment types
export type Appointment = {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  type: "CLOSING" | "INSPECTION" | "PHOTOGRAPHY" | "LEGAL" | "RENOVATION" | "OTHER"
  userId: string
  user: User
  createdAt: Date
  updatedAt: Date
}

// Messaging types
export type Message = {
  id: string
  content: string
  senderId: string
  sender: User
  receiverId: string
  receiver: User
  read: boolean
  createdAt: Date
  conversationId: string
}

export type Conversation = {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Job Marketplace types
export type JobListing = {
  id: string
  title: string
  description: string
  location: string
  budget: string
  category: ServiceCategory
  skills: string[]
  createdAt: Date
  updatedAt: Date
  proposals: number
}
