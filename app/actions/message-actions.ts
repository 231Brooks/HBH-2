"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Get all conversations for the current user
export async function getUserConversations() {
  const session = await auth()
  if (!session?.user?.id) {
    return { conversations: [] }
  }

  try {
    // Find all conversations where the current user is either the sender or receiver of any message
    const conversations = await prisma.conversation.findMany({
      where: {
        messages: {
          some: {
            OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // For each conversation, determine the other user (not the current user)
    const conversationsWithOtherUser = conversations.map((conversation) => {
      const lastMessage = conversation.messages[0]
      const otherUser = lastMessage.senderId === session.user.id ? lastMessage.receiver : lastMessage.sender
      const unreadCount = 0 // This would need a separate query to calculate

      return {
        ...conversation,
        otherUser,
        unreadCount,
      }
    })

    return { conversations: conversationsWithOtherUser }
  } catch (error) {
    console.error("Failed to fetch conversations:", error)
    return { conversations: [] }
  }
}

// Get messages for a specific conversation
export async function getConversationMessages(conversationId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { messages: [] }
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      return { messages: [] }
    }

    // Check if user is part of this conversation
    const isParticipant = conversation.messages.some(
      (message) => message.senderId === session.user.id || message.receiverId === session.user.id,
    )

    if (!isParticipant) {
      throw new Error("You do not have access to this conversation")
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return { messages: conversation.messages }
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return { messages: [] }
  }
}

// Send a new message
export async function sendMessage(receiverId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to send a message")
  }

  if (!content.trim()) {
    throw new Error("Message cannot be empty")
  }

  try {
    // Find or create a conversation between these two users
    let conversation = await prisma.conversation.findFirst({
      where: {
        messages: {
          some: {
            OR: [
              {
                senderId: session.user.id,
                receiverId,
              },
              {
                senderId: receiverId,
                receiverId: session.user.id,
              },
            ],
          },
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {},
      })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        conversationId: conversation.id,
      },
    })

    // Update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    revalidatePath("/messages")
    return { success: true, messageId: message.id }
  } catch (error) {
    console.error("Failed to send message:", error)
    return { success: false, error: "Failed to send message" }
  }
}
