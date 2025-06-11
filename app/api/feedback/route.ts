import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { captureMessage } from "@/lib/sentry"

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json()

    if (!feedback || typeof feedback !== "string") {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 })
    }

    // Log the feedback
    logger.info("Feedback received", { feedback })

    // Send to monitoring service
    captureMessage("User feedback", { feedback })

    // You could also store this in your database
    // await prisma.feedback.create({ data: { content: feedback } });

    // Or send it via email
    // await sendEmail({
    //   to: 'feedback@yourdomain.com',
    //   subject: 'New User Feedback',
    //   text: feedback,
    // });

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error processing feedback", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
