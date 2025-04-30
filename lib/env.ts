import { z } from "zod"

// Define schema for server-side environment variables
const serverEnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url(),

  // Cloudinary (if configured)
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Email (if configured)
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().transform(Number).optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Authentication (if configured)
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  // Pusher (if configured) - Server-side only
  PUSHER_APP_ID: z.string().optional(),
  PUSHER_KEY: z.string().optional(),
  PUSHER_SECRET: z.string().optional(),
  PUSHER_CLUSTER: z.string().optional(),
})

// Define schema for client-side environment variables
const clientEnvSchema = z.object({
  // Cloudinary (if configured)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
})

// Process server environment variables
const processServerEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
}

// Process client environment variables
const processClientEnv = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
}

// Parse and validate server environment variables
let serverEnv = {} as z.infer<typeof serverEnvSchema>
let clientEnv = {} as z.infer<typeof clientEnvSchema>

try {
  serverEnv = serverEnvSchema.parse(processServerEnv)
  clientEnv = clientEnvSchema.parse(processClientEnv)
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map((err) => err.path.join("."))
    console.error("❌ Invalid or missing environment variables:", missingVars)
    throw new Error(`Invalid environment variables: ${missingVars.join(", ")}`)
  }
  throw error
}

export { serverEnv, clientEnv }
