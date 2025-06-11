import { NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const signature = headersList.get("x-calendar-signature")

    // Verify webhook signature (in production, you should validate this)
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const payload = await request.json()
    const { event, userId, appointmentId } = payload

    if (!event || !userId || !appointmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle different event types
    switch (event) {
      case "created":
        // Handle appointment created in external calendar
        await handleAppointmentCreated(payload)
        break
      case "updated":
        // Handle appointment updated in external calendar
        await handleAppointmentUpdated(payload)
        break
      case "deleted":
        // Handle appointment deleted in external calendar
        await handleAppointmentDeleted(payload)
        break
      default:
        console.log(`Unhandled event type: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Calendar webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleAppointmentCreated(payload: any) {
  const { userId, appointmentId, externalId, externalData } = payload

  // Update appointment with external calendar ID
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      externalId,
      externalData: externalData ? JSON.stringify(externalData) : undefined,
      synced: true,
    },
  })
}

async function handleAppointmentUpdated(payload: any) {
  const { userId, appointmentId, externalData } = payload

  // Update appointment with new data from external calendar
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      externalData: externalData ? JSON.stringify(externalData) : undefined,
      synced: true,
    },
  })
}

async function handleAppointmentDeleted(payload: any) {
  const { userId, appointmentId } = payload

  // Mark appointment as deleted or remove it
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      deleted: true,
    },
  })
}
