"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

// Get all title companies
export async function getTitleCompanies() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const titleCompanies = await sql`
      SELECT * FROM "TitleCompany"
      ORDER BY name ASC
    `
    return { success: true, titleCompanies }
  } catch (error) {
    console.error("Failed to fetch title companies:", error)
    return { success: false, error: "Failed to fetch title companies" }
  }
}

// Get a title company by ID
export async function getTitleCompanyById(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const [titleCompany] = await sql`
      SELECT * FROM "TitleCompany"
      WHERE id = ${id}
    `

    if (!titleCompany) {
      return { success: false, error: "Title company not found" }
    }

    return { success: true, titleCompany }
  } catch (error) {
    console.error("Failed to fetch title company:", error)
    return { success: false, error: "Failed to fetch title company" }
  }
}

// Create a new title company
export async function createTitleCompany(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to create a title company" }
  }

  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const website = formData.get("website") as string
  const logo = (formData.get("logo") as string) || "/placeholder.svg?key=6rgfy"

  if (!name || !email) {
    return { success: false, error: "Name and email are required" }
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const [titleCompany] = await sql`
      INSERT INTO "TitleCompany" (
        id, name, address, city, state, "zipCode", phone, email, website, logo, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, ${name}, ${address}, ${city}, ${state}, ${zipCode}, 
        ${phone}, ${email}, ${website}, ${logo}, NOW(), NOW()
      )
      RETURNING *
    `

    // Add the creator as a title company user with admin role
    await sql`
      INSERT INTO "TitleCompanyUser" (
        id, "userId", "titleCompanyId", role, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, ${session.user.id}, ${titleCompany.id}, 'ADMIN', NOW(), NOW()
      )
    `

    revalidatePath("/title-companies")
    return { success: true, titleCompanyId: titleCompany.id }
  } catch (error) {
    console.error("Failed to create title company:", error)
    return { success: false, error: "Failed to create title company" }
  }
}

// Update a title company
export async function updateTitleCompany(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to update a title company" }
  }

  // Check if user is an admin of this title company
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const [titleCompanyUser] = await sql`
      SELECT * FROM "TitleCompanyUser"
      WHERE "titleCompanyId" = ${id}
      AND "userId" = ${session.user.id}
      AND role = 'ADMIN'
    `

    if (!titleCompanyUser) {
      return { success: false, error: "You do not have permission to update this title company" }
    }

    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const zipCode = formData.get("zipCode") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const website = formData.get("website") as string
    const logo = formData.get("logo") as string

    if (!name || !email) {
      return { success: false, error: "Name and email are required" }
    }

    await sql`
      UPDATE "TitleCompany"
      SET 
        name = ${name},
        address = ${address},
        city = ${city},
        state = ${state},
        "zipCode" = ${zipCode},
        phone = ${phone},
        email = ${email},
        website = ${website},
        logo = CASE WHEN ${logo} = '' THEN logo ELSE ${logo} END,
        "updatedAt" = NOW()
      WHERE id = ${id}
    `

    revalidatePath(`/title-companies/${id}`)
    revalidatePath("/title-companies")
    return { success: true }
  } catch (error) {
    console.error("Failed to update title company:", error)
    return { success: false, error: "Failed to update title company" }
  }
}

export async function deleteTitleCompany(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      DELETE FROM "TitleCompany"
      WHERE id = ${id}
    `

    revalidatePath("/title-companies")
    return { success: true, message: "Title company deleted successfully" }
  } catch (error) {
    console.error(`Error deleting title company with ID ${id}:`, error)
    return { success: false, message: "Failed to delete title company" }
  }
}

export async function assignTitleCompanyToTransaction(transactionId: string, titleCompanyId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      UPDATE "Transaction"
      SET "titleCompanyId" = ${titleCompanyId}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${transactionId}
    `

    revalidatePath(`/progress/${transactionId}`)
    return { success: true, message: "Title company assigned successfully" }
  } catch (error) {
    console.error(`Error assigning title company to transaction:`, error)
    return { success: false, message: "Failed to assign title company" }
  }
}

// Get transactions associated with a title company
export async function getTitleCompanyTransactions(titleCompanyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to view transactions" }
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if user is associated with this title company
    const [titleCompanyUser] = await sql`
      SELECT * FROM "TitleCompanyUser"
      WHERE "titleCompanyId" = ${titleCompanyId}
      AND "userId" = ${session.user.id}
    `

    if (!titleCompanyUser) {
      return { success: false, error: "You do not have access to this title company's transactions" }
    }

    const transactions = await sql`
      SELECT t.*, p.address, p.city, p.state
      FROM "Transaction" t
      JOIN "Property" p ON t."propertyId" = p.id
      WHERE t."titleCompanyId" = ${titleCompanyId}
      ORDER BY t."updatedAt" DESC
    `

    return { success: true, transactions }
  } catch (error) {
    console.error("Failed to fetch title company transactions:", error)
    return { success: false, error: "Failed to fetch transactions" }
  }
}

// Add a user to a title company
export async function addTitleCompanyUser(titleCompanyId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to add users" }
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if current user is an admin of this title company
    const [titleCompanyAdmin] = await sql`
      SELECT * FROM "TitleCompanyUser"
      WHERE "titleCompanyId" = ${titleCompanyId}
      AND "userId" = ${session.user.id}
      AND role = 'ADMIN'
    `

    if (!titleCompanyAdmin) {
      return { success: false, error: "You do not have permission to add users to this title company" }
    }

    const email = formData.get("email") as string
    const role = formData.get("role") as string

    if (!email || !role) {
      return { success: false, error: "Email and role are required" }
    }

    // Find user by email
    const [user] = await sql`
      SELECT * FROM "User"
      WHERE email = ${email}
    `

    if (!user) {
      return { success: false, error: "User not found with that email" }
    }

    // Check if user is already associated with this title company
    const [existingUser] = await sql`
      SELECT * FROM "TitleCompanyUser"
      WHERE "titleCompanyId" = ${titleCompanyId}
      AND "userId" = ${user.id}
    `

    if (existingUser) {
      return { success: false, error: "User is already associated with this title company" }
    }

    // Add user to title company
    await sql`
      INSERT INTO "TitleCompanyUser" (
        id, "userId", "titleCompanyId", role, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, ${user.id}, ${titleCompanyId}, ${role}, NOW(), NOW()
      )
    `

    revalidatePath(`/title-companies/${titleCompanyId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to add title company user:", error)
    return { success: false, error: "Failed to add user to title company" }
  }
}

export async function removeTitleCompanyUser(userId: string, titleCompanyId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      DELETE FROM "TitleCompanyUser"
      WHERE "userId" = ${userId} AND "titleCompanyId" = ${titleCompanyId}
    `

    revalidatePath(`/title-companies/${titleCompanyId}`)
    return { success: true, message: "User removed from title company successfully" }
  } catch (error) {
    console.error("Error removing user from title company:", error)
    return { success: false, message: "Failed to remove user from title company" }
  }
}

export async function getTitleCompanyUsers(titleCompanyId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT tcu.*, u.name, u.email, u.avatar
      FROM "TitleCompanyUser" tcu
      JOIN "User" u ON tcu."userId" = u.id
      WHERE tcu."titleCompanyId" = ${titleCompanyId}
      ORDER BY tcu.role, u.name
    `
    return users
  } catch (error) {
    console.error(`Error fetching users for title company ${titleCompanyId}:`, error)
    throw new Error("Failed to fetch title company users")
  }
}

export async function getUserTitleCompanies(userId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const companies = await sql`
      SELECT tc.*, tcu.role
      FROM "TitleCompany" tc
      JOIN "TitleCompanyUser" tcu ON tc.id = tcu."titleCompanyId"
      WHERE tcu."userId" = ${userId}
      ORDER BY tc.name
    `
    return companies
  } catch (error) {
    console.error(`Error fetching title companies for user ${userId}:`, error)
    throw new Error("Failed to fetch user title companies")
  }
}
