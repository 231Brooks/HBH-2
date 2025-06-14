/**
 * Paper Money Fee Calculator
 * 
 * This module handles fee calculations for the paper money testing environment.
 * All fees are simulated and clearly marked as test amounts.
 */

import { paperMoneyConfig } from './paper-money-config'

export interface FeeCalculation {
  baseAmount: number
  platformFee: number
  transactionFee: number
  totalFees: number
  totalAmount: number
  breakdown: {
    description: string
    amount: number
    type: 'base' | 'platform_fee' | 'transaction_fee'
  }[]
  isTestMode: boolean
}

export interface SubscriptionPricing {
  plan: string
  amount: number
  period: 'monthly' | 'per_listing' | 'percentage'
  description: string
  isTestMode: boolean
}

/**
 * Calculate transaction fees for paper money testing
 */
export function calculateTestTransactionFees(
  baseAmount: number,
  accountType: 'buyer' | 'seller' | 'service_provider' | 'admin' = 'buyer'
): FeeCalculation {
  const fees = paperMoneyConfig.fees

  let platformFee = 0
  let transactionFee = 0

  // Calculate fees based on account type
  switch (accountType) {
    case 'buyer':
      // Buyers pay no fees in freemium model
      platformFee = 0
      transactionFee = 0
      break

    case 'seller':
      // Sellers pay listing fees (handled separately) but no transaction fees
      platformFee = 0
      transactionFee = 0
      break

    case 'service_provider':
      // Service providers pay percentage-based fees
      platformFee = Math.round(baseAmount * (fees.serviceFeePercentage / 100))
      transactionFee = Math.round(baseAmount * (fees.transactionFeePercentage / 100))
      break

    case 'admin':
      // Admins pay no fees
      platformFee = 0
      transactionFee = 0
      break
  }

  const totalFees = platformFee + transactionFee
  const totalAmount = baseAmount + totalFees

  const breakdown = [
    {
      description: 'Base Amount',
      amount: baseAmount,
      type: 'base' as const
    }
  ]

  if (platformFee > 0) {
    breakdown.push({
      description: `Platform Fee (${fees.serviceFeePercentage}%)`,
      amount: platformFee,
      type: 'platform_fee' as const
    })
  }

  if (transactionFee > 0) {
    breakdown.push({
      description: `Transaction Fee (${fees.transactionFeePercentage}%)`,
      amount: transactionFee,
      type: 'transaction_fee' as const
    })
  }

  return {
    baseAmount,
    platformFee,
    transactionFee,
    totalFees,
    totalAmount,
    breakdown,
    isTestMode: true
  }
}

/**
 * Get subscription pricing for different account types
 */
export function getTestSubscriptionPricing(
  accountType: 'seller' | 'service_provider'
): SubscriptionPricing[] {
  const fees = paperMoneyConfig.fees

  switch (accountType) {
    case 'seller':
      return [
        {
          plan: 'Per Listing',
          amount: fees.listingFee,
          period: 'per_listing',
          description: 'Pay per property listing',
          isTestMode: true
        },
        {
          plan: 'Unlimited Monthly',
          amount: fees.sellerPlans.unlimited,
          period: 'monthly',
          description: 'Unlimited listings per month',
          isTestMode: true
        }
      ]

    case 'service_provider':
      return [
        {
          plan: 'Small Business',
          amount: fees.serviceProviderPlans.smallBusiness.value,
          period: 'percentage',
          description: `${fees.serviceProviderPlans.smallBusiness.value}% per transaction`,
          isTestMode: true
        },
        {
          plan: 'Large Business',
          amount: fees.serviceProviderPlans.largeBusiness.value,
          period: 'monthly',
          description: 'Fixed monthly fee for unlimited transactions',
          isTestMode: true
        }
      ]

    default:
      return []
  }
}

/**
 * Calculate listing fees for sellers
 */
export function calculateTestListingFees(
  numberOfListings: number,
  subscriptionPlan: 'per_listing' | 'unlimited' = 'per_listing'
): FeeCalculation {
  const fees = paperMoneyConfig.fees

  let totalAmount = 0
  let breakdown: FeeCalculation['breakdown'] = []

  if (subscriptionPlan === 'per_listing') {
    totalAmount = numberOfListings * fees.listingFee
    breakdown = [
      {
        description: `${numberOfListings} Listing${numberOfListings > 1 ? 's' : ''} × $${(fees.listingFee / 100).toFixed(2)}`,
        amount: totalAmount,
        type: 'base'
      }
    ]
  } else {
    totalAmount = fees.sellerPlans.unlimited
    breakdown = [
      {
        description: 'Unlimited Monthly Plan',
        amount: totalAmount,
        type: 'base'
      }
    ]
  }

  return {
    baseAmount: totalAmount,
    platformFee: 0,
    transactionFee: 0,
    totalFees: 0,
    totalAmount,
    breakdown,
    isTestMode: true
  }
}

/**
 * Calculate advertising fees
 */
export function calculateTestAdvertisingFees(
  hours: number,
  location: 'frontpage' | 'services' | 'marketplace' = 'frontpage',
  slots: number = 1
): FeeCalculation {
  // $5 per hour as specified in requirements
  const hourlyRate = 500 // $5.00 in cents
  const baseAmount = hours * hourlyRate * slots

  const breakdown = [
    {
      description: `${hours} hour${hours > 1 ? 's' : ''} × ${slots} slot${slots > 1 ? 's' : ''} × $${(hourlyRate / 100).toFixed(2)}/hour`,
      amount: baseAmount,
      type: 'base' as const
    }
  ]

  return {
    baseAmount,
    platformFee: 0,
    transactionFee: 0,
    totalFees: 0,
    totalAmount: baseAmount,
    breakdown,
    isTestMode: true
  }
}

/**
 * Format fee calculation for display
 */
export function formatTestFeeCalculation(calculation: FeeCalculation): string {
  const lines = calculation.breakdown.map(item => 
    `${item.description}: ${paperMoneyConfig.utils.formatAmount(item.amount)}`
  )

  if (calculation.totalFees > 0) {
    lines.push(`Total Fees: ${paperMoneyConfig.utils.formatAmount(calculation.totalFees)}`)
  }

  lines.push(`Total: ${paperMoneyConfig.utils.formatAmount(calculation.totalAmount)}`)
  
  if (calculation.isTestMode) {
    lines.push('⚠️ TEST MODE - No real money will be charged')
  }

  return lines.join('\n')
}

/**
 * Get test payment scenarios with different amounts
 */
export function getTestPaymentScenarios() {
  const amounts = paperMoneyConfig.amounts

  return {
    small: {
      amount: amounts.small,
      description: 'Small transaction',
      fees: calculateTestTransactionFees(amounts.small, 'service_provider')
    },
    medium: {
      amount: amounts.medium,
      description: 'Medium transaction',
      fees: calculateTestTransactionFees(amounts.medium, 'service_provider')
    },
    large: {
      amount: amounts.large,
      description: 'Large transaction',
      fees: calculateTestTransactionFees(amounts.large, 'service_provider')
    },
    xlarge: {
      amount: amounts.xlarge,
      description: 'Extra large transaction',
      fees: calculateTestTransactionFees(amounts.xlarge, 'service_provider')
    }
  }
}

/**
 * Validate that we're in paper money mode before processing fees
 */
export function validatePaperMoneyFeeCalculation(): boolean {
  if (!paperMoneyConfig.mode.isPaperMoney) {
    throw new Error('Paper money fee calculations can only be used in paper money mode')
  }
  return true
}
