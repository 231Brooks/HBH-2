import { NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const apiKey = headersList.get("x-api-key")

    // Verify API key
    if (apiKey !== process.env.DOCUMENT_PROCESSING_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const payload = await request.json()
    const { documentId, status, extractedData } = payload

    if (!documentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update document status in database
    await prisma.document.update({
      where: { id: documentId },
      data: {
        processingStatus: status,
        extractedData: extractedData ? JSON.stringify(extractedData) : undefined,
        processedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Document processing callback error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
