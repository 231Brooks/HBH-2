import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { withCallbackLogging } from "@/lib/callback-logger"

async function handleRequest(request: Request) {
  try {
    const headersList = headers()
    const signature = headersList.get("x-supabase-webhook-signature")

    // Verify webhook signature (in production, you should validate this)
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const payload = await request.json()
    const event = payload.type

    // Handle different event types
    switch (event) {
      case "INSERT":
        // Handle insert event
        await handleInsertEvent(payload)
        break
      case "UPDATE":
        // Handle update event
        await handleUpdateEvent(payload)
        break
      case "DELETE":
        // Handle delete event
        await handleDeleteEvent(payload)
        break
      default:
        console.log(`Unhandled event type: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Wrap the handler with logging
export const POST = withCallbackLogging(handleRequest, "webhooks/supabase")

async function handleInsertEvent(payload: any) {
  const { table, record } = payload
  console.log(`New record in ${table}:`, record)

  // Add your custom logic here
}

async function handleUpdateEvent(payload: any) {
  const { table, old_record, record } = payload
  console.log(`Updated record in ${table}:`, { old: old_record, new: record })

  // Add your custom logic here
}

async function handleDeleteEvent(payload: any) {
  const { table, old_record } = payload
  console.log(`Deleted record from ${table}:`, old_record)

  // Add your custom logic here
}
