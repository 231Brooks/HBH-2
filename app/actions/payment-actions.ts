"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createServiceOrderPaymentIntent, createTransactionFeePaymentIntent, verifyPaymentIntent } from "@/lib/stripe"
import { sendPaymentConfirmationEmail } from "@/lib/email-notifications"

// Create payment intent for service order
export async function createServiceOrderPayment(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Get the order details
    const order = await prisma.serviceOrder.findUnique({
      where: { id: orderId },
      include: {
        fees: true,
        service: true,
      },
    })

    if (!order) {
      return { success: false, error: "Order not found" }
    }

    // Verify the user is the client
    if (order.clientId !== session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Calculate total amount (order amount + fees)
    const totalAmount = order.amount + (order.fees[0]?.amount || 0)

    // Create payment intent
    const { clientSecret } = await createServiceOrderPaymentIntent(totalAmount, {
      orderId: order.id,
      serviceId: order.serviceId,
      clientId: order.clientId,
      providerId: order.providerId,
    })

    // Update order with payment intent
    await prisma.serviceOrder.update({
      where: { id: orderId },
      data: {
        status: "PENDING",
      },
    })

    return { success: true, clientSecret }
  } catch (error) {
    console.error("Failed to create service order payment:", error)
    return { success: false, error: "Failed to create payment" }
  }
}

// Create payment intent for transaction fee
export async function createTransactionFeePayment(transactionId: string, feeAmount = 100) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Get the transaction details
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return { success: false, error: "Transaction not found" }
    }

    // Verify the user is involved in the transaction
    const isInvolved =
      transaction.creatorId === session.user.id ||
      (await prisma.transactionParty.findFirst({
        where: {
          transactionId,
          userId: session.user.id,
        },
      }))

    if (!isInvolved) {
      return { success: false, error: "Unauthorized" }
    }

    // Create payment intent
    const { clientSecret } = await createTransactionFeePaymentIntent(feeAmount, {
      transactionId: transaction.id,
      userId: session.user.id,
    })

    return { success: true, clientSecret }
  } catch (error) {
    console.error("Failed to create transaction fee payment:", error)
    return { success: false, error: "Failed to create payment" }
  }
}

// Handle successful payment for service order
export async function handleServiceOrderPaymentSuccess(paymentIntentId: string) {
  try {
    // Verify the payment intent
    const { status, metadata } = await verifyPaymentIntent(paymentIntentId)

    if (status !== "succeeded") {
      return { success: false, error: "Payment not successful" }
    }

    const { orderId } = metadata

    // Update the order and fee status
    const order = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.serviceOrder.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
        },
        include: {
          service: true,
          client: true,
          provider: true,
          fees: true,
        },
      })

      // Update fee status
      if (updatedOrder.fees.length > 0) {
        await tx.fee.update({
          where: { id: updatedOrder.fees[0].id },
          data: {
            status: "PAID",
          },
        })
      }

      return updatedOrder
    })

    // Send confirmation email
    await sendPaymentConfirmationEmail({
      to: order.client.email!,
      orderId: order.id,
      serviceName: order.service.name,
      amount: order.amount,
      feeAmount: order.fees[0]?.amount || 0,
      date: new Date(),
    })

    revalidatePath(`/services/orders/${orderId}`)
    return { success: true, orderId }
  } catch (error) {
    console.error("Failed to handle payment success:", error)
    return { success: false, error: "Failed to process payment confirmation" }
  }
}

// Handle successful payment for transaction fee
export async function handleTransactionFeePaymentSuccess(paymentIntentId: string) {
  try {
    // Verify the payment intent
    const { status, metadata } = await verifyPaymentIntent(paymentIntentId)

    if (status !== "succeeded") {
      return { success: false, error: "Payment not successful" }
    }

    const { transactionId, feeId, userId } = metadata

    // Update or create the fee record
    const fee = await prisma.$transaction(async (tx) => {
      let fee

      if (feeId) {
        // Update existing fee
        fee = await tx.fee.update({
          where: { id: feeId },
          data: {
            status: "PAID",
          },
        })
      } else {
        // Create new fee
        fee = await tx.fee.create({
          data: {
            userId,
            amount: 100, // Fixed $100 fee
            type: "TRANSACTION_FEE",
            description: "Transaction processing fee",
            status: "PAID",
          },
        })
      }

      // Update transaction progress if needed
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      })

      if (transaction && transaction.progress < 25) {
        await tx.transaction.update({
          where: { id: transactionId },
          data: { progress: 25 },
        })
      }

      return fee
    })

    // Get user email for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    if (user?.email) {
      // Send confirmation email
      await sendPaymentConfirmationEmail({
        to: user.email,
        transactionId,
        feeType: "Transaction Fee",
        amount: 100, // Fixed $100 fee
        date: new Date(),
      })
    }

    revalidatePath(`/progress/${transactionId}`)
    return { success: true, feeId: fee.id }
  } catch (error) {
    console.error("Failed to handle transaction fee payment success:", error)
    return { success: false, error: "Failed to process payment confirmation" }
  }
}
