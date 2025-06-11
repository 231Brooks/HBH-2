import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { withCallbackLogging } from "@/lib/callback-logger"

async function handleAcceptBid(request: Request) {
  try {
    const { bidId } = await request.json()

    // Validate input
    if (!bidId) {
      return NextResponse.json({ error: "Bid ID is required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .select("id, property_id, amount, user_id, status")
      .eq("id", bidId)
      .single()

    if (bidError || !bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    // Check if bid is already accepted
    if (bid.status === "accepted") {
      return NextResponse.json({ error: "Bid has already been accepted" }, { status: 400 })
    }

    // Start a transaction to update bid and property
    const { data: transaction, error: transactionError } = await supabase.rpc("accept_bid_transaction", {
      p_bid_id: bidId,
      p_property_id: bid.property_id,
    })

    if (transactionError) {
      console.error("Transaction error:", transactionError)
      return NextResponse.json({ error: "Failed to accept bid" }, { status: 500 })
    }

    // Send notifications to relevant parties
    try {
      // Notify bidder
      await supabase.from("notifications").insert({
        user_id: bid.user_id,
        message: `Your bid of $${bid.amount.toLocaleString()} has been accepted!`,
        type: "bid_accepted",
        reference_id: bid.property_id,
      })

      // Get property details for owner notification
      const { data: property } = await supabase.from("properties").select("user_id").eq("id", bid.property_id).single()

      if (property) {
        // Notify property owner
        await supabase.from("notifications").insert({
          user_id: property.user_id,
          message: `You've accepted a bid of $${bid.amount.toLocaleString()} on your property`,
          type: "bid_accepted_owner",
          reference_id: bid.property_id,
        })
      }
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError)
      // Non-critical error, continue
    }

    return NextResponse.json({
      success: true,
      transaction: {
        bidId: bid.id,
        propertyId: bid.property_id,
        amount: bid.amount,
        status: "accepted",
      },
    })
  } catch (error: any) {
    console.error("Accept bid error:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

// Wrap the handler with logging
export const POST = withCallbackLogging(handleAcceptBid, "bidding/accept-bid")
