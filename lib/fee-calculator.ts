/**
 * Utility functions for calculating platform fees
 */

/**
 * Calculate the platform fee for a service transaction
 * @param amount The base amount of the transaction
 * @returns Object containing the fee amount and total
 */
export function calculateServiceFee(amount: number) {
  const feePercentage = 0.05 // 5% fee
  const feeAmount = Math.round(amount * feePercentage * 100) / 100 // Round to 2 decimal places
  const total = amount + feeAmount

  return {
    baseAmount: amount,
    feePercentage,
    feeAmount,
    total,
  }
}

/**
 * Calculate the platform fee for buying/selling transactions
 * @returns Object containing the fee information
 */
export function calculateTransactionFee() {
  const feeAmount = 100 // $100 fixed fee

  return {
    feeAmount,
    description: "Platform processing fee",
  }
}
