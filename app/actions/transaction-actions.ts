"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createTransactionAppointment } from "./calendar-actions"

// Create a new transaction
export async function createTransaction(data: any) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a transaction")
  }

  try {
    // Create property first if needed
    let property = null
    if (data.property) {
      property = await prisma.property.create({
        data: {
          title: data.property.address,
          address: data.property.address,
          city: "Unknown",
          state: "Unknown",
          zipCode: "00000",
          price: data.property.price,
          ownerId: session.user.id,
          type: "RESIDENTIAL",
          status: "FOR_SALE",
        },
      })
    }

    // Create title company if needed
    let titleCompany = null
    if (data.titleCompany) {
      titleCompany = await prisma.titleCompany.create({
        data: {
          name: data.titleCompany.name,
          email: data.titleCompany.email,
          phone: data.titleCompany.phone,
        },
      })
    }

    const transaction = await prisma.transaction.create({
      data: {
        propertyId: property?.id || "",
        creatorId: session.user.id,
        type: data.type as any,
        price: property?.price || 0,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        notes: data.notes,
        titleCompanyId: titleCompany?.id,
        status: data.status || "IN_PROGRESS",
        progress: 0,
      },
      include: {
        property: true,
        titleCompany: true,
        parties: {
          include: {
            user: true,
          },
        },
      },
    })

    // Add the creator as a party to the transaction
    await prisma.transactionParty.create({
      data: {
        transactionId: transaction.id,
        userId: session.user.id,
        role: data.type === "PURCHASE" ? "BUYER" : "SELLER",
      },
    })

    // Automatically create closing appointment if closing date is provided
    if (transaction.closingDate) {
      try {
        const propertyAddress = property ? `${property.address}, ${property.city}, ${property.state}` : "Property Location TBD"

        await createTransactionAppointment({
          transactionId: transaction.id,
          title: `Property Closing - ${property?.title || property?.address || "Property"}`,
          description: `Closing appointment for ${data.type.toLowerCase()} transaction`,
          startTime: new Date(transaction.closingDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before closing date
          endTime: new Date(transaction.closingDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours after closing date
          location: propertyAddress,
          type: "CLOSING",
        })
      } catch (appointmentError) {
        console.error("Failed to create closing appointment:", appointmentError)
        // Don't fail the transaction creation if appointment creation fails
      }
    }

    revalidatePath("/progress")
    revalidatePath("/calendar")
    return { success: true, transaction, transactionId: transaction.id }
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

    return { success: true, transaction }
  } catch (error) {
    console.error("Failed to fetch transaction:", error)
    return { success: false, transaction: null }
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

// Update transaction status
export async function updateTransactionStatus(id: string, status: string) {
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
      data: { status: status as any },
    })

    revalidatePath(`/progress/${id}`)
    revalidatePath("/progress")
    return { success: true }
  } catch (error) {
    console.error("Failed to update transaction status:", error)
    return { success: false, error: "Failed to update transaction status" }
  }
}
