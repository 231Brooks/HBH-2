import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Check if we have basic environment setup
    const hasDatabase = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    const hasSupabase = !!(process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)

    if (!hasDatabase && !hasSupabase) {
      return NextResponse.json(
        {
          error: "No database configuration found",
          message: "Please configure either PostgreSQL or Supabase environment variables",
          variables: [],
        },
        { status: 503 },
      )
    }

    // Get category filter from query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Basic environment variables check without requiring auth or prisma
    const basicVariables = [
      {
        name: "DATABASE_URL",
        description: "PostgreSQL database connection string",
        category: "database",
        required: true,
        sensitive: true,
        isSet: !!process.env.DATABASE_URL,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        description: "Supabase project URL",
        category: "database",
        required: false,
        sensitive: false,
        isSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      {
        name: "SUPABASE_SERVICE_ROLE_KEY",
        description: "Supabase service role key",
        category: "database",
        required: false,
        sensitive: true,
        isSet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      {
        name: "NEXTAUTH_SECRET",
        description: "NextAuth.js secret for JWT signing",
        category: "auth",
        required: true,
        sensitive: true,
        isSet: !!process.env.NEXTAUTH_SECRET,
      },
      {
        name: "STRIPE_SECRET_KEY",
        description: "Stripe secret key for payments",
        category: "payments",
        required: false,
        sensitive: true,
        isSet: !!process.env.STRIPE_SECRET_KEY,
      },
    ]

    // Filter variables by category if provided
    let variables = basicVariables
    if (category) {
      variables = variables.filter((v) => v.category === category)
    }

    return NextResponse.json({
      variables,
      status: "partial",
      message: "Basic environment check completed",
    })
  } catch (error) {
    console.error("Environment variables status error:", error)
    return NextResponse.json(
      {
        error: "Failed to check environment variables",
        message: error instanceof Error ? error.message : "Unknown error",
        variables: [],
      },
      { status: 500 },
    )
  }
}
