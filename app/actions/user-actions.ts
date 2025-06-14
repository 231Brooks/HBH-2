"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get the current user's profile
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { user: null }
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
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

    return { user: userProfile }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return { user: null }
  }
}

// Update the current user's profile
export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user?.id) {
    throw new Error("You must be logged in to update your profile")
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const location = formData.get("location") as string
  const phone = formData.get("phone") as string
  const image = formData.get("image") as string
  const coverPhoto = formData.get("coverPhoto") as string

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        bio,
        location,
        phone,
        image,
        coverPhoto,
      },
    })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

// Update user profile image
export async function updateUserImage(imageUrl: string, type: 'profile' | 'cover') {
  const user = await getCurrentUser()
  if (!user?.id) {
    throw new Error("You must be logged in to update your profile")
  }

  try {
    const updateData = type === 'profile'
      ? { image: imageUrl }
      : { coverPhoto: imageUrl }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user image:", error)
    return { success: false, error: "Failed to update user image" }
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
