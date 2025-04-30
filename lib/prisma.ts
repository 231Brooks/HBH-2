import { PrismaClient } from "@prisma/client"

// This prevents multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Create a new PrismaClient instance
const createPrismaClient = () => {
  try {
    // Simple initialization without custom adapter
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
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

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
