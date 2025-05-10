"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

  try {
    // In a real app, you would hash the password and compare with the stored hash
    // This is a simplified example that directly queries the database
    const users = await sql`
      SELECT id, email, first_name, last_name 
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `

    if (users.length === 0) {
      return {
        error: "Invalid email or password",
      }
    }

    const user = users[0]

    // In a real app, you would use a proper password comparison
    // For example: const isValid = await bcrypt.compare(password, user.password_hash)
    // For this example, we're just checking if the user exists

    // Set a session cookie
    cookies().set(
      "session",
      JSON.stringify({
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      error: "Authentication failed",
    }
  }
}

export async function logout() {
  cookies().delete("session")
  redirect("/login")
}
