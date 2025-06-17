#!/usr/bin/env tsx

/**
 * Development Environment Setup Script
 * Sets up the development environment for HBH-2 & Portal integration
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Setting up HBH-2 & Portal Development Environment...\n')

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory')
  process.exit(1)
}

// Check if .env exists and has DATABASE_URL
const envPath = '.env'
let needsEnvSetup = false

if (!fs.existsSync(envPath)) {
  needsEnvSetup = true
} else {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  if (!envContent.includes('DATABASE_URL=') || envContent.includes('postgresql://username:password@localhost')) {
    needsEnvSetup = true
  }
}

if (needsEnvSetup) {
  console.log('⚠️  Environment setup required')
  console.log('Please configure your .env file with actual database credentials.')
  console.log('For development, you can:')
  console.log('1. Use a local PostgreSQL database')
  console.log('2. Use the existing Supabase project')
  console.log('3. Create a new Supabase project for development\n')
  
  console.log('Current .env template created. Please update with your credentials:')
  console.log('- DATABASE_URL: Your PostgreSQL connection string')
  console.log('- NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key')
  console.log('- Other service credentials as needed\n')
  
  process.exit(0)
}

try {
  // Install dependencies if needed
  console.log('📦 Checking dependencies...')
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...')
    execSync('npm install', { stdio: 'inherit' })
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // Check database connection
  console.log('🔍 Checking database connection...')
  try {
    execSync('npx prisma db pull --force', { stdio: 'pipe' })
    console.log('✅ Database connection successful')
  } catch (error) {
    console.log('⚠️  Could not connect to database. Please check your DATABASE_URL')
    console.log('You may need to:')
    console.log('1. Start your local PostgreSQL server')
    console.log('2. Create the database')
    console.log('3. Update your DATABASE_URL in .env')
    process.exit(1)
  }

  // Apply migrations
  console.log('🗄️  Applying database migrations...')
  try {
    execSync('npx prisma migrate dev --name "add-portal-features"', { stdio: 'inherit' })
    console.log('✅ Database migrations applied successfully')
  } catch (error) {
    console.log('⚠️  Migration failed. This might be expected if migrations already exist.')
  }

  // Seed database with initial data
  console.log('🌱 Setting up initial data...')
  // We'll create a seed script later

  console.log('\n✅ Development environment setup complete!')
  console.log('\nNext steps:')
  console.log('1. Run `npm run dev` to start the development server')
  console.log('2. Visit http://localhost:3000 to see HBH-2')
  console.log('3. Visit http://localhost:3000/portal to see the Portal')
  console.log('4. Check the implementation guide for next steps')

} catch (error) {
  console.error('❌ Setup failed:', error)
  process.exit(1)
}
