// Environment variable validation
const requiredEnvVars = ["DATABASE_URL", "PUSHER_SECRET"] as const

// Check for missing environment variables during build/startup
export function validateEnv() {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }
}

// Type-safe environment variables
export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID as string,
  PUSHER_KEY: process.env.PUSHER_KEY as string,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER as string,
  PUSHER_SECRET: process.env.PUSHER_SECRET as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  VERCEL_URL: process.env.VERCEL_URL as string,
}

// For client-side usage, we'll use a separate object with only safe values
export const clientEnv = {
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
}
