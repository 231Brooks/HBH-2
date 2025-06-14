import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import prisma from "./prisma"

// Server-side Supabase client for authentication
export async function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Get current user session from Supabase
export async function getSupabaseSession() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting Supabase session:", error)
      return null
    }

    return session
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

// Get current user from database using Supabase session
export async function getCurrentUser() {
  try {
    const session = await getSupabaseSession()

    if (!session?.user?.email) {
      return null
    }

    // Find user in our database by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Legacy auth function for backward compatibility (deprecated)
export const auth = getCurrentUser
