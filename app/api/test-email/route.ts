import nodemailer from "nodemailer"

export async function GET() {
  try {
    // Create a test account if no email credentials
    let testAccount
    let transporter

    if (
      !process.env.EMAIL_SERVER_HOST ||
      !process.env.EMAIL_SERVER_PORT ||
      !process.env.EMAIL_SERVER_USER ||
      !process.env.EMAIL_SERVER_PASSWORD
    ) {
      // Create a test account on ethereal.email
      testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    } else {
      // Use configured email settings
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      })
    }

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "test@example.com",
      to: "test@example.com",
      subject: "Test Email from Homes Better Hands",
      text: "This is a test email to verify email functionality.",
      html: "<p>This is a test email to verify email functionality.</p>",
    })

    return NextResponse.json({
      status: "success",
      message: "Test email sent",
      messageId: info.messageId,
      previewUrl: testAccount ? nodemailer.getTestMessageUrl(info) : undefined,
    })
  } catch (error) {
    console.error("Email test error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to send test email",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
