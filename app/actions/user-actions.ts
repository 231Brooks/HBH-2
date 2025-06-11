"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Get the current user's profile
export async function getCurrentUserProfile() {
  const session = await auth()
  if (!session?.user?.id) {
    return { user: null }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        properties: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        transactions: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            property: true,
          },
        },
        projects: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
        reviewsReceived: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
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

    return { user }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return { user: null }
  }
}

// Update the current user's profile
export async function updateUserProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your profile")
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const location = formData.get("location") as string
  const phone = formData.get("phone") as string
  const image = formData.get("image") as string

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        location,
        phone,
        image,
      },
    })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

// Get a user's public profile
export async function getUserPublicProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        location: true,
        rating: true,
        reviewCount: true,
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
        createdAt: true,
        role: true,
        services: {
          take: 3,
        },
        reviewsReceived: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
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

    return { user }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return { user: null }
  }
}
