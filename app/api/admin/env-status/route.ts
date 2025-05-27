import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { ENV_VARIABLES, isEnvSet } from "@/lib/env-checker"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get category filter from query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Filter variables by category if provided
    let variables = ENV_VARIABLES
    if (category) {
      variables = variables.filter((v) => v.category === category)
    }

    // Check which variables are set
    const variablesStatus = variables.map((variable) => ({
      name: variable.name,
      description: variable.description,
      category: variable.category,
      required: variable.required,
      sensitive: variable.sensitive || false,
      isSet: isEnvSet(variable.name),
    }))

    return NextResponse.json({ variables: variablesStatus })
  } catch (error) {
    console.error("Environment variables status error:", error)
    return NextResponse.json({ error: "Failed to check environment variables" }, { status: 500 })
  }
}
