import { PrismaClient } from "@prisma/client"

// Configuration for production-ready connection pooling
interface PrismaPoolConfig {
  maxConnections: number
  minConnections: number
  idleTimeout: number
}

const defaultConfig: PrismaPoolConfig = {
  maxConnections: 20, // Maximum number of connections
  minConnections: 5, // Minimum number of connections to keep idle
  idleTimeout: 30000, // How long a connection can remain idle (ms)
}

let prismaClientSingleton: PrismaClient | undefined

// Create a singleton Prisma client with connection pooling
export function getPrismaClient(config: Partial<PrismaPoolConfig> = {}): PrismaClient {
  const poolConfig = { ...defaultConfig, ...config }

  if (!prismaClientSingleton) {
    prismaClientSingleton = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Connection pooling is handled automatically by Prisma
      // For advanced connection pooling, use Prisma Accelerate or connection poolers like PgBouncer
    })

    // Add event listeners for connection issues
    // Note: beforeExit is not available in Prisma 5.0+, using process event instead
    process.on("beforeExit", async () => {
      console.log("Prisma Client is shutting down")
      await prismaClientSingleton.$disconnect()
    })
  }

  return prismaClientSingleton
}

// Use in development environments
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = getPrismaClient()
}

// For use in server components/actions
export const prisma = getPrismaClient()

// Export pooled Prisma client as default
export default prisma
