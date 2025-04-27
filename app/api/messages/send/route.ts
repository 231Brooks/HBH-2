import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher-server"
import prisma from "@/lib/prisma"
import { ApiError, handleApiError } from "@/lib/api-error"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      throw ApiError.unauthorized()
    }

    const body = await request.json()
    const { channelName, message } = body

    if (!channelName || !message || !message.content) {
      throw ApiError.badRequest("Missing required fields")
    }

    // Validate that the sender is the current user
    if (message.sender.id !== session.user.id) {
      throw ApiError.forbidden("Cannot send messages as another user")
    }

    // Find or create conversation
    let conversationId = message.conversationId

    if (!conversationId) {
      // Extract recipient ID from channel name (assuming format: "chat-{senderId}-{recipientId}")
      const channelParts = channelName.split("-")
      if (channelParts.length !== 3 || channelParts[0] !== "chat") {
        throw ApiError.badRequest("Invalid channel name format")
      }

      const recipientId = channelParts[1] === session.user.id ? channelParts[2] : channelParts[1]

      // Check if conversation exists
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              messages: {
                some: {
                  AND: [{ senderId: session.user.id }, { receiverId: recipientId }],
                },
              },
            },
            {
              messages: {
                some: {
                  AND: [{ senderId: recipientId }, { receiverId: session.user.id }],
                },
              },
            },
          ],
        },
      })

      if (existingConversation) {
        conversationId = existingConversation.id
      } else {
        // Create new conversation
        const newConversation = await prisma.conversation.create({
          data: {},
        })
        conversationId = newConversation.id
      }
    }

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: {
        content: message.content,
        senderId: session.user.id,
        receiverId: message.receiverId,
        conversationId,
      },
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

    // Format message for Pusher
    const pusherMessage = {
      id: savedMessage.id,
      content: savedMessage.content,
      sender: {
        id: savedMessage.sender.id,
        name: savedMessage.sender.name,
        avatar: savedMessage.sender.image,
      },
      timestamp: savedMessage.createdAt.toISOString(),
    }

    // Trigger Pusher event
    await pusherServer.trigger(channelName, "new-message", pusherMessage)

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        type: "message",
        title: "New message",
        message: `You have a new message from ${session.user.name}`,
        recipientId: message.receiverId,
        entityId: savedMessage.id,
        entityType: "message",
      },
    })

    // Trigger notification event
    await pusherServer.trigger(`user-${message.receiverId}-notifications`, "new-notification", {
      id: crypto.randomUUID(),
      message: `New message from ${session.user.name}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "message",
    })

    return NextResponse.json({ success: true, message: pusherMessage })
  } catch (error) {
    return handleApiError(error, "Messages API")
  }
}
