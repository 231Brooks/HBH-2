// User types
export interface User {
  id: string
  name?: string
  email: string
  image?: string
  role: string
  location?: string
  bio?: string
  phone?: string
  rating?: number
  reviewCount: number
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  createdAt: string
  updatedAt: string
}

// Property types
export interface Property {
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
  type: string
  status: string
  features: string[]
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
  auctionEnd?: string
  auctionReservePrice?: number
  ownerId: string
  owner: {
    id: string
    name?: string
    email: string
  }
  images: PropertyImage[]
}

export interface PropertyImage {
  id: string
  url: string
  isPrimary: boolean
}

// Auction types
export interface Bid {
  id: string
  amount: number
  propertyId: string
  userId: string
  createdAt: string
  status: string
  user?: {
    id: string
    name?: string
    email: string
  }
}

// Transaction types
export interface Transaction {
  id: string
  propertyId: string
  property: Property
  creatorId: string
  creator: User
  type: string
  status: string
  price: number
  closingDate?: string
  createdAt: string
  updatedAt: string
  progress: number
  notes?: string
  parties: TransactionParty[]
  documents: Document[]
  titleCompanyId?: string
  titleCompany?: TitleCompany
  milestones: Milestone[]
  tasks: Task[]
}

export interface TransactionParty {
  id: string
  transactionId: string
  userId: string
  user: User
  role: string
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  name: string
  url: string
  type: string
  transactionId: string
  uploadedById?: string
  createdAt: string
  updatedAt: string
  status: string
  comments: DocumentComment[]
}

export interface DocumentComment {
  id: string
  content: string
  documentId: string
  userId: string
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
  }
}

export interface Milestone {
  id: string
  transactionId: string
  title: string
  description?: string
  dueDate: string
  completedDate?: string
  status: string
  createdAt: string
  updatedAt: string
}

// Title Company types
export interface TitleCompany {
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
  createdAt: string
  updatedAt: string
}

// Task types
export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  completedDate?: string
  assignedToId?: string
  transactionId?: string
  projectId?: string
  createdAt: string
  updatedAt: string
}

// Calendar types
export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
  type: string
  userId: string
  user: User
  createdAt: string
  updatedAt: string
  attendees: string[]
  reminderSent: boolean
}

// Messaging model
export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  read: boolean
  createdAt: string
  conversationId: string
}

// Job Marketplace models
export interface JobListing {
  id: string
  title: string
  description: string
  location: string
  budget: string
  category: string
  skills: string[]
  createdAt: string
  updatedAt: string
  proposals: number
}

// Service model
export interface Service {
  id: string
  name: string
  description?: string
  category: string
  price?: string
  hourlyRate?: number
  providerId: string
  location?: string
  image?: string
  verified: boolean
  createdAt: string
  updatedAt: string
}
