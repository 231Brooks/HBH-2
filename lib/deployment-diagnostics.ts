// Deployment diagnostics utility to check Vercel configuration and deployment status

import fs from "fs"
import path from "path"

interface VercelConfig {
  exists: boolean
  valid: boolean
  content?: any
  issues?: string[]
}

interface PackageJson {
  exists: boolean
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  issues?: string[]
}

interface NextConfig {
  exists: boolean
  valid: boolean
  content?: any
  issues?: string[]
}

export function checkVercelConfig(): VercelConfig {
  try {
    const vercelConfigPath = path.join(process.cwd(), "vercel.json")

    if (!fs.existsSync(vercelConfigPath)) {
      return {
        exists: false,
        valid: false,
        issues: ["vercel.json file not found"],
      }
    }

    const content = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"))
    const issues: string[] = []

    // Check for common issues
    if (!content.version) {
      issues.push('Missing "version" field in vercel.json')
    }

    if (content.builds && !Array.isArray(content.builds)) {
      issues.push('"builds" should be an array in vercel.json')
    }

    if (content.routes && !Array.isArray(content.routes)) {
      issues.push('"routes" should be an array in vercel.json')
    }

    // Check for conflicting Next.js configuration
    if ((content.builds || content.routes) && fs.existsSync(path.join(process.cwd(), "next.config.js"))) {
      issues.push("Both vercel.json and next.config.js exist, which might cause conflicts")
    }

    return {
      exists: true,
      valid: issues.length === 0,
      content,
      issues: issues.length > 0 ? issues : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      valid: false,
      issues: [error instanceof Error ? error.message : "Unknown error checking vercel.json"],
    }
  }
}

export function checkPackageJson(): PackageJson {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json")

    if (!fs.existsSync(packageJsonPath)) {
      return {
        exists: false,
        issues: ["package.json file not found"],
      }
    }

    const content = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    const issues: string[] = []

    // Check for build script
    if (!content.scripts || !content.scripts.build) {
      issues.push('Missing "build" script in package.json')
    }

    // Check for start script
    if (!content.scripts || !content.scripts.start) {
      issues.push('Missing "start" script in package.json')
    }

    // Check for Next.js dependency
    if (!content.dependencies || !content.dependencies.next) {
      issues.push('Missing "next" in dependencies')
    }

    // Check for React dependency
    if (!content.dependencies || !content.dependencies.react) {
      issues.push('Missing "react" in dependencies')
    }

    return {
      exists: true,
      scripts: content.scripts,
      dependencies: content.dependencies,
      devDependencies: content.devDependencies,
      issues: issues.length > 0 ? issues : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      issues: [error instanceof Error ? error.message : "Unknown error checking package.json"],
    }
  }
}

export function checkNextConfig(): NextConfig {
  try {
    // Check for both next.config.js and next.config.mjs
    const nextConfigPath = fs.existsSync(path.join(process.cwd(), "next.config.js"))
      ? path.join(process.cwd(), "next.config.js")
      : path.join(process.cwd(), "next.config.mjs")

    if (!fs.existsSync(nextConfigPath)) {
      return {
        exists: false,
        valid: false,
        issues: ["next.config.js or next.config.mjs file not found"],
      }
    }

    const content = fs.readFileSync(nextConfigPath, "utf8")
    const issues: string[] = []

    // Basic syntax check
    if (!content.includes("module.exports") && !content.includes("export default")) {
      issues.push("Next.js config file does not export configuration")
    }

    // Check for common issues
    if (content.includes("serverRuntimeConfig") && !content.includes("publicRuntimeConfig")) {
      issues.push("Using serverRuntimeConfig without publicRuntimeConfig might cause issues")
    }

    // Check for experimental features
    if (content.includes("experimental")) {
      issues.push("Using experimental features might cause deployment issues")
    }

    return {
      exists: true,
      valid: issues.length === 0,
      content,
      issues: issues.length > 0 ? issues : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      valid: false,
      issues: [error instanceof Error ? error.message : "Unknown error checking Next.js config"],
    }
  }
}

export function checkBuildOutputDirectory(): {
  exists: boolean
  size?: number
  files?: number
  issues?: string[]
} {
  try {
    const buildDirPath = path.join(process.cwd(), ".next")

    if (!fs.existsSync(buildDirPath)) {
      return {
        exists: false,
        issues: [".next directory not found, project may not have been built"],
      }
    }

    // Calculate directory size and file count
    let totalSize = 0
    let fileCount = 0

    function calculateDirSize(dirPath: string) {
      const files = fs.readdirSync(dirPath)

      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          calculateDirSize(filePath)
        } else {
          totalSize += stats.size
          fileCount++
        }
      }
    }

    calculateDirSize(buildDirPath)

    const issues: string[] = []

    // Check for common issues
    if (totalSize === 0) {
      issues.push("Build output directory is empty")
    }

    if (!fs.existsSync(path.join(buildDirPath, "server"))) {
      issues.push("Missing server directory in build output")
    }

    if (!fs.existsSync(path.join(buildDirPath, "static"))) {
      issues.push("Missing static directory in build output")
    }

    return {
      exists: true,
      size: totalSize,
      files: fileCount,
      issues: issues.length > 0 ? issues : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      issues: [error instanceof Error ? error.message : "Unknown error checking build output directory"],
    }
  }
}

export function checkNodeModules(): {
  exists: boolean
  size?: number
  issues?: string[]
} {
  try {
    const nodeModulesPath = path.join(process.cwd(), "node_modules")

    if (!fs.existsSync(nodeModulesPath)) {
      return {
        exists: false,
        issues: ["node_modules directory not found, dependencies may not be installed"],
      }
    }

    // Calculate directory size
    let totalSize = 0

    function calculateDirSize(dirPath: string) {
      try {
        const files = fs.readdirSync(dirPath)

        for (const file of files) {
          try {
            const filePath = path.join(dirPath, file)
            const stats = fs.statSync(filePath)

            if (stats.isDirectory()) {
              calculateDirSize(filePath)
            } else {
              totalSize += stats.size
            }
          } catch (error) {
            // Skip files that can't be accessed
          }
        }
      } catch (error) {
        // Skip directories that can't be accessed
      }
    }

    calculateDirSize(nodeModulesPath)

    const issues: string[] = []

    // Check for common issues
    if (totalSize === 0) {
      issues.push("node_modules directory appears to be empty")
    }

    // Check for next.js in node_modules
    if (!fs.existsSync(path.join(nodeModulesPath, "next"))) {
      issues.push("next package not found in node_modules")
    }

    // Check for react in node_modules
    if (!fs.existsSync(path.join(nodeModulesPath, "react"))) {
      issues.push("react package not found in node_modules")
    }

    return {
      exists: true,
      size: totalSize,
      issues: issues.length > 0 ? issues : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      issues: [error instanceof Error ? error.message : "Unknown error checking node_modules directory"],
    }
  }
}

// Add a comprehensive deployment readiness check function at the end of the file

export function runDeploymentReadinessCheck(): {
  ready: boolean
  issues: string[]
  warnings: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []

  // Check Vercel configuration
  const vercelConfig = checkVercelConfig()
  if (!vercelConfig.valid && vercelConfig.issues) {
    issues.push(...vercelConfig.issues)
  }

  // Check package.json
  const packageJson = checkPackageJson()
  if (packageJson.issues) {
    issues.push(...packageJson.issues)
  }

  // Check Next.js configuration
  const nextConfig = checkNextConfig()
  if (!nextConfig.valid && nextConfig.issues) {
    warnings.push(...nextConfig.issues)
  }

  // Check build output
  const buildOutput = checkBuildOutputDirectory()
  if (!buildOutput.exists) {
    warnings.push("Build output not found - run 'npm run build' before deploying")
  }

  // Check node_modules
  const nodeModules = checkNodeModules()
  if (!nodeModules.exists) {
    issues.push("node_modules not found - run 'npm install' before deploying")
  }

  // Bundle size recommendations
  if (buildOutput.size && buildOutput.size > 200 * 1024 * 1024) {
    // 200MB
    warnings.push(`Build output is large (${Math.round(buildOutput.size / 1024 / 1024)}MB) - consider optimizing`)
    recommendations.push("Use outputFileTracingExcludes in next.config.js to reduce bundle size")
    recommendations.push("Add more files to .vercelignore")
    recommendations.push("Consider code splitting and dynamic imports")
  }

  // Environment variable recommendations
  recommendations.push("Verify all environment variables are set in Vercel dashboard")
  recommendations.push("Run diagnostics API endpoint to test integrations")
  recommendations.push("Test authentication flow before going live")

  return {
    ready: issues.length === 0,
    issues,
    warnings,
    recommendations,
  }
}
