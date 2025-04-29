import { PrismaClient } from "@prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// This prevents multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Configure Neon for serverless environments
if (process.env.NODE_ENV === "production") {
  neonConfig.fetchConnectionCache = true
}

// Function to create a new PrismaClient instance with error handling
const createPrismaClient = () => {
  try {
    // In production, use the Neon serverless driver
    if (process.env.NODE_ENV === "production") {
      const connectionString = process.env.DATABASE_URL || ""

      return new PrismaClient({
        log: ["error"],
        datasources: {
          db: {
            url: connectionString,
          },
        },
        // Use the Neon serverless adapter in production
        adapter: {
          pool: new Pool({ connectionString }),
        },
      })
    }

    // In development, use the standard configuration
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  } catch (error) {
    console.error("Failed to create Prisma client:", error)
    throw error
  }
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
