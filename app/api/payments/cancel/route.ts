import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const url = new URL(request.url)
    const transactionId = url.searchParams.get("transaction_id")

    if (!transactionId) {
      return NextResponse.redirect(new URL("/error?message=Missing+transaction+ID", request.url))
    }

    // Redirect to transaction details page with cancel message
    return NextResponse.redirect(new URL(`/progress/${transactionId}?payment=cancelled`, request.url))
  } catch (error: any) {
    console.error("Payment cancel callback error:", error)
    return NextResponse.redirect(new URL("/error?message=Payment+cancellation+error", request.url))
  }
}
