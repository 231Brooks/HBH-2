import prisma from "./prisma"
import { sendEmail } from "./email"

type NotificationType =
  | "TRANSACTION_CREATED"
  | "DOCUMENT_UPLOADED"
  | "MILESTONE_COMPLETED"
  | "MESSAGE_RECEIVED"
  | "REVIEW_RECEIVED"
  | "APPOINTMENT_REMINDER"

interface NotificationData {
  title: string
  message: string
  link?: string
  recipientId: string
  senderId?: string
  entityId?: string
  entityType?: string
}

export async function createNotification(type: NotificationType, data: NotificationData) {
  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        type,
        title: data.title,
        message: data.message,
        link: data.link,
        recipientId: data.recipientId,
        senderId: data.senderId,
        entityId: data.entityId,
        entityType: data.entityType,
        read: false,
      },
    })

    // Get recipient's email preferences
    const recipient = await prisma.user.findUnique({
      where: { id: data.recipientId },
      select: { email: true, emailNotifications: true },
    })

    // Send email notification if enabled
    if (recipient?.email && recipient?.emailNotifications) {
      await sendEmail({
        to: recipient.email,
        subject: data.title,
        text: data.message,
        html: `
          <div>
            <h2>${data.title}</h2>
            <p>${data.message}</p>
            ${data.link ? `<p><a href="${data.link}">View Details</a></p>` : ""}
          </div>
        `,
      })
    }

    return notification
  } catch (error) {
    console.error("Failed to create notification:", error)
    return null
  }
}

export async function markNotificationAsRead(id: string, userId: string) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification || notification.recipientId !== userId) {
      throw new Error("Notification not found or unauthorized")
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return true
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return false
  }
}

export async function getUserNotifications(
  userId: string,
  options: { limit?: number; offset?: number; unreadOnly?: boolean } = {},
) {
  const { limit = 10, offset = 0, unreadOnly = false } = options

  try {
    const where = {
      recipientId: userId,
      ...(unreadOnly ? { read: false } : {}),
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const total = await prisma.notification.count({ where })

    return {
      notifications,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return { notifications: [], total: 0, hasMore: false }
  }
}
