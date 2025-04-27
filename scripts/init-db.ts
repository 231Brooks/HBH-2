import { sql } from "@/lib/db"
import fs from "fs"
import path from "path"

async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Read the schema SQL file
    const schemaPath = path.join(process.cwd(), "db", "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Execute the schema SQL
    await sql(schemaSql)

    console.log("Database schema created successfully")

    // Add some seed data
    await seedDatabase()

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

async function seedDatabase() {
  console.log("Seeding database with initial data...")

  // Insert sample users
  await sql`
    INSERT INTO users (name, email, password_hash, role, profile_image)
    VALUES 
      ('John Doe', 'john@example.com', '$2b$10$dummyhash', 'user', '/images/profiles/john.jpg'),
      ('Jane Smith', 'jane@example.com', '$2b$10$dummyhash', 'agent', '/images/profiles/jane.jpg'),
      ('Admin User', 'admin@example.com', '$2b$10$dummyhash', 'admin', '/images/profiles/admin.jpg')
    ON CONFLICT (email) DO NOTHING;
  `

  // Insert sample properties
  await sql`
    INSERT INTO properties (
      title, description, price, address, city, state, zip_code, 
      bedrooms, bathrooms, square_feet, property_type, listing_type, user_id
    )
    VALUES 
      (
        'Modern Downtown Condo', 
        'Beautiful condo in the heart of downtown with amazing views.', 
        450000, 
        '123 Main St', 
        'Austin', 
        'TX', 
        '78701', 
        2, 
        2, 
        1200, 
        'condo', 
        'sale', 
        2
      ),
      (
        'Spacious Family Home', 
        'Perfect family home with large backyard and updated kitchen.', 
        650000, 
        '456 Oak Ave', 
        'Austin', 
        'TX', 
        '78704', 
        4, 
        3, 
        2800, 
        'house', 
        'sale', 
        2
      )
    ON CONFLICT DO NOTHING;
  `

  console.log("Seed data inserted successfully")
}

// Run the initialization
initializeDatabase()
