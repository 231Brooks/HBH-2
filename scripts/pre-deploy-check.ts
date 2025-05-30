#!/usr/bin/env node

import { runDeploymentReadinessCheck } from "../lib/deployment-diagnostics"
import { checkRequiredEnvVars } from "../lib/env-checker"

console.log("🔍 Running pre-deployment checks...\n")

// Check deployment readiness
const deploymentCheck = runDeploymentReadinessCheck()

console.log("📋 Deployment Readiness Check:")
console.log(`Ready: ${deploymentCheck.ready ? "✅" : "❌"}`)

if (deploymentCheck.issues.length > 0) {
  console.log("\n🚨 Critical Issues:")
  deploymentCheck.issues.forEach((issue) => console.log(`  - ${issue}`))
}

if (deploymentCheck.warnings.length > 0) {
  console.log("\n⚠️  Warnings:")
  deploymentCheck.warnings.forEach((warning) => console.log(`  - ${warning}`))
}

if (deploymentCheck.recommendations.length > 0) {
  console.log("\n💡 Recommendations:")
  deploymentCheck.recommendations.forEach((rec) => console.log(`  - ${rec}`))
}

// Check environment variables
console.log("\n🔐 Environment Variables Check:")
const envCheck = checkRequiredEnvVars()
if (envCheck) {
  console.log("✅ All required environment variables are set")
} else {
  console.log("❌ Some required environment variables are missing")
}

// Exit with error code if not ready
if (!deploymentCheck.ready) {
  console.log("\n❌ Deployment not ready. Please fix the issues above.")
  process.exit(1)
} else {
  console.log("\n✅ Deployment ready!")
  process.exit(0)
}
