import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { cookies } from "next/headers"
import type { User } from "@/types/database"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = cookies().get("session")
    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const users = await query<User>(
      "SELECT id, email, first_name, last_name, phone_number, profile_image_url FROM users WHERE id = $1",
      [userId],
    )

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = cookies().get("session")
    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    const { first_name, last_name, phone_number } = await request.json()

    const result = await query<User>(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone_number = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, email, first_name, last_name, phone_number, profile_image_url`,
      [first_name, last_name, phone_number, userId],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}
