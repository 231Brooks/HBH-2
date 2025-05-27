"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Existing functions...

// Process transaction fee
export async function processTransactionFee(data: {
  transactionId: string
  amount: number
  description: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to process a transaction" }
  }

  const { transactionId, amount, description } = data

  try {
    // Verify the transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fees: {
          where: { type: "TRANSACTION_FEE" },
        },
      },
    })

    if (!transaction) {
      return { success: false, error: "Transaction not found" }
    }

    // Check if fee has already been paid
    if (transaction.fees.length > 0) {
      const existingFee = transaction.fees[0]
      if (existingFee.status === "PAID") {
        return { success: false, error: "Transaction fee has already been paid" }
      }
    }

    // Create or update the fee record
    const fee = await prisma.$transaction(async (tx) => {
      // If fee exists but not paid, update it
      if (transaction.fees.length > 0) {
        return await tx.fee.update({
          where: { id: transaction.fees[0].id },
          data: {
            status: "PAID",
            updatedAt: new Date(),
          },
        })
      }

      // Otherwise create a new fee
      return await tx.fee.create({
        data: {
          amount,
          type: "TRANSACTION_FEE",
          description,
          status: "PAID",
          transactionId,
        },
      })
    })

    // Update transaction progress if needed
    if (transaction.progress < 25) {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { progress: 25 },
      })
    }

    revalidatePath(`/progress`)
    return { success: true, feeId: fee.id }
  } catch (error) {
    console.error("Failed to process transaction fee:", error)
    return { success: false, error: "Failed to process transaction fee" }
  }
}

// Get transaction fees for admin reporting
export async function getTransactionFees(options: {
  status?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { fees: [], total: 0, hasMore: false }
  }

  const { status, startDate, endDate, limit = 50, offset = 0 } = options

  const where: any = { type: "TRANSACTION_FEE" }

  // Apply filters
  if (status) where.status = status
  if (startDate) where.createdAt = { gte: startDate }
  if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

  try {
    const fees = await prisma.fee.findMany({
      where,
      include: {
        transaction: {
          include: {
            property: { select: { address: true, city: true, state: true } },
            creator: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.fee.count({ where })

    return {
      fees,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch transaction fees:", error)
    return { fees: [], total: 0, hasMore: false }
  }
}
