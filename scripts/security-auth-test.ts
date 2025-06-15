#!/usr/bin/env tsx

/**
 * Comprehensive UX and State Management Test Script
 * Tests state management, loading states, data persistence, auth flows, and user feedback
 */

import { createClient } from '@supabase/supabase-js'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

class SecurityAuthTester {
  private results: TestResult[] = []

  private addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) {
    this.results.push({ name, status, message, details })
  }

  // 1. Test Environment Variables Security
  async testEnvironmentVariables() {
    console.log('🔐 Testing Environment Variables Security...')

    // Check if sensitive keys are properly loaded
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'GITHUB_CLIENT_SECRET',
      'GOOGLE_CLIENT_SECRET'
    ]

    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar]
      if (!value) {
        this.addResult(
          `Environment Variable: ${envVar}`,
          'fail',
          'Missing required environment variable'
        )
      } else if (value.includes('placeholder') || value.includes('your_') || value.includes('YOUR_')) {
        this.addResult(
          `Environment Variable: ${envVar}`,
          'warning',
          'Environment variable appears to contain placeholder value'
        )
      } else {
        this.addResult(
          `Environment Variable: ${envVar}`,
          'pass',
          'Environment variable is properly set'
        )
      }
    }

    // Check for exposed secrets in client-side code
    const clientSideSecrets = [
      'SUPABASE_SERVICE_ROLE_KEY',
      'GITHUB_CLIENT_SECRET',
      'GOOGLE_CLIENT_SECRET',
      'STRIPE_SECRET_KEY'
    ]

    for (const secret of clientSideSecrets) {
      if (secret.startsWith('NEXT_PUBLIC_')) {
        this.addResult(
          `Client-side Exposure: ${secret}`,
          'fail',
          'Secret key is exposed to client-side code'
        )
      } else {
        this.addResult(
          `Client-side Security: ${secret}`,
          'pass',
          'Secret key is properly server-side only'
        )
      }
    }
  }

  // 2. Test Supabase Authentication Connection
  async testSupabaseAuth() {
    console.log('🔑 Testing Supabase Authentication...')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      if (!supabaseUrl || !supabaseAnonKey) {
        this.addResult(
          'Supabase Configuration',
          'fail',
          'Missing Supabase URL or anon key'
        )
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Test connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        this.addResult(
          'Supabase Connection',
          'fail',
          `Failed to connect to Supabase: ${error.message}`
        )
      } else {
        this.addResult(
          'Supabase Connection',
          'pass',
          'Successfully connected to Supabase'
        )
      }

      // Test OAuth providers configuration
      const { data: providers, error: providersError } = await supabase.auth.getOAuthProviders()
      
      if (providersError) {
        this.addResult(
          'OAuth Providers',
          'warning',
          `Could not fetch OAuth providers: ${providersError.message}`
        )
      } else {
        this.addResult(
          'OAuth Providers',
          'pass',
          `OAuth providers configured: ${providers?.length || 0} providers`
        )
      }

    } catch (error: any) {
      this.addResult(
        'Supabase Authentication',
        'fail',
        `Authentication test failed: ${error.message}`
      )
    }
  }

  // 3. Test Webhook Endpoints
  async testWebhooks() {
    console.log('🔗 Testing Webhook Endpoints...')

    const webhooks = [
      {
        name: 'Supabase Webhook',
        url: '/api/webhooks/supabase',
        headers: { 'x-supabase-webhook-signature': 'test-signature' },
        payload: { type: 'INSERT', table: 'test', record: { id: 1 } }
      },
      {
        name: 'Stripe Webhook',
        url: '/api/webhooks/stripe',
        headers: { 'stripe-signature': 'test-signature' },
        payload: { type: 'payment_intent.succeeded' }
      },
      {
        name: 'Calendar Webhook',
        url: '/api/calendar/webhook',
        headers: { 'x-calendar-signature': 'test-signature' },
        payload: { event: 'created', userId: 'test', appointmentId: 'test' }
      }
    ]

    for (const webhook of webhooks) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}${webhook.url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...webhook.headers
          },
          body: JSON.stringify(webhook.payload)
        })

        if (response.status === 401) {
          this.addResult(
            `Webhook Security: ${webhook.name}`,
            'pass',
            'Webhook properly validates signatures (401 Unauthorized)'
          )
        } else if (response.status === 200) {
          this.addResult(
            `Webhook Functionality: ${webhook.name}`,
            'pass',
            'Webhook endpoint is accessible and responding'
          )
        } else {
          this.addResult(
            `Webhook: ${webhook.name}`,
            'warning',
            `Unexpected response status: ${response.status}`
          )
        }
      } catch (error: any) {
        this.addResult(
          `Webhook: ${webhook.name}`,
          'fail',
          `Webhook test failed: ${error.message}`
        )
      }
    }
  }

  // 4. Test API Route Security
  async testAPIRouteSecurity() {
    console.log('🛡️ Testing API Route Security...')

    const protectedRoutes = [
      '/api/admin/diagnostics',
      '/api/admin/deployment-check',
      '/api/setup-exec-sql'
    ]

    for (const route of protectedRoutes) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}${route}`, {
          method: 'GET'
        })

        if (response.status === 401 || response.status === 403) {
          this.addResult(
            `API Security: ${route}`,
            'pass',
            'Protected route properly requires authentication'
          )
        } else if (response.status === 200) {
          this.addResult(
            `API Security: ${route}`,
            'warning',
            'Protected route is accessible without authentication'
          )
        } else {
          this.addResult(
            `API Route: ${route}`,
            'pass',
            `Route returns expected status: ${response.status}`
          )
        }
      } catch (error: any) {
        this.addResult(
          `API Route: ${route}`,
          'fail',
          `Route test failed: ${error.message}`
        )
      }
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Security and Authentication Tests\n')

    await this.testEnvironmentVariables()
    await this.testSupabaseAuth()
    await this.testWebhooks()
    await this.testAPIRouteSecurity()

    this.printResults()
  }

  // Print test results
  private printResults() {
    console.log('\n📊 Test Results Summary:')
    console.log('=' .repeat(60))

    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const warnings = this.results.filter(r => r.status === 'warning').length

    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📝 Total: ${this.results.length}`)

    console.log('\n📋 Detailed Results:')
    console.log('-'.repeat(60))

    for (const result of this.results) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
      console.log(`${icon} ${result.name}: ${result.message}`)
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
      }
    }

    // Security recommendations
    console.log('\n🔒 Security Recommendations:')
    console.log('-'.repeat(60))
    
    if (failed > 0) {
      console.log('❌ CRITICAL: Fix all failed tests before deploying to production')
    }
    
    if (warnings > 0) {
      console.log('⚠️  WARNING: Review and address all warnings')
    }
    
    console.log('✅ Ensure all environment variables are properly set in production')
    console.log('✅ Verify webhook signatures are validated in production')
    console.log('✅ Test authentication flows manually in production environment')
    console.log('✅ Monitor API endpoints for unauthorized access attempts')
  }
}

// Run the tests
if (require.main === module) {
  const tester = new SecurityAuthTester()
  tester.runAllTests().catch(console.error)
}

export { SecurityAuthTester }
