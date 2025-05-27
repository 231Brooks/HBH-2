"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create a new appointment
export async function createAppointment(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an appointment")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const location = formData.get("location") as string
  const type = formData.get("type") as string

  // Validate required fields
  if (!title || !startTime || !endTime || !type) {
    throw new Error("Missing required fields")
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        type: type as any,
        userId: session.user.id,
      },
    })

    revalidatePath("/calendar")
    return { success: true, appointmentId: appointment.id }
  } catch (error) {
    console.error("Failed to create appointment:", error)
    return { success: false, error: "Failed to create appointment" }
  }
}

// Get all appointments for the current user
export async function getUserAppointments(options: {
  startDate?: Date
  endDate?: Date
  type?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { appointments: [] }
  }

  const { startDate, endDate, type } = options

  const where: any = {
    userId: session.user.id,
  }

  if (startDate || endDate) {
    where.startTime = {}
    if (startDate) where.startTime.gte = startDate
    if (endDate) where.startTime.lte = endDate
  }

  if (type) where.type = type

  try {
    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { startTime: "asc" },
    })

    return { appointments }
  } catch (error) {
    console.error("Failed to fetch appointments:", error)
    return { appointments: [] }
  }
}

// Update an appointment
export async function updateAppointment(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update an appointment")
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      throw new Error("Appointment not found")
    }

    if (appointment.userId !== session.user.id) {
      throw new Error("You do not have permission to update this appointment")
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const location = formData.get("location") as string
    const type = formData.get("type") as string

    await prisma.appointment.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        location,
        type: type as any,
      },
    })

    revalidatePath("/calendar")
    return { success: true }
  } catch (error) {
    console.error("Failed to update appointment:", error)
    return { success: false, error: "Failed to update appointment" }
  }
}

// Delete an appointment
export async function deleteAppointment(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete an appointment")
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      throw new Error("Appointment not found")
    }

    if (appointment.userId !== session.user.id) {
      throw new Error("You do not have permission to delete this appointment")
    }

    await prisma.appointment.delete({
      where: { id },
    })

    revalidatePath("/calendar")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete appointment:", error)
    return { success: false, error: "Failed to delete appointment" }
  }
}
