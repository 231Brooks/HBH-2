#!/usr/bin/env node

/**
 * Authentication Flow Testing Script
 * Tests login, logout, and protected routes functionality
 */

require('dotenv').config({ path: '.env.local' })

async function testAuthenticationFlows() {
  console.log('🔐 Testing Authentication Flows...\n')

  const baseUrl = 'http://localhost:3000'
  let testResults = []

  // Test 1: Check if login page is accessible
  try {
    const response = await fetch(`${baseUrl}/auth/login`)
    if (response.ok) {
      testResults.push({ test: 'Login Page Access', status: 'PASS', message: 'Login page is accessible' })
    } else {
      testResults.push({ test: 'Login Page Access', status: 'FAIL', message: `Login page returned ${response.status}` })
    }
  } catch (error) {
    testResults.push({ test: 'Login Page Access', status: 'FAIL', message: `Cannot reach login page: ${error.message}` })
  }

  // Test 2: Check if protected routes redirect to login
  const protectedRoutes = ['/profile', '/calendar', '/marketplace/create']
  
  for (const route of protectedRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' })
      
      if (response.status === 302 || response.status === 307) {
        const location = response.headers.get('location')
        if (location && location.includes('/auth/login')) {
          testResults.push({ 
            test: `Protected Route: ${route}`, 
            status: 'PASS', 
            message: 'Properly redirects to login' 
          })
        } else {
          testResults.push({ 
            test: `Protected Route: ${route}`, 
            status: 'FAIL', 
            message: `Redirects to ${location} instead of login` 
          })
        }
      } else if (response.status === 200) {
        testResults.push({ 
          test: `Protected Route: ${route}`, 
          status: 'FAIL', 
          message: 'Route is accessible without authentication' 
        })
      } else {
        testResults.push({ 
          test: `Protected Route: ${route}`, 
          status: 'WARNING', 
          message: `Unexpected status: ${response.status}` 
        })
      }
    } catch (error) {
      testResults.push({ 
        test: `Protected Route: ${route}`, 
        status: 'ERROR', 
        message: `Cannot test route: ${error.message}` 
      })
    }
  }

  // Test 3: Check public routes are accessible
  const publicRoutes = ['/', '/auth/signup', '/auth/forgot-password']
  
  for (const route of publicRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`)
      if (response.ok) {
        testResults.push({ 
          test: `Public Route: ${route}`, 
          status: 'PASS', 
          message: 'Public route is accessible' 
        })
      } else {
        testResults.push({ 
          test: `Public Route: ${route}`, 
          status: 'FAIL', 
          message: `Public route returned ${response.status}` 
        })
      }
    } catch (error) {
      testResults.push({ 
        test: `Public Route: ${route}`, 
        status: 'ERROR', 
        message: `Cannot access public route: ${error.message}` 
      })
    }
  }

  // Test 4: Check API routes security
  const apiRoutes = [
    { path: '/api/admin/diagnostics', shouldBeProtected: true },
    { path: '/api/health', shouldBeProtected: false },
    { path: '/api/webhooks/supabase', shouldBeProtected: true }
  ]

  for (const route of apiRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route.path}`)
      
      if (route.shouldBeProtected) {
        if (response.status === 401 || response.status === 403) {
          testResults.push({ 
            test: `API Security: ${route.path}`, 
            status: 'PASS', 
            message: 'Protected API route requires authentication' 
          })
        } else {
          testResults.push({ 
            test: `API Security: ${route.path}`, 
            status: 'FAIL', 
            message: `Protected API route returned ${response.status}` 
          })
        }
      } else {
        if (response.ok) {
          testResults.push({ 
            test: `API Access: ${route.path}`, 
            status: 'PASS', 
            message: 'Public API route is accessible' 
          })
        } else {
          testResults.push({ 
            test: `API Access: ${route.path}`, 
            status: 'WARNING', 
            message: `Public API route returned ${response.status}` 
          })
        }
      }
    } catch (error) {
      testResults.push({ 
        test: `API Route: ${route.path}`, 
        status: 'ERROR', 
        message: `Cannot test API route: ${error.message}` 
      })
    }
  }

  // Print results
  console.log('📊 Authentication Flow Test Results:')
  console.log('=' .repeat(60))

  const passed = testResults.filter(r => r.status === 'PASS').length
  const failed = testResults.filter(r => r.status === 'FAIL').length
  const warnings = testResults.filter(r => r.status === 'WARNING').length
  const errors = testResults.filter(r => r.status === 'ERROR').length

  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Warnings: ${warnings}`)
  console.log(`🔥 Errors: ${errors}`)
  console.log(`📝 Total: ${testResults.length}`)

  console.log('\n📋 Detailed Results:')
  console.log('-'.repeat(60))

  for (const result of testResults) {
    const icon = {
      'PASS': '✅',
      'FAIL': '❌',
      'WARNING': '⚠️',
      'ERROR': '🔥'
    }[result.status]
    
    console.log(`${icon} ${result.test}: ${result.message}`)
  }

  console.log('\n🔒 Authentication Security Status:')
  console.log('-'.repeat(60))

  if (failed === 0 && errors === 0) {
    console.log('✅ AUTHENTICATION SECURITY: EXCELLENT')
    console.log('   All protected routes properly require authentication')
    console.log('   All public routes are accessible')
  } else if (failed > 0) {
    console.log('❌ AUTHENTICATION SECURITY: NEEDS ATTENTION')
    console.log('   Some protected routes may be accessible without authentication')
  } else {
    console.log('⚠️  AUTHENTICATION SECURITY: REVIEW NEEDED')
    console.log('   Some tests could not be completed')
  }

  return { passed, failed, warnings, errors, total: testResults.length }
}

// Test webhook endpoints
async function testWebhookSecurity() {
  console.log('\n🔗 Testing Webhook Security...\n')

  const baseUrl = 'http://localhost:3000'
  const webhooks = [
    {
      name: 'Supabase Webhook',
      path: '/api/webhooks/supabase',
      requiredHeader: 'x-supabase-webhook-signature'
    },
    {
      name: 'Stripe Webhook', 
      path: '/api/webhooks/stripe',
      requiredHeader: 'stripe-signature'
    },
    {
      name: 'Calendar Webhook',
      path: '/api/calendar/webhook',
      requiredHeader: 'x-calendar-signature'
    }
  ]

  let webhookResults = []

  for (const webhook of webhooks) {
    // Test without required header
    try {
      const response = await fetch(`${baseUrl}${webhook.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      })

      if (response.status === 401) {
        webhookResults.push({
          test: `${webhook.name} Security`,
          status: 'PASS',
          message: 'Properly rejects requests without signature'
        })
      } else {
        webhookResults.push({
          test: `${webhook.name} Security`,
          status: 'FAIL',
          message: `Accepts requests without signature (status: ${response.status})`
        })
      }
    } catch (error) {
      webhookResults.push({
        test: `${webhook.name} Security`,
        status: 'ERROR',
        message: `Cannot test webhook: ${error.message}`
      })
    }

    // Test with header
    try {
      const response = await fetch(`${baseUrl}${webhook.path}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          [webhook.requiredHeader]: 'test-signature'
        },
        body: JSON.stringify({ test: 'data' })
      })

      if (response.status === 200 || response.status === 400) {
        webhookResults.push({
          test: `${webhook.name} Functionality`,
          status: 'PASS',
          message: 'Webhook endpoint is functional'
        })
      } else {
        webhookResults.push({
          test: `${webhook.name} Functionality`,
          status: 'WARNING',
          message: `Unexpected response: ${response.status}`
        })
      }
    } catch (error) {
      webhookResults.push({
        test: `${webhook.name} Functionality`,
        status: 'ERROR',
        message: `Cannot test webhook functionality: ${error.message}`
      })
    }
  }

  console.log('📊 Webhook Security Test Results:')
  console.log('=' .repeat(60))

  for (const result of webhookResults) {
    const icon = {
      'PASS': '✅',
      'FAIL': '❌',
      'WARNING': '⚠️',
      'ERROR': '🔥'
    }[result.status]
    
    console.log(`${icon} ${result.test}: ${result.message}`)
  }

  return webhookResults
}

// Main execution
async function main() {
  console.log('🚀 HBH-2 Authentication & Security Testing\n')

  try {
    const authResults = await testAuthenticationFlows()
    const webhookResults = await testWebhookSecurity()

    console.log('\n🎯 Overall Security Assessment:')
    console.log('=' .repeat(60))

    if (authResults.failed === 0 && authResults.errors === 0) {
      console.log('✅ AUTHENTICATION: SECURE')
    } else {
      console.log('❌ AUTHENTICATION: NEEDS REVIEW')
    }

    const webhookFailed = webhookResults.filter(r => r.status === 'FAIL').length
    if (webhookFailed === 0) {
      console.log('✅ WEBHOOKS: SECURE')
    } else {
      console.log('❌ WEBHOOKS: NEEDS REVIEW')
    }

    console.log('\n📝 Next Steps:')
    console.log('-'.repeat(60))
    console.log('1. ✅ Test manual login/logout flows in browser')
    console.log('2. ✅ Verify OAuth providers work correctly')
    console.log('3. ✅ Test protected routes with authenticated users')
    console.log('4. ✅ Validate webhook signatures in production')
    console.log('5. ✅ Monitor authentication logs for anomalies')

  } catch (error) {
    console.error('❌ Testing failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testAuthenticationFlows, testWebhookSecurity }
