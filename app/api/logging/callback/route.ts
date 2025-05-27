import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const apiKey = headersList.get("x-api-key")

    // In production, you should verify the API key

    const payload = await request.json()
    const { endpoint, statusCode, durationMs, method, request: requestData, response: responseData } = payload

    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Log the callback
    const { data, error } = await supabase
      .from("callback_logs")
      .insert({
        endpoint,
        status_code: statusCode,
        duration_ms: durationMs,
        method,
        request_data: requestData,
        response_data: responseData,
      })
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Callback logging error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
