/**
 * Enhanced environment variable validator
 * Validates required environment variables and provides helpful error messages
 */

type EnvVarConfig = {
  required: boolean
  description: string
  format?: RegExp
  formatDescription?: string
}

const ENV_VARS: Record<string, EnvVarConfig> = {
  // Authentication
  NEXTAUTH_URL: {
    required: true,
    description: "URL for NextAuth.js authentication",
    format: /^https?:\/\/.+/,
    formatDescription: "Must be a valid URL starting with http:// or https://",
  },
  NEXTAUTH_SECRET: {
    required: true,
    description: "Secret for NextAuth.js authentication",
  },

  // Vercel
  NEXT_PUBLIC_VERCEL_URL: {
    required: false,
    description: "Vercel deployment URL",
  },

  // Database
  DATABASE_URL: {
    required: true,
    description: "PostgreSQL database connection URL",
    format: /^postgres(ql)?:\/\/.+/,
    formatDescription: "Must be a valid PostgreSQL connection string",
  },

  // Security
  ALLOWED_REDIRECT_DOMAINS: {
    required: false,
    description: "Comma-separated list of domains allowed for redirects",
    format: /^([a-z0-9-]+(\.[a-z0-9-]+)*(,\s*[a-z0-9-]+(\.[a-z0-9-]+)*)*)$/i,
    formatDescription: "Must be a comma-separated list of domains without protocols",
  },
  ALLOWED_CSS_DOMAINS: {
    required: false,
    description: "Comma-separated list of domains allowed in CSS URLs",
    format: /^([a-z0-9-]+(\.[a-z0-9-]+)*(,\s*[a-z0-9-]+(\.[a-z0-9-]+)*)*)$/i,
    formatDescription: "Must be a comma-separated list of domains without protocols",
  },

  // Add other environment variables as needed
}

// Define validation patterns for different types of environment variables
const validationPatterns = {
  url: /^https?:\/\/.+/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  apiKey: /.{10,}/,
  secret: /.{16,}/,
  jwt: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
  base64: /^[A-Za-z0-9+/=]+$/,
}

// Define specific validation rules for known environment variables
const specificValidations: Record<string, (value: string) => { valid: boolean; message?: string }> = {
  DATABASE_URL: (value) => {
    const valid = value.includes("postgresql://") || value.includes("postgres://")
    return {
      valid,
      message: valid ? undefined : "Database URL should start with postgresql:// or postgres://",
    }
  },
  NEXT_PUBLIC_SUPABASE_URL: (value) => {
    const valid = value.includes(".supabase.co")
    return {
      valid,
      message: valid ? undefined : "Supabase URL should contain .supabase.co",
    }
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: (value) => {
    const valid = value.length > 20
    return {
      valid,
      message: valid ? undefined : "Supabase anon key appears too short",
    }
  },
  STRIPE_SECRET_KEY: (value) => {
    const valid = value.startsWith("sk_")
    return {
      valid,
      message: valid ? undefined : "Stripe secret key should start with sk_",
    }
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: (value) => {
    const valid = value.startsWith("pk_")
    return {
      valid,
      message: valid ? undefined : "Stripe publishable key should start with pk_",
    }
  },
  PUSHER_APP_ID: (value) => {
    const valid = /^\d+$/.test(value)
    return {
      valid,
      message: valid ? undefined : "Pusher app ID should be numeric",
    }
  },
}

// Test connection to a service
async function testServiceConnection(service: string) {
  return { success: false, message: `No connection test available for ${service}` }
}

// Get all environment variables with validation status
export async function getAllEnvVariablesWithStatus() {
  const results: Array<{
    name: string
    category: string
    description: string
    required: boolean
    exists: boolean
    formatValid: boolean
    message?: string
    sensitive: boolean
  }> = []

  // Track services that need testing
  const servicesToTest = new Set<string>()

  // Check all environment variables
  for (const variable of Object.values(ENV_VARS)) {
    const value = process.env[variable.name] || ""
    let formatValid = true
    let message: string | undefined = undefined

    // Check if the variable exists
    const exists = !!value

    // Check format if variable exists and has a format requirement
    if (exists && variable.format) {
      formatValid = variable.format.test(value)
      if (!formatValid) {
        message = variable.formatDescription || "Invalid format"
      }
    }

    results.push({
      name: variable.name,
      category: variable.category,
      description: variable.description,
      required: variable.required,
      exists: exists,
      formatValid: formatValid,
      message: message,
      sensitive: !!variable.sensitive,
    })
  }

  return { variables: results, connections: {} }
}
