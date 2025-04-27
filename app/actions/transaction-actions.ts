"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create a new transaction
export async function createTransaction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a transaction")
  }

  const propertyId = formData.get("propertyId") as string
  const type = formData.get("type") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const closingDate = formData.get("closingDate") as string
  const notes = formData.get("notes") as string
  const titleCompanyId = (formData.get("titleCompanyId") as string) || null

  // Validate required fields
  if (!propertyId || !type || !price) {
    throw new Error("Missing required fields")
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        propertyId,
        creatorId: session.user.id,
        type: type as any,
        price,
        closingDate: closingDate ? new Date(closingDate) : null,
        notes,
        titleCompanyId,
        status: "IN_PROGRESS",
        progress: 0,
      },
    })

    // Add the creator as a party to the transaction
    await prisma.transactionParty.create({
      data: {
        transactionId: transaction.id,
        userId: session.user.id,
        role: type === "PURCHASE" ? "BUYER" : "SELLER",
      },
    })

    revalidatePath("/progress")
    return { success: true, transactionId: transaction.id }
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return { success: false, error: "Failed to create transaction" }
  }
}

// Get all transactions for the current user
export async function getUserTransactions(options: {
  status?: string
  limit?: number
  offset?: number
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { transactions: [], total: 0, hasMore: false }
  }

  const { status, limit = 10, offset = 0 } = options

  const where: any = {
    OR: [
      { creatorId: session.user.id },
      {
        parties: {
          some: {
            userId: session.user.id,
          },
        },
      },
    ],
  }

  if (status) where.status = status

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        property: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        parties: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        titleCompany: true,
        milestones: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.transaction.count({ where })

    return {
      transactions,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return { transactions: [], total: 0, hasMore: false }
  }
}

// Get a single transaction by ID
export async function getTransactionById(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to view a transaction")
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            images: true,
          },
        },
        parties: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        titleCompany: true,
        milestones: {
          orderBy: { dueDate: "asc" },
        },
      },
    })

    // Check if user has access to this transaction
    if (!transaction) {
      return { transaction: null }
    }

    const isParticipant =
      transaction.creatorId === session.user.id || transaction.parties.some((party) => party.userId === session.user.id)

    if (!isParticipant) {
      throw new Error("You do not have access to this transaction")
    }

    return { transaction }
  } catch (error) {
    console.error("Failed to fetch transaction:", error)
    return { transaction: null }
  }
}

// Update transaction progress
export async function updateTransactionProgress(id: string, progress: number) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a transaction")
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        parties: true,
      },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Check if user has access to update this transaction
    const isParticipant =
      transaction.creatorId === session.user.id || transaction.parties.some((party) => party.userId === session.user.id)

    if (!isParticipant) {
      throw new Error("You do not have permission to update this transaction")
    }

    await prisma.transaction.update({
      where: { id },
      data: { progress },
    })

    revalidatePath(`/progress/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update transaction progress:", error)
    return { success: false, error: "Failed to update transaction progress" }
  }
}

// Add a document to a transaction
export async function addTransactionDocument(transactionId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to add a document")
  }

  const name = formData.get("name") as string
  const url = formData.get("url") as string
  const type = formData.get("type") as string

  if (!name || !url || !type) {
    throw new Error("Missing required fields")
  }

  try {
    await prisma.document.create({
      data: {
        name,
        url,
        type: type as any,
        transactionId,
        uploadedById: session.user.id,
      },
    })

    revalidatePath(`/progress/${transactionId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to add document:", error)
    return { success: false, error: "Failed to add document" }
  }
}
