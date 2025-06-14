# 🏦 Paper Money Testing Environment

This branch (`papermoney`) is configured for **SAFE TESTING** with fake money and mock payments. **NO REAL MONEY** will be processed in this environment.

## 🎯 Purpose

The paper money branch allows you to:
- Test payment flows without real financial risk
- Validate fee calculations and pricing models
- Simulate different payment scenarios (success, failure, etc.)
- Test the freemium business model implementation
- Verify user experience for all account types

## ⚠️ Safety Features

### Environment Protection
- `PAPER_MONEY_MODE=true` - Enables test mode
- `ENABLE_REAL_PAYMENTS=false` - Blocks real payment processing
- `TESTING_MODE=true` - Activates mock services
- Visual test mode banner on all pages
- Test amount indicators throughout the UI

### Mock Payment System
- Simulated Stripe payment intents
- Test credit card numbers that behave predictably
- Configurable success/failure rates
- Realistic API response delays
- No actual money movement

## 🧪 Testing Features

### Test Credit Cards
Use these Stripe test card numbers:

| Card Type | Number | Expected Result |
|-----------|--------|-----------------|
| Visa | `4242424242424242` | Success |
| Visa Debit | `4000056655665556` | Success |
| Mastercard | `5555555555554444` | Success |
| American Express | `378282246310005` | Success |
| Declined | `4000000000000002` | Declined |
| Insufficient Funds | `4000000000009995` | Insufficient Funds |
| Expired Card | `4000000000000069` | Expired |

**Note:** Use any future expiry date and any 3-digit CVC.

### Test Amounts
Pre-configured test amounts for different scenarios:
- Small: $5.00 (500 cents)
- Medium: $25.00 (2,500 cents)
- Large: $100.00 (10,000 cents)
- Extra Large: $500.00 (50,000 cents)

### Fee Structure Testing
Test the freemium model pricing:

#### Buyers/Users
- **Cost:** FREE ✅
- **Features:** Full access to marketplace and services

#### Sellers
- **Per Listing:** $10.00 per property listing
- **Unlimited Plan:** $50.00/month for unlimited listings

#### Service Providers
- **Small Business:** 5% transaction fee
- **Large Business:** $75.00/month fixed fee

#### Platform Fees
- **Transaction Fee:** 5% on service provider transactions
- **Advertising:** $5.00/hour for ad placements

## 🚀 Getting Started

### 1. Switch to Paper Money Branch
```bash
git checkout papermoney
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
The `.env.local` file is already configured for paper money testing. Key settings:

```env
PAPER_MONEY_MODE=true
TESTING_MODE=true
ENABLE_REAL_PAYMENTS=false
ENABLE_MOCK_TRANSACTIONS=true
SHOW_TEST_MODE_BANNER=true
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Test Interface
Visit `/test-paper-money` to access the comprehensive testing interface.

## 🧪 Testing Workflows

### Payment Flow Testing
1. Navigate to `/test-paper-money`
2. Select test amount and account type
3. Run automated payment tests
4. Verify success/failure scenarios

### Fee Calculation Testing
1. Use the Fee Calculator tab
2. Test different account types
3. Verify subscription pricing
4. Check transaction fee calculations

### User Experience Testing
1. Create test accounts for each user type
2. Test marketplace listings with mock payments
3. Book services with test credit cards
4. Verify advertising system with test payments

## 📊 Test Data

### Test User Accounts
Pre-configured test accounts are available:

```typescript
testUserAccounts = {
  buyer: 'test.buyer@papermoneytest.com',
  seller: 'test.seller@papermoneytest.com',
  serviceProvider: 'test.provider@papermoneytest.com',
  admin: 'test.admin@papermoneytest.com'
}
```

### Mock Transactions
All transactions are clearly marked as test mode:
- Transaction IDs prefixed with `test_txn_`
- Payment intent IDs prefixed with `pi_test_`
- Amounts displayed with "TEST" badges
- Success rate configurable (default: 90%)

## 🔧 Configuration

### Paper Money Settings
Located in `lib/paper-money-config.ts`:

```typescript
export const testPaymentConfig = {
  successRate: 0.9, // 90% success rate
  defaultTestAmount: 1000, // $10.00
  // ... other settings
}
```

### Fee Structure
Located in `lib/paper-money-fees.ts`:

```typescript
export const testFeeStructure = {
  transactionFeePercentage: 5,
  listingFee: 1000, // $10.00
  serviceFeePercentage: 5,
  // ... other fees
}
```

## 🛡️ Safety Validations

The system includes multiple safety checks:

1. **Environment Validation:** Ensures paper money mode is properly configured
2. **Stripe Key Validation:** Verifies only test keys are used
3. **Production Block:** Prevents paper money mode in production
4. **Visual Indicators:** Clear test mode banners and badges

## 📱 UI Components

### Test Mode Banner
Displays at the top of every page when in paper money mode:
- Shows current environment status
- Provides test card information
- Displays fee structure details

### Test Amount Display
All monetary amounts are clearly marked:
- Orange text color for test amounts
- "TEST" badges next to prices
- Clear formatting: "$25.00 (TEST)"

### Test Mode Warnings
Alert components that remind users they're in test mode:
- Prominent placement on payment pages
- Clear messaging about fake money
- Instructions for using test cards

## 🔄 Switching Between Branches

### To Production Branch
```bash
git checkout production
# Configure with real Stripe keys and production settings
```

### To Main Development
```bash
git checkout main
# Continue feature development
```

### To Paper Money Testing
```bash
git checkout papermoney
# Safe testing environment
```

## 📋 Testing Checklist

Before deploying to production, verify:

- [ ] All payment flows work with test cards
- [ ] Fee calculations are accurate
- [ ] Subscription plans function correctly
- [ ] Advertising system processes test payments
- [ ] User roles and permissions work properly
- [ ] Error handling for failed payments
- [ ] Success flows for completed payments
- [ ] Email notifications (if configured)
- [ ] Database transactions are recorded correctly
- [ ] UI clearly indicates test mode throughout

## 🆘 Troubleshooting

### Common Issues

**Test Mode Banner Not Showing**
- Check `SHOW_TEST_MODE_BANNER=true` in `.env.local`
- Verify `PAPER_MONEY_MODE=true` is set

**Payments Not Working**
- Ensure `ENABLE_MOCK_TRANSACTIONS=true`
- Check that Stripe keys start with `sk_test_` and `pk_test_`
- Verify test card numbers are entered correctly

**Fee Calculations Incorrect**
- Review `lib/paper-money-fees.ts` configuration
- Check account type selection
- Verify percentage calculations

## 📞 Support

For issues with the paper money testing environment:
1. Check the validation errors in `/test-paper-money`
2. Review environment variables in `.env.local`
3. Verify branch is set to `papermoney`
4. Check console logs for detailed error messages

---

**Remember:** This is a TESTING environment. No real money will be charged, and all transactions are simulated for safe development and testing purposes.
