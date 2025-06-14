"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ServiceCategory, ServiceUrgency, ServiceRequestStatus } from "@prisma/client"

export interface CreateServiceRequestData {
  title: string
  description: string
  category: ServiceCategory
  budget?: string
  location: string
  urgency: ServiceUrgency
}

export interface ServiceRequestFilters {
  category?: ServiceCategory
  urgency?: ServiceUrgency
  status?: ServiceRequestStatus
  location?: string
  limit?: number
  offset?: number
}

export async function createServiceRequest(data: CreateServiceRequestData) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        ...data,
        clientId: user.id,
        status: ServiceRequestStatus.OPEN,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
          },
        },
        responses: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
        },
      },
    })

    revalidatePath("/services")
    revalidatePath("/marketplace")
    return { success: true, serviceRequest }
  } catch (error) {
    console.error("Failed to create service request:", error)
    return { success: false, error: "Failed to create service request" }
  }
}

export async function getServiceRequests(filters: ServiceRequestFilters = {}) {
  try {
    const {
      category,
      urgency,
      status = ServiceRequestStatus.OPEN,
      location,
      limit = 20,
      offset = 0,
    } = filters

    const where: any = {
      status,
    }

    if (category) {
      where.category = category
    }

    if (urgency) {
      where.urgency = urgency
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      }
    }

    const [serviceRequests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true,
              rating: true,
              reviewCount: true,
            },
          },
          responses: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rating: true,
                  reviewCount: true,
                },
              },
            },
          },
        },
        orderBy: [
          { urgency: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.serviceRequest.count({ where }),
    ])

    return {
      success: true,
      serviceRequests,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to get service requests:", error)
    return { success: false, error: "Failed to load service requests" }
  }
}

export async function getServiceRequestById(id: string) {
  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
          },
        },
        responses: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
                reviewCount: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!serviceRequest) {
      return { success: false, error: "Service request not found" }
    }

    return { success: true, serviceRequest }
  } catch (error) {
    console.error("Failed to get service request:", error)
    return { success: false, error: "Failed to load service request" }
  }
}

export async function respondToServiceRequest(
  serviceRequestId: string,
  message: string,
  proposedPrice?: number,
  estimatedDuration?: string
) {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if user is a professional
    if (currentUser.role !== "PROFESSIONAL") {
      return { success: false, error: "Only professionals can respond to service requests" }
    }

    // Check if already responded
    const existingResponse = await prisma.serviceResponse.findFirst({
      where: {
        serviceRequestId,
        providerId: currentUser.id,
      },
    })

    if (existingResponse) {
      return { success: false, error: "You have already responded to this request" }
    }

    const response = await prisma.serviceResponse.create({
      data: {
        serviceRequestId,
        providerId: currentUser.id,
        message,
        proposedPrice,
        estimatedDuration,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
          },
        },
      },
    })

    revalidatePath(`/service-requests/${serviceRequestId}`)
    return { success: true, response }
  } catch (error) {
    console.error("Failed to respond to service request:", error)
    return { success: false, error: "Failed to submit response" }
  }
}

export async function acceptServiceResponse(serviceRequestId: string, responseId: string) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Verify the user owns the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: {
        responses: {
          where: { id: responseId },
          include: { provider: true },
        },
      },
    })

    if (!serviceRequest) {
      return { success: false, error: "Service request not found" }
    }

    if (serviceRequest.clientId !== session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    const response = serviceRequest.responses[0]
    if (!response) {
      return { success: false, error: "Response not found" }
    }

    // Update service request with selected provider
    await prisma.serviceRequest.update({
      where: { id: serviceRequestId },
      data: {
        providerId: response.providerId,
        status: ServiceRequestStatus.IN_PROGRESS,
      },
    })

    revalidatePath(`/service-requests/${serviceRequestId}`)
    revalidatePath("/services")
    return { success: true }
  } catch (error) {
    console.error("Failed to accept service response:", error)
    return { success: false, error: "Failed to accept response" }
  }
}

export async function completeServiceRequest(serviceRequestId: string) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
    })

    if (!serviceRequest) {
      return { success: false, error: "Service request not found" }
    }

    // Only client or assigned provider can complete
    if (serviceRequest.clientId !== session.user.id && serviceRequest.providerId !== session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.serviceRequest.update({
      where: { id: serviceRequestId },
      data: {
        status: ServiceRequestStatus.COMPLETED,
      },
    })

    revalidatePath(`/service-requests/${serviceRequestId}`)
    revalidatePath("/services")
    return { success: true }
  } catch (error) {
    console.error("Failed to complete service request:", error)
    return { success: false, error: "Failed to complete service request" }
  }
}
