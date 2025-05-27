import nodemailer from "nodemailer"
import { validateEmail } from "./validation-utils"
import { withTimeout, TIMEOUT_DURATIONS } from "./operation-timeout"
import { emailRateLimiter } from "./rate-limiter"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

// Sanitize header values to prevent header injection
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, "")
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  // Validate email
  if (!validateEmail(to)) {
    console.error("Invalid email format:", to)
    return false
  }

  // Apply rate limiting
  const key = `email:${to}`
  const result = emailRateLimiter.check(key)

  if (!result.allowed) {
    console.error("Rate limit exceeded for email:", to)
    return false
  }

  // Sanitize inputs
  const sanitizedSubject = sanitizeHeaderValue(subject)

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587") === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  try {
    // Apply timeout to prevent hanging operations
    const info = await withTimeout(
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: sanitizeHeaderValue(to),
        subject: sanitizedSubject,
        text,
        html,
      }),
      TIMEOUT_DURATIONS.EMAIL_SEND,
      "Email sending operation timed out",
    )

    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}
