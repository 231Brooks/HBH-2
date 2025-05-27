// Environment variable validation
const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

// Call this in your app startup
export function checkRequiredEnvVars() {
  const { valid, missing } = validateEnv()

  if (!valid) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`)
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing required environment variables")
    }
  }
}
