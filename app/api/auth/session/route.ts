import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json(null)
    }

    const session = JSON.parse(sessionCookie.value)

    return NextResponse.json({
      id: session.userId,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(null)
  }
}
