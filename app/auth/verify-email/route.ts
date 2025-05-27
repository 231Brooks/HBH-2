import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const type = url.searchParams.get("type") || "email"

  if (!token) {
    return NextResponse.redirect(new URL("/auth/error?error=missing_token", url.origin))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    let result

    if (type === "email") {
      // Verify email
      result = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      })
    } else if (type === "recovery") {
      // Password recovery
      return NextResponse.redirect(new URL(`/auth/reset-password?token=${token}`, url.origin))
    }

    if (result?.error) {
      return NextResponse.redirect(new URL(`/auth/error?error=${result.error.message}`, url.origin))
    }

    // Redirect to success page
    return NextResponse.redirect(new URL("/auth/verify-success", url.origin))
  } catch (error: any) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(new URL(`/auth/error?error=${error.message}`, url.origin))
  }
}
