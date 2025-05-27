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
      // Connection pooling config
      // Note: In Prisma, connection pooling is handled automatically
      // These settings help tune it for production
      connectionLimit: poolConfig.maxConnections,
    })

    // Add event listeners for connection issues
    prismaClientSingleton.$on("beforeExit", async () => {
      console.log("Prisma Client is shutting down")
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
