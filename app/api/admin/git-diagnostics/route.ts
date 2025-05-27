import { NextResponse } from "next/server"
import { checkGitStatus, checkGitHooksPermissions, checkGitLFS, checkGitIgnore } from "@/lib/git-diagnostics"
import {
  checkVercelConfig,
  checkPackageJson,
  checkNextConfig,
  checkBuildOutputDirectory,
  checkNodeModules,
} from "@/lib/deployment-diagnostics"

export async function GET() {
  try {
    // Run all diagnostics in parallel
    const [gitStatus, gitHooks, gitLFS, gitIgnore, vercelConfig, packageJson, nextConfig, buildOutput, nodeModules] =
      await Promise.all([
        checkGitStatus(),
        checkGitHooksPermissions(),
        checkGitLFS(),
        checkGitIgnore(),
        checkVercelConfig(),
        checkPackageJson(),
        checkNextConfig(),
        checkBuildOutputDirectory(),
        checkNodeModules(),
      ])

    // Analyze results to determine potential issues
    const potentialIssues: string[] = []

    // Git issues
    if (!gitStatus.isRepo) {
      potentialIssues.push("Not a Git repository or Git not installed")
    } else {
      if (gitStatus.uncommittedChanges.length > 0) {
        potentialIssues.push(`${gitStatus.uncommittedChanges.length} uncommitted changes`)
      }

      if (!gitStatus.remoteStatus.connected) {
        potentialIssues.push("No remote repository configured")
      }

      if (!gitStatus.config?.user.name || !gitStatus.config?.user.email) {
        potentialIssues.push("Git user name or email not configured")
      }
    }

    // Git hooks issues
    if (gitHooks.errors && gitHooks.errors.length > 0) {
      potentialIssues.push(...gitHooks.errors)
    }

    // Git LFS issues
    if (gitLFS.error) {
      potentialIssues.push(gitLFS.error)
    }

    // Git ignore issues
    if (gitIgnore.suggestions) {
      potentialIssues.push(...gitIgnore.suggestions)
    }

    // Vercel config issues
    if (vercelConfig.issues) {
      potentialIssues.push(...vercelConfig.issues)
    }

    // Package.json issues
    if (packageJson.issues) {
      potentialIssues.push(...packageJson.issues)
    }

    // Next.js config issues
    if (nextConfig.issues) {
      potentialIssues.push(...nextConfig.issues)
    }

    // Build output issues
    if (buildOutput.issues) {
      potentialIssues.push(...buildOutput.issues)
    }

    // Node modules issues
    if (nodeModules.issues) {
      potentialIssues.push(...nodeModules.issues)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      git: {
        status: gitStatus,
        hooks: gitHooks,
        lfs: gitLFS,
        ignore: gitIgnore,
      },
      deployment: {
        vercelConfig,
        packageJson,
        nextConfig,
        buildOutput,
        nodeModules,
      },
      potentialIssues: potentialIssues.length > 0 ? potentialIssues : undefined,
      summary: {
        gitIssues: gitStatus.error || gitStatus.uncommittedChanges.length > 0 || !gitStatus.remoteStatus.connected,
        configIssues: !!(vercelConfig.issues || packageJson.issues || nextConfig.issues),
        buildIssues: !!(buildOutput.issues || nodeModules.issues),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to run diagnostics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
