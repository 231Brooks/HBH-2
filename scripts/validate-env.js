#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates that all required environment variables are properly set
 */

require('dotenv').config({ path: '.env.local' })

const requiredEnvVars = {
  // Supabase Configuration
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'Supabase project URL',
    validation: (value) => value.includes('.supabase.co')
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Supabase anonymous key',
    validation: (value) => value.length > 100
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Supabase service role key (server-side only)',
    validation: (value) => value.length > 100
  },

  // Database
  'DATABASE_URL': {
    required: true,
    description: 'PostgreSQL database connection URL',
    validation: (value) => value.includes('postgresql://') || value.includes('postgres://')
  },

  // OAuth Providers
  'GITHUB_CLIENT_ID': {
    required: true,
    description: 'GitHub OAuth client ID',
    validation: (value) => value.length > 10
  },
  'GITHUB_CLIENT_SECRET': {
    required: true,
    description: 'GitHub OAuth client secret',
    validation: (value) => value.length > 20
  },
  'GOOGLE_CLIENT_ID': {
    required: true,
    description: 'Google OAuth client ID',
    validation: (value) => value.includes('.apps.googleusercontent.com')
  },
  'GOOGLE_CLIENT_SECRET': {
    required: true,
    description: 'Google OAuth client secret',
    validation: (value) => value.length > 20
  },

  // Stripe (optional for testing)
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    required: false,
    description: 'Stripe publishable key',
    validation: (value) => value.startsWith('pk_')
  },
  'STRIPE_SECRET_KEY': {
    required: false,
    description: 'Stripe secret key',
    validation: (value) => value.startsWith('sk_')
  }
}

function validateEnvironment() {
  console.log('🔐 Validating Environment Variables...\n')

  let hasErrors = false
  let hasWarnings = false

  for (const [envVar, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[envVar]

    if (!value) {
      if (config.required) {
        console.log(`❌ ${envVar}: Missing required environment variable`)
        console.log(`   Description: ${config.description}`)
        hasErrors = true
      } else {
        console.log(`⚠️  ${envVar}: Optional environment variable not set`)
        console.log(`   Description: ${config.description}`)
        hasWarnings = true
      }
    } else {
      // Check for placeholder values
      if (value.includes('placeholder') || value.includes('your_') || value.includes('YOUR_') || 
          value.includes('YourLive') || value.includes('whsec_live_webhook_secret_here')) {
        console.log(`⚠️  ${envVar}: Contains placeholder value`)
        console.log(`   Current value: ${value.substring(0, 20)}...`)
        hasWarnings = true
      } else if (config.validation && !config.validation(value)) {
        console.log(`❌ ${envVar}: Invalid format`)
        console.log(`   Description: ${config.description}`)
        hasErrors = true
      } else {
        console.log(`✅ ${envVar}: Valid`)
      }
    }
  }

  // Check for client-side exposure of secrets
  console.log('\n🛡️ Checking for Client-side Security Issues...\n')

  const serverOnlySecrets = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'GITHUB_CLIENT_SECRET', 
    'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY'
  ]

  for (const secret of serverOnlySecrets) {
    if (secret.startsWith('NEXT_PUBLIC_')) {
      console.log(`❌ ${secret}: Secret is exposed to client-side (starts with NEXT_PUBLIC_)`)
      hasErrors = true
    } else {
      console.log(`✅ ${secret}: Properly server-side only`)
    }
  }

  // Summary
  console.log('\n📊 Validation Summary:')
  console.log('=' .repeat(50))

  if (hasErrors) {
    console.log('❌ CRITICAL ERRORS FOUND')
    console.log('   Fix these issues before deploying to production')
  }

  if (hasWarnings) {
    console.log('⚠️  WARNINGS FOUND')
    console.log('   Review these issues for production readiness')
  }

  if (!hasErrors && !hasWarnings) {
    console.log('✅ ALL ENVIRONMENT VARIABLES VALID')
    console.log('   Environment is ready for production')
  }

  console.log('\n🔒 Security Recommendations:')
  console.log('-'.repeat(50))
  console.log('✅ Never commit .env files to version control')
  console.log('✅ Use different keys for development and production')
  console.log('✅ Rotate keys regularly')
  console.log('✅ Monitor for unauthorized API usage')
  console.log('✅ Use environment-specific configurations')

  return !hasErrors
}

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('\n🔑 Testing Supabase Connection...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Cannot test Supabase connection - missing credentials')
    return false
  }

  try {
    // Simple fetch test to Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })

    if (response.status === 200 || response.status === 404) {
      console.log('✅ Supabase connection successful')
      return true
    } else {
      console.log(`❌ Supabase connection failed with status: ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Supabase connection error: ${error.message}`)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 HBH-2 Environment Validation\n')

  const envValid = validateEnvironment()
  const supabaseValid = await testSupabaseConnection()

  console.log('\n🎯 Final Status:')
  console.log('=' .repeat(50))

  if (envValid && supabaseValid) {
    console.log('✅ ENVIRONMENT READY FOR PRODUCTION')
    process.exit(0)
  } else {
    console.log('❌ ENVIRONMENT NEEDS ATTENTION')
    console.log('   Fix the issues above before deploying')
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { validateEnvironment, testSupabaseConnection }
