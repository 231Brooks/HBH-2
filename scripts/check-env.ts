#!/usr/bin/env tsx
// Environment variable checker script

import { envGroups, features } from "../lib/env-config"
import chalk from "chalk"

function checkEnvironmentVariables() {
  console.log(chalk.blue.bold("🔍 Environment Variable Check\n"))

  // Check required variables
  console.log(chalk.yellow("Required Variables:"))
  let missingRequired = 0

  for (const varName of envGroups.required) {
    const value = process.env[varName]
    if (value) {
      console.log(chalk.green(`  ✓ ${varName}`))
    } else {
      console.log(chalk.red(`  ✗ ${varName} (MISSING)`))
      missingRequired++
    }
  }

  // Check optional variables
  console.log(chalk.yellow("\nOptional Variables:"))
  let missingOptional = 0

  for (const varName of envGroups.optional) {
    const value = process.env[varName]
    if (value) {
      console.log(chalk.green(`  ✓ ${varName}`))
    } else {
      console.log(chalk.gray(`  - ${varName} (not set)`))
      missingOptional++
    }
  }

  // Feature availability
  console.log(chalk.yellow("\nFeature Availability:"))
  console.log(chalk.green(`  ✓ Database: Always available`))
  console.log(features.auth.github ? chalk.green("  ✓ GitHub Auth") : chalk.gray("  - GitHub Auth (disabled)"))
  console.log(features.auth.email ? chalk.green("  ✓ Email Auth") : chalk.gray("  - Email Auth (disabled)"))
  console.log(features.storage.cloudinary ? chalk.green("  ✓ Cloudinary") : chalk.gray("  - Cloudinary (disabled)"))
  console.log(
    features.realtime.pusher ? chalk.green("  ✓ Pusher Realtime") : chalk.gray("  - Pusher Realtime (disabled)"),
  )
  console.log(
    features.payments.stripe ? chalk.green("  ✓ Stripe Payments") : chalk.gray("  - Stripe Payments (disabled)"),
  )
  console.log(features.cache.redis ? chalk.green("  ✓ Redis Cache") : chalk.gray("  - Redis Cache (disabled)"))

  // Summary
  console.log(chalk.yellow("\nSummary:"))
  if (missingRequired > 0) {
    console.log(chalk.red(`  ❌ ${missingRequired} required variables missing`))
    console.log(chalk.red("  Application may not work properly"))
    process.exit(1)
  } else {
    console.log(chalk.green("  ✅ All required variables are set"))
  }

  if (missingOptional > 0) {
    console.log(chalk.yellow(`  ⚠️  ${missingOptional} optional variables not set`))
    console.log(chalk.yellow("  Some features will be disabled"))
  }

  console.log(chalk.blue("\n🚀 Environment check complete!"))
}

// Run the check
checkEnvironmentVariables()
