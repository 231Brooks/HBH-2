import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    cluster: process.env.PUSHER_CLUSTER,
  })
}
