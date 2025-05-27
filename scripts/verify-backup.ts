import { createClient } from "@supabase/supabase-js"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const backupDir = path.join(process.cwd(), "backups")
const testTableName = "backup_verification_test"
const testData = { id: "test-" + Date.now(), value: "Backup Test" }

async function main() {
  try {
    console.log("Starting backup verification...")

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Create test table if it doesn't exist
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS ${testTableName} (
          id TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    // Insert test data
    const { error: insertError } = await supabase.from(testTableName).insert(testData)

    if (insertError) throw insertError

    console.log("Test data inserted:", testData)

    // Trigger backup
    const backupFilename = `backup-${Date.now()}.sql`
    const backupPath = path.join(backupDir, backupFilename)

    // Use pg_dump to create backup (requires PostgreSQL client tools)
    const pgDumpCommand = `PGPASSWORD=${process.env.SUPABASE_POSTGRES_PASSWORD} pg_dump -h ${process.env.SUPABASE_POSTGRES_HOST} -U ${process.env.SUPABASE_POSTGRES_USER} -d ${process.env.SUPABASE_POSTGRES_DATABASE} -t ${testTableName} -f ${backupPath}`

    console.log("Creating backup...")
    await execAsync(pgDumpCommand)

    // Verify backup file exists and has content
    if (!fs.existsSync(backupPath)) {
      throw new Error("Backup file was not created")
    }

    const backupSize = fs.statSync(backupPath).size
    if (backupSize === 0) {
      throw new Error("Backup file is empty")
    }

    console.log(`Backup created: ${backupPath} (${backupSize} bytes)`)

    // Delete test data
    const { error: deleteError } = await supabase.from(testTableName).delete().eq("id", testData.id)

    if (deleteError) throw deleteError

    console.log("Test data deleted")

    // Restore from backup
    const pgRestoreCommand = `PGPASSWORD=${process.env.SUPABASE_POSTGRES_PASSWORD} psql -h ${process.env.SUPABASE_POSTGRES_HOST} -U ${process.env.SUPABASE_POSTGRES_USER} -d ${process.env.SUPABASE_POSTGRES_DATABASE} -f ${backupPath}`

    console.log("Restoring from backup...")
    await execAsync(pgRestoreCommand)

    // Verify data was restored
    const { data: restoredData, error: queryError } = await supabase
      .from(testTableName)
      .select("*")
      .eq("id", testData.id)

    if (queryError) throw queryError

    if (!restoredData || restoredData.length === 0) {
      throw new Error("Data was not restored from backup")
    }

    console.log("Data successfully restored from backup:", restoredData[0])

    // Clean up
    await supabase.rpc("exec_sql", {
      sql: `DELETE FROM ${testTableName} WHERE id = '${testData.id}';`,
    })

    console.log("Backup verification completed successfully!")

    // Log success to database
    await supabase.from("backup_logs").insert({
      status: "verified",
      type: "test",
      notes: `Backup verification successful: ${backupFilename}`,
    })

    return { success: true, backupPath }
  } catch (error: any) {
    console.error("Backup verification failed:", error)

    // Log failure to database
    await supabase.from("backup_logs").insert({
      status: "failed",
      type: "test",
      notes: `Backup verification failed: ${error.message}`,
    })

    return { success: false, error: error.message }
  }
}

// Run if executed directly
if (require.main === module) {
  main()
    .then((result) => {
      if (!result.success) {
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error("Unhandled error:", error)
      process.exit(1)
    })
}

export default main
