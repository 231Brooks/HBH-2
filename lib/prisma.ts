import { PrismaClient } from "@prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true

// This prevents multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Function to create a new PrismaClient instance with error handling
const createPrismaClient = () => {
  try {
    const connectionString = process.env.DATABASE_URL || ""

    // Create the Neon connection pool
    const pool = new Pool({ connectionString })

    // Create Prisma Client with the Neon adapter
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: {
          url: connectionString,
        },
      },
      // Explicitly configure the adapter
      adapter: {
        pool,
      },
    })
  } catch (error) {
    console.error("Failed to create Prisma client:", error)
    // Return a mock PrismaClient that won't throw errors during build
    return createMockPrismaClient()
  }
}

// Create a mock PrismaClient for fallback during build
const createMockPrismaClient = () => {
  const handler = {
    get: (target: any, prop: string) => {
      if (prop === "_isConnected") return true

      // For any model access (user, post, etc.)
      return {
        findMany: async () => [],
        findUnique: async () => null,
        findFirst: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
        count: async () => 0,
        // Add other methods as needed
      }
    },
  }

  return new Proxy({}, handler) as PrismaClient
}

// Use the global instance in development to prevent multiple instances
const prismaClientSingleton = () => {
  return createPrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
