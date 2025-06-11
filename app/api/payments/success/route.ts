import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const url = new URL(request.url)
    const transactionId = url.searchParams.get("transaction_id")
    const paymentId = url.searchParams.get("payment_id")

    if (!transactionId) {
      return NextResponse.redirect(new URL("/error?message=Missing+transaction+ID", request.url))
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: "PAID",
        paymentId,
        updatedAt: new Date(),
      },
    })

    // Redirect to transaction details page
    return NextResponse.redirect(new URL(`/progress/${transactionId}?payment=success`, request.url))
  } catch (error: any) {
    console.error("Payment success callback error:", error)
    return NextResponse.redirect(new URL("/error?message=Payment+processing+error", request.url))
  }
}
