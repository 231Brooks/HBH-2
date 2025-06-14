/**
 * Paper Money Configuration
 * 
 * This file contains all configuration for the paper money testing environment.
 * It ensures safe testing with fake payments and mock data.
 */

// Environment checks
export const isPaperMoneyMode = process.env.PAPER_MONEY_MODE === 'true'
export const isTestingMode = process.env.TESTING_MODE === 'true'
export const enableRealPayments = process.env.ENABLE_REAL_PAYMENTS === 'true'
export const enableMockTransactions = process.env.ENABLE_MOCK_TRANSACTIONS === 'true'
export const showTestModeBanner = process.env.SHOW_TEST_MODE_BANNER === 'true'

// Test payment configuration
export const testPaymentConfig = {
  // Stripe test keys (these should be actual Stripe test keys in production)
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_paper_money_key',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_paper_money_key',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_paper_money',
  
  // Mock payment settings
  successRate: parseFloat(process.env.MOCK_PAYMENT_SUCCESS_RATE || '0.9'),
  defaultTestAmount: parseInt(process.env.DEFAULT_TEST_AMOUNT || '1000'), // $10.00
  
  // Test credit card numbers (Stripe test cards)
  testCards: {
    visa: '4242424242424242',
    visaDebit: '4000056655665556',
    mastercard: '5555555555554444',
    amex: '378282246310005',
    declined: '4000000000000002',
    insufficientFunds: '4000000000009995',
    expired: '4000000000000069',
  }
}

// Test fee structure
export const testFeeStructure = {
  transactionFeePercentage: parseInt(process.env.TEST_TRANSACTION_FEE_PERCENTAGE || '5'),
  listingFee: parseInt(process.env.TEST_LISTING_FEE || '1000'), // $10.00
  serviceFeePercentage: parseInt(process.env.TEST_SERVICE_FEE_PERCENTAGE || '5'),
  
  // Freemium model test pricing
  sellerPlans: {
    perListing: 1000, // $10.00 per listing
    unlimited: 5000,  // $50.00 per month
  },
  
  serviceProviderPlans: {
    smallBusiness: {
      type: 'percentage',
      value: 5, // 5% transaction fee
    },
    largeBusiness: {
      type: 'monthly',
      value: 7500, // $75.00 per month
    }
  }
}

// Mock transaction amounts for testing
export const mockTransactionAmounts = {
  small: 500,    // $5.00
  medium: 2500,  // $25.00
  large: 10000,  // $100.00
  xlarge: 50000, // $500.00
}

// Test user accounts
export const testUserAccounts = {
  buyer: {
    email: 'test.buyer@papermoneytest.com',
    name: 'Test Buyer',
    accountType: 'buyer',
  },
  seller: {
    email: 'test.seller@papermoneytest.com',
    name: 'Test Seller',
    accountType: 'seller',
  },
  serviceProvider: {
    email: 'test.provider@papermoneytest.com',
    name: 'Test Service Provider',
    accountType: 'service_provider',
  },
  admin: {
    email: 'test.admin@papermoneytest.com',
    name: 'Test Admin',
    accountType: 'admin',
  }
}

// Mock payment responses
export const mockPaymentResponses = {
  success: {
    status: 'succeeded',
    amount: testPaymentConfig.defaultTestAmount,
    currency: 'usd',
    payment_method: 'card',
    created: Math.floor(Date.now() / 1000),
  },
  
  failed: {
    status: 'failed',
    last_payment_error: {
      code: 'card_declined',
      message: 'Your card was declined.',
      type: 'card_error',
    }
  },
  
  processing: {
    status: 'processing',
    amount: testPaymentConfig.defaultTestAmount,
    currency: 'usd',
  }
}

// Safety checks
export function validatePaperMoneyEnvironment() {
  const errors: string[] = []
  
  if (!isPaperMoneyMode) {
    errors.push('PAPER_MONEY_MODE is not enabled')
  }
  
  if (enableRealPayments) {
    errors.push('ENABLE_REAL_PAYMENTS should be false in paper money mode')
  }
  
  if (process.env.NODE_ENV === 'production' && isPaperMoneyMode) {
    errors.push('Paper money mode should not be used in production')
  }
  
  // Check for test Stripe keys
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    errors.push('Stripe secret key should be a test key (sk_test_) in paper money mode')
  }
  
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
    errors.push('Stripe publishable key should be a test key (pk_test_) in paper money mode')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Utility functions
export function formatTestAmount(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)} (TEST)`
}

export function generateTestTransactionId(): string {
  return `test_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateTestPaymentIntentId(): string {
  return `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Export configuration summary
export const paperMoneyConfig = {
  mode: {
    isPaperMoney: isPaperMoneyMode,
    isTesting: isTestingMode,
    enableReal: enableRealPayments,
    enableMock: enableMockTransactions,
    showBanner: showTestModeBanner,
  },
  payments: testPaymentConfig,
  fees: testFeeStructure,
  amounts: mockTransactionAmounts,
  users: testUserAccounts,
  responses: mockPaymentResponses,
  validate: validatePaperMoneyEnvironment,
  utils: {
    formatAmount: formatTestAmount,
    generateTransactionId: generateTestTransactionId,
    generatePaymentIntentId: generateTestPaymentIntentId,
  }
}
