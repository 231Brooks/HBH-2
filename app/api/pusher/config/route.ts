import { NextResponse } from "next/server"
import { serverEnv } from "@/lib/env"

export async function GET() {
  // Only return the necessary client-side configuration
  // Never expose the PUSHER_SECRET here
  return NextResponse.json({
    key: serverEnv.PUSHER_KEY,
    cluster: serverEnv.PUSHER_CLUSTER,
  })
}
