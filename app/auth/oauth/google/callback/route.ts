import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  // Handle errors from OAuth provider
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${error}&description=${error_description}`, requestUrl.origin),
    )
  }

  if (code) {
    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        cookieStorage: {
          domain: requestUrl.hostname,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        },
      },
    })

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
