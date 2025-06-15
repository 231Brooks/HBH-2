"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Create project milestone
export async function createProjectMilestone(data: {
  projectId: string
  title: string
  description?: string
  dueDate?: string
}) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { ownerId: true, service: { select: { providerId: true } } },
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    if (project.ownerId !== user.id && project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    const milestone = await prisma.projectMilestone.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId,
      },
    })

    revalidatePath(`/progress/${data.projectId}`)
    return { success: true, milestone }
  } catch (error) {
    console.error("Failed to create milestone:", error)
    return { success: false, error: "Failed to create milestone" }
  }
}

// Update project milestone
export async function updateProjectMilestone(id: string, data: {
  title?: string
  description?: string
  status?: string
  dueDate?: string
  completedDate?: string
}) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const milestone = await prisma.projectMilestone.findUnique({
      where: { id },
      include: {
        project: {
          select: { ownerId: true, service: { select: { providerId: true } } },
        },
      },
    })

    if (!milestone) {
      return { success: false, error: "Milestone not found" }
    }

    if (milestone.project.ownerId !== user.id && milestone.project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
    if (data.completedDate !== undefined) updateData.completedDate = data.completedDate ? new Date(data.completedDate) : null

    const updatedMilestone = await prisma.projectMilestone.update({
      where: { id },
      data: updateData,
    })

    revalidatePath(`/progress/${milestone.project.id}`)
    return { success: true, milestone: updatedMilestone }
  } catch (error) {
    console.error("Failed to update milestone:", error)
    return { success: false, error: "Failed to update milestone" }
  }
}

// Create project deliverable
export async function createProjectDeliverable(data: {
  projectId: string
  title: string
  description?: string
  type: string
  fileUrl?: string
  fileName?: string
  fileSize?: string
}) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { ownerId: true, service: { select: { providerId: true } } },
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    if (project.ownerId !== user.id && project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    const deliverable = await prisma.projectDeliverable.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type as any,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        uploadedById: user.id,
        projectId: data.projectId,
      },
    })

    revalidatePath(`/progress/${data.projectId}`)
    return { success: true, deliverable }
  } catch (error) {
    console.error("Failed to create deliverable:", error)
    return { success: false, error: "Failed to create deliverable" }
  }
}

// Update project deliverable
export async function updateProjectDeliverable(id: string, data: {
  title?: string
  description?: string
  status?: string
  fileUrl?: string
  fileName?: string
  fileSize?: string
}) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const deliverable = await prisma.projectDeliverable.findUnique({
      where: { id },
      include: {
        project: {
          select: { ownerId: true, service: { select: { providerId: true } } },
        },
      },
    })

    if (!deliverable) {
      return { success: false, error: "Deliverable not found" }
    }

    if (deliverable.project.ownerId !== user.id && deliverable.project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl
    if (data.fileName !== undefined) updateData.fileName = data.fileName
    if (data.fileSize !== undefined) updateData.fileSize = data.fileSize

    const updatedDeliverable = await prisma.projectDeliverable.update({
      where: { id },
      data: updateData,
    })

    revalidatePath(`/progress/${deliverable.project.id}`)
    return { success: true, deliverable: updatedDeliverable }
  } catch (error) {
    console.error("Failed to update deliverable:", error)
    return { success: false, error: "Failed to update deliverable" }
  }
}

// Add team member to project
export async function addProjectTeamMember(data: {
  projectId: string
  name: string
  role: string
  email?: string
  phone?: string
  userId?: string
}) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { ownerId: true, service: { select: { providerId: true } } },
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    if (project.ownerId !== user.id && project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    const teamMember = await prisma.projectTeamMember.create({
      data: {
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        userId: data.userId,
        projectId: data.projectId,
      },
    })

    revalidatePath(`/progress/${data.projectId}`)
    return { success: true, teamMember }
  } catch (error) {
    console.error("Failed to add team member:", error)
    return { success: false, error: "Failed to add team member" }
  }
}

// Get project analytics
export async function getProjectAnalytics(projectId: string) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true, service: { select: { providerId: true } } },
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    if (project.ownerId !== user.id && project.service?.providerId !== user.id) {
      return { success: false, error: "Access denied" }
    }

    // Get project with all related data
    const projectData = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        deliverables: true,
        teamMembers: true,
      },
    })

    if (!projectData) {
      return { success: false, error: "Project not found" }
    }

    // Calculate analytics
    const totalMilestones = projectData.milestones.length
    const completedMilestones = projectData.milestones.filter(m => m.status === "COMPLETED").length
    const overdueMilestones = projectData.milestones.filter(m => m.status === "OVERDUE").length
    
    const totalDeliverables = projectData.deliverables.length
    const approvedDeliverables = projectData.deliverables.filter(d => d.status === "APPROVED" || d.status === "FINAL").length
    
    const analytics = {
      milestones: {
        total: totalMilestones,
        completed: completedMilestones,
        overdue: overdueMilestones,
        completionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
      },
      deliverables: {
        total: totalDeliverables,
        approved: approvedDeliverables,
        approvalRate: totalDeliverables > 0 ? (approvedDeliverables / totalDeliverables) * 100 : 0,
      },
      team: {
        size: projectData.teamMembers.length,
      },
      progress: projectData.progress,
      budget: projectData.budget,
    }

    return { success: true, analytics }
  } catch (error) {
    console.error("Failed to get project analytics:", error)
    return { success: false, error: "Failed to load analytics" }
  }
}
