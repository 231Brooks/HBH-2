"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Create a new job listing
export async function createJobListing(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a job listing")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const budget = formData.get("budget") as string
  const category = formData.get("category") as string
  const skills = formData.getAll("skills") as string[]

  // Validate required fields
  if (!title || !description || !location || !budget || !category) {
    throw new Error("Missing required fields")
  }

  try {
    const jobListing = await prisma.jobListing.create({
      data: {
        title,
        description,
        location,
        budget,
        category: category as any,
        skills,
      },
    })

    revalidatePath("/job-marketplace")
    return { success: true, jobId: jobListing.id }
  } catch (error) {
    console.error("Failed to create job listing:", error)
    return { success: false, error: "Failed to create job listing" }
  }
}

// Get all job listings with optional filters
export async function getJobListings(options: {
  category?: string
  location?: string
  limit?: number
  offset?: number
}) {
  const { category, location, limit = 10, offset = 0 } = options

  const where: any = {}

  if (category) where.category = category
  if (location) where.location = { contains: location, mode: "insensitive" }

  try {
    const jobListings = await prisma.jobListing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.jobListing.count({ where })

    return {
      jobListings,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error("Failed to fetch job listings:", error)
    return { jobListings: [], total: 0, hasMore: false }
  }
}

// Get a single job listing by ID
export async function getJobListingById(id: string) {
  try {
    const jobListing = await prisma.jobListing.findUnique({
      where: { id },
    })

    return { jobListing }
  } catch (error) {
    console.error("Failed to fetch job listing:", error)
    return { jobListing: null }
  }
}

// Submit a proposal for a job listing
export async function submitJobProposal(jobId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to submit a proposal")
  }

  try {
    // Increment the proposal count for the job listing
    await prisma.jobListing.update({
      where: { id: jobId },
      data: {
        proposals: {
          increment: 1,
        },
      },
    })

    revalidatePath(`/job-marketplace/${jobId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to submit proposal:", error)
    return { success: false, error: "Failed to submit proposal" }
  }
}
