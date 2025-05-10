// User related types
export interface User {
  id: number
  email: string
  password_hash: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  profile_image_url: string | null
  created_at: Date
  updated_at: Date
}

export interface PaymentMethod {
  id: number
  user_id: number
  card_type: string
  last_four: string
  expiry_date: string
  billing_address: string | null
  is_default: boolean
  created_at: Date
}

export interface IdentificationDocument {
  id: number
  user_id: number
  document_type: string
  document_number: string
  verification_status: string
  document_url: string | null
  expiry_date: Date | null
  created_at: Date
}

// Investment related types
export interface Investment {
  id: number
  name: string
  description: string | null
  type: "company" | "resource"
  price: number
  current_value: number | null
  change_percentage: number | null
  image_url: string | null
  created_at: Date
}

export interface UserInvestment {
  id: number
  user_id: number
  investment_id: number
  quantity: number
  purchase_price: number
  purchase_date: Date
}

// Choir related types
export interface Choir {
  id: number
  name: string
  description: string | null
  location: string | null
  rehearsal_day: string | null
  rehearsal_time: string | null
  image_url: string | null
  created_at: Date
}

export interface UserChoir {
  id: number
  user_id: number
  choir_id: number
  role: string
  join_date: Date
}

// Shop related types
export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  stock_quantity: number
  created_at: Date
}

export interface Order {
  id: number
  user_id: number | null
  total_amount: number
  status: string
  shipping_address: string | null
  created_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  quantity: number
  price_per_unit: number
}

export interface Specialist {
  id: number
  name: string
  expertise: string
  bio: string | null
  image_url: string | null
  contact_email: string | null
  created_at: Date
}

// Existing tables from the database
export interface AdCampaign {
  id: string
  name: string
  userId: string
  platform: string
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface AdPerformance {
  id: string
  date: Date
  impressions: number
  clicks: number
  cost: number
  conversions: number
  createdAt: Date
  updatedAt: Date
}

export interface ConversionGoal {
  id: string
  goal: string
  date: Date
  conversions: number
  conversionRate: number
  value: number
  createdAt: Date
  updatedAt: Date
}
