import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")
  const next = requestUrl.searchParams.get("next") || "/"

  // Handle errors from OAuth provider
  if (error) {
    console.error("OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/auth/error?error=${error}&description=${error_description}`, requestUrl.origin)
    )
  }

  if (code) {
    try {
      const cookieStore = cookies()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables")
        return NextResponse.redirect(new URL("/auth/error?error=config", requestUrl.origin))
      }

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

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Session exchange error:", exchangeError)
        return NextResponse.redirect(new URL("/auth/error?error=session_exchange", requestUrl.origin))
      }

      console.log("Successfully exchanged code for session:", data.session?.user?.email)
    } catch (err) {
      console.error("Callback error:", err)
      return NextResponse.redirect(new URL("/auth/error?error=callback", requestUrl.origin))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
