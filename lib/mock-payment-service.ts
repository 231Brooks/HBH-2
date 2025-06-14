/**
 * Mock Payment Service for Paper Money Testing
 * 
 * This service simulates payment processing without real money transactions.
 * It provides realistic responses and behaviors for testing payment flows.
 */

import { paperMoneyConfig } from './paper-money-config'

export interface MockPaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled' | 'failed'
  client_secret: string
  metadata: Record<string, string>
  created: number
  last_payment_error?: {
    code: string
    message: string
    type: string
  }
}

export interface MockPaymentMethod {
  id: string
  type: 'card'
  card: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

class MockPaymentService {
  private paymentIntents: Map<string, MockPaymentIntent> = new Map()
  private paymentMethods: Map<string, MockPaymentMethod> = new Map()

  /**
   * Create a mock payment intent
   */
  async createPaymentIntent(params: {
    amount: number
    currency?: string
    metadata?: Record<string, string>
  }): Promise<MockPaymentIntent> {
    if (!paperMoneyConfig.mode.isPaperMoney) {
      throw new Error('Mock payment service can only be used in paper money mode')
    }

    const id = paperMoneyConfig.utils.generatePaymentIntentId()
    const clientSecret = `${id}_secret_${Math.random().toString(36).substr(2, 9)}`

    const paymentIntent: MockPaymentIntent = {
      id,
      amount: params.amount,
      currency: params.currency || 'usd',
      status: 'requires_payment_method',
      client_secret: clientSecret,
      metadata: params.metadata || {},
      created: Math.floor(Date.now() / 1000),
    }

    this.paymentIntents.set(id, paymentIntent)

    // Simulate API delay
    await this.simulateDelay(200, 500)

    return paymentIntent
  }

  /**
   * Confirm a payment intent with a payment method
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<MockPaymentIntent> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId)
    if (!paymentIntent) {
      throw new Error('Payment intent not found')
    }

    const paymentMethod = this.paymentMethods.get(paymentMethodId)
    if (!paymentMethod) {
      throw new Error('Payment method not found')
    }

    // Simulate processing
    paymentIntent.status = 'processing'
    await this.simulateDelay(1000, 2000)

    // Determine success based on test card and success rate
    const shouldSucceed = this.shouldPaymentSucceed(paymentMethod)

    if (shouldSucceed) {
      paymentIntent.status = 'succeeded'
    } else {
      paymentIntent.status = 'failed'
      paymentIntent.last_payment_error = this.generatePaymentError(paymentMethod)
    }

    this.paymentIntents.set(paymentIntentId, paymentIntent)
    return paymentIntent
  }

  /**
   * Create a mock payment method
   */
  async createPaymentMethod(cardNumber: string): Promise<MockPaymentMethod> {
    const id = `pm_test_${Math.random().toString(36).substr(2, 9)}`
    const brand = this.getCardBrand(cardNumber)
    const last4 = cardNumber.slice(-4)

    const paymentMethod: MockPaymentMethod = {
      id,
      type: 'card',
      card: {
        brand,
        last4,
        exp_month: 12,
        exp_year: new Date().getFullYear() + 2,
      }
    }

    this.paymentMethods.set(id, paymentMethod)
    await this.simulateDelay(100, 300)

    return paymentMethod
  }

  /**
   * Retrieve a payment intent
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<MockPaymentIntent> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId)
    if (!paymentIntent) {
      throw new Error('Payment intent not found')
    }

    await this.simulateDelay(100, 200)
    return paymentIntent
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<MockPaymentIntent> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId)
    if (!paymentIntent) {
      throw new Error('Payment intent not found')
    }

    paymentIntent.status = 'canceled'
    this.paymentIntents.set(paymentIntentId, paymentIntent)

    await this.simulateDelay(100, 200)
    return paymentIntent
  }

  /**
   * Get test credit card numbers
   */
  getTestCards() {
    return paperMoneyConfig.payments.testCards
  }

  /**
   * Check if a card number is a test card
   */
  isTestCard(cardNumber: string): boolean {
    const testCards = Object.values(paperMoneyConfig.payments.testCards)
    return testCards.includes(cardNumber)
  }

  private shouldPaymentSucceed(paymentMethod: MockPaymentMethod): boolean {
    const { card } = paymentMethod
    const testCards = paperMoneyConfig.payments.testCards

    // Check for specific test card behaviors
    if (card.last4 === testCards.declined.slice(-4)) {
      return false
    }
    if (card.last4 === testCards.insufficientFunds.slice(-4)) {
      return false
    }
    if (card.last4 === testCards.expired.slice(-4)) {
      return false
    }

    // Use configured success rate for other cards
    return Math.random() < paperMoneyConfig.payments.successRate
  }

  private generatePaymentError(paymentMethod: MockPaymentMethod): {
    code: string
    message: string
    type: string
  } {
    const { card } = paymentMethod
    const testCards = paperMoneyConfig.payments.testCards

    if (card.last4 === testCards.declined.slice(-4)) {
      return {
        code: 'card_declined',
        message: 'Your card was declined.',
        type: 'card_error'
      }
    }

    if (card.last4 === testCards.insufficientFunds.slice(-4)) {
      return {
        code: 'insufficient_funds',
        message: 'Your card has insufficient funds.',
        type: 'card_error'
      }
    }

    if (card.last4 === testCards.expired.slice(-4)) {
      return {
        code: 'expired_card',
        message: 'Your card has expired.',
        type: 'card_error'
      }
    }

    return {
      code: 'generic_decline',
      message: 'Your payment could not be processed.',
      type: 'card_error'
    }
  }

  private getCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber.charAt(0)
    const firstTwo = cardNumber.substring(0, 2)

    if (firstDigit === '4') return 'visa'
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'mastercard'
    if (['34', '37'].includes(firstTwo)) return 'amex'
    if (firstTwo === '60') return 'discover'

    return 'unknown'
  }

  private async simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}

// Export singleton instance
export const mockPaymentService = new MockPaymentService()

// Helper functions for testing
export function generateTestTransaction(amount?: number) {
  const testAmount = amount || paperMoneyConfig.amounts.medium
  return {
    id: paperMoneyConfig.utils.generateTransactionId(),
    amount: testAmount,
    currency: 'usd',
    status: 'test_transaction',
    created: new Date().toISOString(),
    description: `Test transaction for ${paperMoneyConfig.utils.formatAmount(testAmount)}`,
  }
}

export function createTestPaymentScenarios() {
  return {
    successful: {
      cardNumber: paperMoneyConfig.payments.testCards.visa,
      expectedResult: 'succeeded'
    },
    declined: {
      cardNumber: paperMoneyConfig.payments.testCards.declined,
      expectedResult: 'failed'
    },
    insufficientFunds: {
      cardNumber: paperMoneyConfig.payments.testCards.insufficientFunds,
      expectedResult: 'failed'
    },
    expired: {
      cardNumber: paperMoneyConfig.payments.testCards.expired,
      expectedResult: 'failed'
    }
  }
}
