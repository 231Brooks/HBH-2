import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { withCallbackLogging } from "@/lib/callback-logger"

async function handlePlaceBid(request: Request) {
  try {
    const { propertyId, amount } = await request.json()

    // Validate input
    if (!propertyId || !amount) {
      return NextResponse.json({ error: "Property ID and bid amount are required" }, { status: 400 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Bid amount must be a positive number" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, current_bid, minimum_bid")
      .eq("id", propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if bid is high enough
    const minimumBid = property.current_bid
      ? property.current_bid + (property.minimum_bid || 1000)
      : property.minimum_bid || 0

    if (amount < minimumBid) {
      return NextResponse.json(
        {
          error: "Bid amount is too low",
          minimumBid,
          currentBid: property.current_bid,
        },
        { status: 400 },
      )
    }

    // Record the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        property_id: propertyId,
        amount,
        user_id: "test-user", // In a real implementation, get this from auth
        status: "pending",
      })
      .select()
      .single()

    if (bidError) {
      console.error("Error recording bid:", bidError)
      return NextResponse.json({ error: "Failed to record bid" }, { status: 500 })
    }

    // Update property current bid
    const { error: updateError } = await supabase
      .from("properties")
      .update({ current_bid: amount })
      .eq("id", propertyId)

    if (updateError) {
      console.error("Error updating property bid:", updateError)
      // We still return success since the bid was recorded
    }

    // Send notification about new bid
    try {
      await supabase.from("notifications").insert({
        user_id: property.user_id, // Property owner
        message: `New bid of $${amount.toLocaleString()} on your property`,
        type: "bid",
        reference_id: propertyId,
      })
    } catch (notificationError) {
      console.error("Error sending notification:", notificationError)
      // Non-critical error, continue
    }

    return NextResponse.json({
      success: true,
      bid: {
        id: bid.id,
        amount,
        status: "pending",
      },
    })
  } catch (error: any) {
    console.error("Bid error:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

// Wrap the handler with logging
export const POST = withCallbackLogging(handlePlaceBid, "bidding/place-bid")
