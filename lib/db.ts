import { neon, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import { logger } from "./logger"

// Configure neon to use fetch
neonConfig.fetchConnectionCache = true

// Create a singleton PrismaClient instance
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  // In production, use the Neon serverless driver
  const connectionString = process.env.DATABASE_URL!
  const sql = neon(connectionString)

  prisma = new PrismaClient({
    adapter: new PrismaNeon(sql),
  })

  logger.info("Using Neon serverless driver for database connection")
} else {
  // In development, use the default Prisma client
  if (!global.prisma) {
    global.prisma = new PrismaClient()
    logger.info("Created new PrismaClient instance")
  }
  prisma = global.prisma
}

export default prisma
