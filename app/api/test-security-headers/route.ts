import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "This endpoint is for testing security headers",
    timestamp: new Date().toISOString(),
  })
}
