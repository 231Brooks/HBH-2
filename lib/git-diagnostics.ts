// Git diagnostics utility to check repository status and configuration

import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

interface GitStatus {
  isRepo: boolean
  branch: string
  uncommittedChanges: string[]
  remoteStatus: {
    connected: boolean
    url?: string
    error?: string
  }
  lastCommit?: {
    hash: string
    message: string
    author: string
    date: string
  }
  config?: {
    user: {
      name?: string
      email?: string
    }
    core?: Record<string, string>
  }
  error?: string
}

export async function checkGitStatus(): Promise<GitStatus> {
  try {
    // Check if we're in a git repository
    try {
      await execAsync("git rev-parse --is-inside-work-tree")
    } catch (error) {
      return {
        isRepo: false,
        branch: "",
        uncommittedChanges: [],
        remoteStatus: { connected: false },
        error: "Not a git repository",
      }
    }

    // Get current branch
    const { stdout: branchOutput } = await execAsync("git branch --show-current")
    const branch = branchOutput.trim()

    // Get uncommitted changes
    const { stdout: statusOutput } = await execAsync("git status --porcelain")
    const uncommittedChanges = statusOutput
      .split("\n")
      .filter(Boolean)
      .map((line) => line.trim())

    // Check remote connection
    let remoteStatus = { connected: false }
    try {
      const { stdout: remoteOutput } = await execAsync("git remote -v")
      if (remoteOutput.trim()) {
        const remoteUrl = remoteOutput.split("\n")[0].split(/\s+/)[1]
        remoteStatus = { connected: true, url: remoteUrl }
      }
    } catch (error) {
      remoteStatus = {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error checking remote",
      }
    }

    // Get last commit info
    let lastCommit
    try {
      const { stdout: commitOutput } = await execAsync('git log -1 --pretty=format:"%H|%s|%an|%ad"')
      const [hash, message, author, date] = commitOutput.split("|")
      lastCommit = { hash, message, author, date }
    } catch (error) {
      // No commits yet or other issue
    }

    // Get git config
    const config = { user: {} }
    try {
      const { stdout: nameOutput } = await execAsync("git config user.name")
      config.user.name = nameOutput.trim()
    } catch (error) {
      // User name not set
    }

    try {
      const { stdout: emailOutput } = await execAsync("git config user.email")
      config.user.email = emailOutput.trim()
    } catch (error) {
      // User email not set
    }

    return {
      isRepo: true,
      branch,
      uncommittedChanges,
      remoteStatus,
      lastCommit,
      config,
    }
  } catch (error) {
    return {
      isRepo: false,
      branch: "",
      uncommittedChanges: [],
      remoteStatus: { connected: false },
      error: error instanceof Error ? error.message : "Unknown error checking git status",
    }
  }
}

export async function checkGitHooksPermissions(): Promise<{
  hooksExist: boolean
  permissions: Record<string, string>
  errors?: string[]
}> {
  try {
    const gitDir = path.join(process.cwd(), ".git")
    const hooksDir = path.join(gitDir, "hooks")

    if (!fs.existsSync(hooksDir)) {
      return {
        hooksExist: false,
        permissions: {},
        errors: [".git/hooks directory not found"],
      }
    }

    const hooks = fs.readdirSync(hooksDir)
    const permissions: Record<string, string> = {}
    const errors: string[] = []

    for (const hook of hooks) {
      const hookPath = path.join(hooksDir, hook)
      try {
        const stats = fs.statSync(hookPath)
        const isExecutable = !!(stats.mode & 0o111) // Check if executable
        permissions[hook] = isExecutable ? "executable" : "not executable"

        if (hook.indexOf(".sample") === -1 && !isExecutable) {
          errors.push(`Hook ${hook} is not executable`)
        }
      } catch (error) {
        permissions[hook] = "error checking permissions"
        errors.push(`Error checking ${hook}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return { hooksExist: true, permissions, errors: errors.length > 0 ? errors : undefined }
  } catch (error) {
    return {
      hooksExist: false,
      permissions: {},
      errors: [error instanceof Error ? error.message : "Unknown error checking git hooks"],
    }
  }
}

export async function checkGitLFS(): Promise<{
  installed: boolean
  configured: boolean
  trackedExtensions?: string[]
  error?: string
}> {
  try {
    // Check if git-lfs is installed
    try {
      await execAsync("git lfs version")
    } catch (error) {
      return {
        installed: false,
        configured: false,
        error: "Git LFS not installed",
      }
    }

    // Check if git-lfs is configured in the repo
    let configured = false
    let trackedExtensions: string[] = []

    try {
      const { stdout } = await execAsync("git lfs track")
      configured = stdout.includes("Listing tracked patterns")

      // Extract tracked extensions
      const lines = stdout.split("\n").filter((line) => line.trim() && !line.includes("Listing tracked patterns"))
      trackedExtensions = lines.map((line) => line.trim())
    } catch (error) {
      return {
        installed: true,
        configured: false,
        error: "Git LFS not configured in this repository",
      }
    }

    return {
      installed: true,
      configured,
      trackedExtensions: trackedExtensions.length > 0 ? trackedExtensions : undefined,
    }
  } catch (error) {
    return {
      installed: false,
      configured: false,
      error: error instanceof Error ? error.message : "Unknown error checking Git LFS",
    }
  }
}

export async function checkGitIgnore(): Promise<{
  exists: boolean
  content?: string
  nodeModulesIgnored: boolean
  buildOutputIgnored: boolean
  envFilesIgnored: boolean
  suggestions?: string[]
}> {
  try {
    const gitignorePath = path.join(process.cwd(), ".gitignore")

    if (!fs.existsSync(gitignorePath)) {
      return {
        exists: false,
        nodeModulesIgnored: false,
        buildOutputIgnored: false,
        envFilesIgnored: false,
        suggestions: ["Create a .gitignore file with node_modules, .next, and .env entries"],
      }
    }

    const content = fs.readFileSync(gitignorePath, "utf8")
    const lines = content.split("\n").map((line) => line.trim())

    const nodeModulesIgnored = lines.some((line) => line === "node_modules" || line === "/node_modules")
    const buildOutputIgnored = lines.some(
      (line) =>
        line === ".next" ||
        line === "/.next" ||
        line === "out" ||
        line === "/out" ||
        line === "build" ||
        line === "/build",
    )
    const envFilesIgnored = lines.some((line) => line === ".env" || line === ".env.local" || line === ".env*.local")

    const suggestions: string[] = []

    if (!nodeModulesIgnored) {
      suggestions.push('Add "node_modules" to your .gitignore file')
    }

    if (!buildOutputIgnored) {
      suggestions.push('Add ".next" and "out" to your .gitignore file')
    }

    if (!envFilesIgnored) {
      suggestions.push('Add ".env.local" and ".env*.local" to your .gitignore file')
    }

    return {
      exists: true,
      content,
      nodeModulesIgnored,
      buildOutputIgnored,
      envFilesIgnored,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    }
  } catch (error) {
    return {
      exists: false,
      nodeModulesIgnored: false,
      buildOutputIgnored: false,
      envFilesIgnored: false,
      suggestions: ["Error checking .gitignore file"],
    }
  }
}
