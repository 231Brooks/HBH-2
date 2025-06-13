import { AdLocation } from "@prisma/client"

export interface AdPricingOptions {
  location: AdLocation
  duration: number // in hours
  slots: number // number of ad slots (1-5)
  startDate: Date
  endDate: Date
}

export interface AdPricingResult {
  basePrice: number
  locationMultiplier: number
  durationDiscount: number
  slotMultiplier: number
  totalCost: number
  breakdown: {
    baseCost: number
    locationAdjustment: number
    durationDiscount: number
    slotCost: number
    finalTotal: number
  }
}

// Base pricing configuration
export const AD_PRICING_CONFIG = {
  baseHourlyRate: 5, // $5 per hour per slot
  locationMultipliers: {
    BOTTOM_GLOBAL: 1.5, // 50% premium for global bottom ads
    FRONTPAGE: 2.0, // 100% premium for front page
    SERVICES: 1.2, // 20% premium for services section
    MARKETPLACE: 1.3, // 30% premium for marketplace
    SIDEBAR: 1.0, // Base rate for sidebar
  },
  durationDiscounts: {
    // Discounts based on total duration
    24: 0.05, // 5% discount for 24+ hours
    72: 0.10, // 10% discount for 72+ hours (3 days)
    168: 0.15, // 15% discount for 168+ hours (1 week)
    720: 0.20, // 20% discount for 720+ hours (1 month)
  },
  slotDiscounts: {
    // Discounts for buying multiple slots
    1: 0, // No discount for single slot
    2: 0.05, // 5% discount for 2 slots
    3: 0.10, // 10% discount for 3 slots
    4: 0.15, // 15% discount for 4 slots
    5: 0.20, // 20% discount for all 5 slots
  },
  maxSlotsPerLocation: 5,
}

export function calculateAdPricing(options: AdPricingOptions): AdPricingResult {
  const { location, duration, slots } = options
  const config = AD_PRICING_CONFIG

  // Validate inputs
  if (slots < 1 || slots > config.maxSlotsPerLocation) {
    throw new Error(`Slots must be between 1 and ${config.maxSlotsPerLocation}`)
  }

  if (duration < 1) {
    throw new Error("Duration must be at least 1 hour")
  }

  // Base calculation
  const basePrice = config.baseHourlyRate
  const locationMultiplier = config.locationMultipliers[location] || 1.0

  // Calculate duration discount
  let durationDiscount = 0
  const discountTiers = Object.entries(config.durationDiscounts)
    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort descending

  for (const [hours, discount] of discountTiers) {
    if (duration >= parseInt(hours)) {
      durationDiscount = discount as number
      break
    }
  }

  // Calculate slot discount
  const slotDiscount = config.slotDiscounts[slots as keyof typeof config.slotDiscounts] || 0

  // Pricing breakdown
  const baseCost = basePrice * duration * slots
  const locationAdjustment = baseCost * (locationMultiplier - 1)
  const durationDiscountAmount = baseCost * durationDiscount
  const slotDiscountAmount = baseCost * slotDiscount
  
  const subtotal = baseCost + locationAdjustment
  const totalDiscounts = durationDiscountAmount + slotDiscountAmount
  const finalTotal = Math.max(subtotal - totalDiscounts, basePrice) // Minimum of base price

  return {
    basePrice,
    locationMultiplier,
    durationDiscount,
    slotMultiplier: 1 - slotDiscount,
    totalCost: finalTotal,
    breakdown: {
      baseCost,
      locationAdjustment,
      durationDiscount: totalDiscounts,
      slotCost: baseCost,
      finalTotal,
    },
  }
}
