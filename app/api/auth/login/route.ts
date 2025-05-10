import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { User } from "@/types/database"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In a real app, you would hash the password and compare with the stored hash
    // This is a simplified example
    const users = await query<User>("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // In a real app, you would use a proper password comparison
    // if (!comparePasswords(password, user.password_hash)) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   );
    // }

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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
