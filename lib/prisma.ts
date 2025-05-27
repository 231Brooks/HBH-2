import { PrismaClient } from "@prisma/client"

// This prevents multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Function to create a new PrismaClient instance with error handling
const createPrismaClient = () => {
  try {
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
