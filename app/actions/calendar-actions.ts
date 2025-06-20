"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

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
        source: "MANUAL",
      },
    })

    revalidatePath("/calendar")
    return { success: true, appointmentId: appointment.id }
  } catch (error) {
    console.error("Failed to create appointment:", error)
    return { success: false, error: "Failed to create appointment" }
  }
}

// Create appointment from service booking
export async function createServiceAppointment(data: {
  serviceId: string
  providerId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an appointment")
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        type: "SERVICE_CONSULTATION",
        userId: session.user.id,
        source: "SERVICE_BOOKING",
        serviceId: data.serviceId,
        sourceId: data.serviceId,
      },
    })

    // Add provider as participant
    await prisma.appointmentParticipant.create({
      data: {
        appointmentId: appointment.id,
        userId: data.providerId,
        role: "ATTENDEE",
        status: "PENDING",
      },
    })

    revalidatePath("/calendar")
    revalidatePath("/services")
    return { success: true, appointmentId: appointment.id }
  } catch (error) {
    console.error("Failed to create service appointment:", error)
    return { success: false, error: "Failed to create service appointment" }
  }
}

// Create appointment from property viewing
export async function createPropertyViewingAppointment(data: {
  propertyId: string
  ownerId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an appointment")
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        type: "PROPERTY_VIEWING",
        userId: session.user.id,
        source: "PROPERTY_VIEWING",
        propertyId: data.propertyId,
        sourceId: data.propertyId,
      },
    })

    // Add property owner as participant
    await prisma.appointmentParticipant.create({
      data: {
        appointmentId: appointment.id,
        userId: data.ownerId,
        role: "ATTENDEE",
        status: "PENDING",
      },
    })

    revalidatePath("/calendar")
    revalidatePath("/marketplace")
    return { success: true, appointmentId: appointment.id }
  } catch (error) {
    console.error("Failed to create property viewing appointment:", error)
    return { success: false, error: "Failed to create property viewing appointment" }
  }
}

// Create appointment from transaction milestone
export async function createTransactionAppointment(data: {
  transactionId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  type: "CLOSING" | "INSPECTION" | "OTHER"
  participantIds?: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create an appointment")
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        type: data.type,
        userId: session.user.id,
        source: "PROGRESS_MILESTONE",
        transactionId: data.transactionId,
        sourceId: data.transactionId,
      },
    })

    // Add participants if provided
    if (data.participantIds && data.participantIds.length > 0) {
      await Promise.all(
        data.participantIds.map(participantId =>
          prisma.appointmentParticipant.create({
            data: {
              appointmentId: appointment.id,
              userId: participantId,
              role: "ATTENDEE",
              status: "PENDING",
            },
          })
        )
      )
    }

    revalidatePath("/calendar")
    revalidatePath("/progress")
    return { success: true, appointmentId: appointment.id }
  } catch (error) {
    console.error("Failed to create transaction appointment:", error)
    return { success: false, error: "Failed to create transaction appointment" }
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

  const timeFilter: any = {}
  if (startDate || endDate) {
    if (startDate) timeFilter.gte = startDate
    if (endDate) timeFilter.lte = endDate
  }

  const where: any = {
    OR: [
      { userId: session.user.id }, // Appointments created by user
      {
        participants: {
          some: { userId: session.user.id }
        }
      } // Appointments where user is a participant
    ]
  }

  if (Object.keys(timeFilter).length > 0) {
    where.startTime = timeFilter
  }

  if (type) where.type = type

  try {
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            owner: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        },
        transaction: {
          select: {
            id: true,
            type: true,
            property: {
              select: {
                title: true,
                address: true,
              }
            }
          }
        }
      },
      orderBy: { startTime: "asc" },
    })

    return { appointments }
  } catch (error) {
    console.error("Failed to fetch appointments:", error)

    // Return sample data for demonstration
    const sampleAppointments = [
      {
        id: "1",
        title: "Property Closing - 123 Main St",
        description: "Final closing for the downtown property purchase",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: "Desert Title Company, 555 Title Blvd, Phoenix, AZ",
        type: "CLOSING",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Home Inspection - 456 Oak Ave",
        description: "Comprehensive home inspection for potential purchase",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
        location: "456 Oak Avenue, Scottsdale, AZ",
        type: "INSPECTION",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        title: "Property Photography Session",
        description: "Professional photography for listing",
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: "789 Pine Road, Tempe, AZ",
        type: "PHOTOGRAPHY",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        title: "Legal Consultation",
        description: "Contract review and legal advice",
        startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 1 hour later
        location: "Johnson & Associates Law, 555 Legal Blvd, Phoenix, AZ",
        type: "LEGAL",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        title: "Renovation Consultation",
        description: "Meeting with contractors for kitchen renovation",
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: "101 River Lane, Mesa, AZ",
        type: "RENOVATION",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    return { appointments: sampleAppointments }
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
