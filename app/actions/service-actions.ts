"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Existing functions...

// Create a service order with platform fee
export async function createServiceOrder(data: {
  serviceId: string
  providerId: string
  amount: number
  feeAmount: number
  description?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to place an order" }
  }

  const { serviceId, providerId, amount, feeAmount, description } = data

  try {
    // Verify the service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    // Create the order with transaction to ensure both order and fee are created
    const order = await prisma.$transaction(async (tx) => {
      // Create the service order
      const newOrder = await tx.serviceOrder.create({
        data: {
          serviceId,
          clientId: session.user.id,
          providerId,
          amount,
          description,
          status: "PENDING",
        },
      })

      // Create the fee record
      await tx.fee.create({
        data: {
          amount: feeAmount,
          type: "SERVICE_FEE",
          description: "5% platform service fee",
          status: "PENDING",
          serviceOrderId: newOrder.id,
        },
      })

      return newOrder
    })

    revalidatePath("/services")
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Failed to create service order:", error)
    return { success: false, error: "Failed to create service order" }
  }
}

// Get service orders for a user (as client or provider)
export async function getUserServiceOrders(options: {
  role: "client" | "provider"
  status?: string
  limit?: number
  offset?: number
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { orders: [], total: 0, hasMore: false }
  }

  const { role, status, limit = 10, offset = 0 } = options

  const where: any = {}

  // Filter by role
  if (role === "client") {
    where.clientId = session.user.id
  } else {
    where.providerId = session.user.id
  }

  // Filter by status if provided
  if (status) {
    where.status = status
  }

  try {
    const orders = await prisma.serviceOrder.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            image: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        fees: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.serviceOrder.count({ where })

    return {
      orders,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch service orders:", error)
    return { orders: [], total: 0, hasMore: false }
  }
}

// Get admin fee reports
export async function getAdminFeeReport(options: {
  type?: string
  status?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { fees: [], total: 0, hasMore: false, summary: { total: 0, paid: 0, pending: 0 } }
  }

  const { type, status, startDate, endDate, limit = 50, offset = 0 } = options

  const where: any = {}

  // Apply filters
  if (type) where.type = type
  if (status) where.status = status
  if (startDate) where.createdAt = { gte: startDate }
  if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

  try {
    const fees = await prisma.fee.findMany({
      where,
      include: {
        serviceOrder: {
          include: {
            service: { select: { name: true } },
            client: { select: { name: true } },
            provider: { select: { name: true } },
          },
        },
        transaction: {
          include: {
            property: { select: { address: true, city: true, state: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.fee.count({ where })

    // Get summary statistics
    const summary = await prisma.$transaction([
      prisma.fee.aggregate({
        _sum: { amount: true },
        where,
      }),
      prisma.fee.aggregate({
        _sum: { amount: true },
        where: { ...where, status: "PAID" },
      }),
      prisma.fee.aggregate({
        _sum: { amount: true },
        where: { ...where, status: "PENDING" },
      }),
    ])

    return {
      fees,
      total,
      hasMore: offset + limit < total,
      summary: {
        total: summary[0]._sum.amount || 0,
        paid: summary[1]._sum.amount || 0,
        pending: summary[2]._sum.amount || 0,
      },
    }
  } catch (error) {
    console.error("Failed to fetch fee report:", error)
    return { fees: [], total: 0, hasMore: false, summary: { total: 0, paid: 0, pending: 0 } }
  }
}
