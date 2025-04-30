import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Starting database migration...")

    // Run Prisma migrations
    await execAsync("npx prisma migrate deploy")

    console.log("Migrations applied successfully")

    // Check if we need to seed initial data
    const userCount = await prisma.user.count()

    if (userCount === 0) {
      console.log("No users found. Running seed script...")
      // Run the seed script
      await execAsync("npm run seed")
      console.log("Seed script completed successfully")
    } else {
      console.log(`Found ${userCount} existing users. Skipping seed script.`)
    }

    console.log("Migration process completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
