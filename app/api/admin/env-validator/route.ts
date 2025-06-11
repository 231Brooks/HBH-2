import { NextResponse } from "next/server"
import { getAllEnvVariablesWithStatus } from "@/lib/env-validator-enhanced"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all environment variables with validation status
    const result = await getAllEnvVariablesWithStatus()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error validating environment variables:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
