// This utility checks if required environment variables are set
// and provides a way to validate them

type EnvCategory = "database" | "auth" | "storage" | "messaging" | "payment" | "other"

interface EnvVariable {
  name: string
  required: boolean
  category: EnvCategory
  description: string
  sensitive?: boolean
}

// Define all environment variables used in the application
export const ENV_VARIABLES: EnvVariable[] = [
  // Database
  {
    name: "DATABASE_URL",
    required: true,
    category: "database",
    description: "Primary database connection string",
    sensitive: true,
  },
  {
    name: "POSTGRES_URL",
    required: false,
    category: "database",
    description: "Postgres database URL",
    sensitive: true,
  },
  {
    name: "POSTGRES_PRISMA_URL",
    required: false,
    category: "database",
    description: "Postgres URL for Prisma with connection pooling",
    sensitive: true,
  },
  {
    name: "POSTGRES_URL_NON_POOLING",
    required: false,
    category: "database",
    description: "Postgres URL without connection pooling",
    sensitive: true,
  },
  { name: "POSTGRES_USER", required: false, category: "database", description: "Postgres username", sensitive: true },
  {
    name: "POSTGRES_PASSWORD",
    required: false,
    category: "database",
    description: "Postgres password",
    sensitive: true,
  },
  { name: "POSTGRES_HOST", required: false, category: "database", description: "Postgres host", sensitive: true },
  {
    name: "POSTGRES_DATABASE",
    required: false,
    category: "database",
    description: "Postgres database name",
    sensitive: true,
  },

  // Supabase
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: true, category: "database", description: "Supabase project URL" },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    category: "database",
    description: "Supabase anonymous key",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    required: true,
    category: "database",
    description: "Supabase service role key",
    sensitive: true,
  },

  // Redis/Upstash
  { name: "REDIS_URL", required: true, category: "database", description: "Redis/Upstash URL", sensitive: true },
  { name: "REDIS_TOKEN", required: true, category: "database", description: "Redis/Upstash token", sensitive: true },
  { name: "KV_URL", required: false, category: "database", description: "Alternative Redis/KV URL", sensitive: true },
  {
    name: "KV_REST_API_TOKEN",
    required: false,
    category: "database",
    description: "Alternative Redis/KV token",
    sensitive: true,
  },

  // Authentication
  { name: "NEXTAUTH_URL", required: true, category: "auth", description: "NextAuth URL (usually your site URL)" },
  {
    name: "NEXTAUTH_SECRET",
    required: true,
    category: "auth",
    description: "NextAuth secret for JWT encryption",
    sensitive: true,
  },
  { name: "GITHUB_ID", required: false, category: "auth", description: "GitHub OAuth client ID" },
  {
    name: "GITHUB_SECRET",
    required: false,
    category: "auth",
    description: "GitHub OAuth client secret",
    sensitive: true,
  },

  // Storage
  {
    name: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    required: true,
    category: "storage",
    description: "Cloudinary cloud name",
  },
  {
    name: "CLOUDINARY_API_KEY",
    required: true,
    category: "storage",
    description: "Cloudinary API key",
    sensitive: true,
  },
  {
    name: "CLOUDINARY_API_SECRET",
    required: true,
    category: "storage",
    description: "Cloudinary API secret",
    sensitive: true,
  },

  // Email
  { name: "EMAIL_SERVER_HOST", required: true, category: "messaging", description: "SMTP server host" },
  { name: "EMAIL_SERVER_PORT", required: true, category: "messaging", description: "SMTP server port" },
  {
    name: "EMAIL_SERVER_USER",
    required: true,
    category: "messaging",
    description: "SMTP server username",
    sensitive: true,
  },
  {
    name: "EMAIL_SERVER_PASSWORD",
    required: true,
    category: "messaging",
    description: "SMTP server password",
    sensitive: true,
  },
  { name: "EMAIL_FROM", required: true, category: "messaging", description: "Email sender address" },

  // Pusher
  { name: "PUSHER_APP_ID", required: true, category: "messaging", description: "Pusher app ID", sensitive: true },
  { name: "PUSHER_KEY", required: true, category: "messaging", description: "Pusher key" },
  { name: "PUSHER_SECRET", required: true, category: "messaging", description: "Pusher secret", sensitive: true },
  { name: "PUSHER_CLUSTER", required: true, category: "messaging", description: "Pusher cluster" },

  // Stripe
  { name: "STRIPE_SECRET_KEY", required: true, category: "payment", description: "Stripe secret key", sensitive: true },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    required: true,
    category: "payment",
    description: "Stripe webhook secret",
    sensitive: true,
  },
  {
    name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    required: true,
    category: "payment",
    description: "Stripe publishable key",
  },

  // Application
  { name: "BASE_URL", required: false, category: "other", description: "Base URL of the application" },
  { name: "NEXT_PUBLIC_VERCEL_URL", required: false, category: "other", description: "Vercel deployment URL" },
]

/**
 * Simple environment variable checker for critical variables
 * This runs at build time to ensure required variables are present
 */

export function checkRequiredEnvVars() {
  const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

  const missing = requiredVars.filter((varName) => {
    const value = process.env[varName]
    return !value || value.trim() === ""
  })

  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(", ")}`)
    // Don't fail the build, just warn
  }

  // Check for recommended variables
  const recommendedVars = ["ALLOWED_REDIRECT_DOMAINS", "ALLOWED_CSS_DOMAINS"]

  const missingRecommended = recommendedVars.filter((varName) => {
    const value = process.env[varName]
    return !value || value.trim() === ""
  })

  if (missingRecommended.length > 0) {
    console.warn(`ℹ️ Missing recommended environment variables: ${missingRecommended.join(", ")}`)
  }

  return missing.length === 0
}

// Check if an environment variable is set
export function isEnvSet(name: string): boolean {
  return process.env[name] !== undefined && process.env[name] !== ""
}

// Get all environment variables for a category
export function getEnvVariablesByCategory(category: EnvCategory): EnvVariable[] {
  return ENV_VARIABLES.filter((v) => v.category === category)
}

// Check all required environment variables
export function checkRequiredEnvVariables(): { missing: string[]; set: string[] } {
  const missing: string[] = []
  const set: string[] = []

  ENV_VARIABLES.forEach((variable) => {
    if (variable.required) {
      if (isEnvSet(variable.name)) {
        set.push(variable.name)
      } else {
        missing.push(variable.name)
      }
    }
  })

  return { missing, set }
}

// Get environment variable info
export function getEnvVariableInfo(name: string): EnvVariable | undefined {
  return ENV_VARIABLES.find((v) => v.name === name)
}

// Check if all required environment variables for a category are set
export function checkCategoryEnvVariables(category: EnvCategory): { missing: string[]; set: string[] } {
  const variables = getEnvVariablesByCategory(category)
  const missing: string[] = []
  const set: string[] = []

  variables.forEach((variable) => {
    if (variable.required) {
      if (isEnvSet(variable.name)) {
        set.push(variable.name)
      } else {
        missing.push(variable.name)
      }
    }
  })

  return { missing, set }
}
