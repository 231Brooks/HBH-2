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
  // Property & Building Services
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "ROOFING"
  | "SIDING"
  | "WINDOWS_DOORS"
  | "INSULATION"
  | "FLOORING_INSTALLATION"
  | "CARPET_INSTALLATION"
  | "TILE_GROUT"
  | "FOUNDATION_REPAIR"
  | "DRYWALL"
  | "MASONRY_CONCRETE"
  | "FRAMING_STRUCTURAL"
  | "WATERPROOFING"
  | "CHIMNEY"
  | "GUTTER"
  // Maintenance & Repair
  | "APPLIANCE_REPAIR"
  | "HANDYMAN"
  | "PEST_CONTROL"
  | "MOLD_REMEDIATION"
  | "PROPERTY_CLEANING"
  | "PRESSURE_WASHING"
  | "POOL_SPA"
  | "SEPTIC_TANK"
  | "LOCKSMITH"
  | "FURNACE_REPAIR"
  | "WATER_HEATER"
  | "GARAGE_DOOR"
  // Interior & Exterior Design
  | "INTERIOR_DESIGN"
  | "EXTERIOR_DESIGN"
  | "HOME_STAGING"
  | "PAINTING_INTERIOR"
  | "PAINTING_EXTERIOR"
  | "WALLPAPER"
  | "LIGHTING_DESIGN"
  | "CABINETRY_COUNTERTOPS"
  | "SMART_HOME"
  | "CLOSET_STORAGE"
  // Outdoor & Landscaping
  | "LANDSCAPING"
  | "LAWN_CARE"
  | "TREE_SERVICES"
  | "IRRIGATION"
  | "FENCE"
  | "DECK_PATIO"
  | "OUTDOOR_KITCHEN"
  | "DRIVEWAY_PAVING"
  | "RETAINING_WALLS"
  | "OUTDOOR_LIGHTING"
  // Construction & Renovation
  | "GENERAL_CONTRACTING"
  | "KITCHEN_REMODELING"
  | "BATHROOM_REMODELING"
  | "BASEMENT_FINISHING"
  | "ROOM_ADDITIONS"
  | "ADU_BUILDS"
  | "DEMOLITION"
  // Inspections & Assessments
  | "HOME_INSPECTION"
  | "TERMITE_INSPECTION"
  | "ROOF_INSPECTION"
  | "HVAC_INSPECTION"
  | "SEWER_INSPECTION"
  | "STRUCTURAL_ENGINEERING"
  | "ENERGY_ASSESSMENT"
  | "APPRAISAL"
  | "ENVIRONMENTAL_TESTING"
  // Legal, Closing & Administrative
  | "NOTARY"
  | "TITLE_SERVICES"
  | "ESCROW"
  | "DEED_PREPARATION"
  | "LEGAL_CONSULTING"
  | "LIEN_SERVICES"
  | "PERMIT_FILING"
  | "ZONING_COMPLIANCE"
  | "CONTRACT_SERVICES"
  // Transaction & Listing Support
  | "PHOTOGRAPHY"
  | "DRONE_PHOTOGRAPHY"
  | "VIRTUAL_TOURS"
  | "MLS_LISTING"
  | "PROPERTY_MARKETING"
  | "SIGNAGE"
  | "OPEN_HOUSE"
  | "LEAD_GENERATION"
  | "COPYWRITING"
  | "MARKET_ANALYSIS"
  | "VIRTUAL_STAGING"

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
