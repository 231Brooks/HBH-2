import { NextResponse } from "next/server"
import { env } from "@/lib/env-config"

export async function GET() {
  // Only return non-sensitive configuration needed for client
  return NextResponse.json({
    key: env.PUSHER_KEY, // This is safe to expose (it's the public key)
    cluster: env.PUSHER_CLUSTER,
    forceTLS: true,
  })
}
