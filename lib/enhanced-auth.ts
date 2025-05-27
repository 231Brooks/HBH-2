import prisma from "./prisma"
import { validateEmail } from "./validation-utils"
import { withTimeout, TIMEOUT_DURATIONS } from "./operation-timeout"
import { createTransport } from "nodemailer"
import crypto from "crypto"

// Configure email transport
const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || "587"),
  secure: Number(process.env.EMAIL_SERVER_PORT || "587") === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Generate a secure random token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Send verification email with timeout
export async function sendVerificationEmail(
  email: string,
  token: string,
  type: "signup" | "password-reset" | "email-change",
): Promise<boolean> {
  if (!validateEmail(email)) {
    throw new Error("Invalid email format")
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  let verificationUrl: string
  let subject: string
  let htmlContent: string

  switch (type) {
    case "signup":
      verificationUrl = `${baseUrl}/auth/verify?token=${token}`
      subject = "Verify your email address"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If you didn't request this verification, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
      break
    case "password-reset":
      verificationUrl = `${baseUrl}/auth/reset-password?token=${token}`
      subject = "Reset your password"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>You requested to reset your password. Please click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
      break
    case "email-change":
      verificationUrl = `${baseUrl}/auth/verify-email-change?token=${token}`
      subject = "Verify your new email address"
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your new email address</h2>
          <p>You requested to change your email address. Please click the button below to verify this new email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify New Email
            </a>
          </div>
          <p>If you didn't request this change, please contact support immediately.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
      break
  }

  try {
    // Use timeout to prevent hanging operations
    await withTimeout(
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject,
        html: htmlContent,
      }),
      TIMEOUT_DURATIONS.EMAIL_SEND,
      "Email sending operation timed out",
    )

    return true
  } catch (error) {
    console.error("Failed to send verification email:", error)
    return false
  }
}

// Store verification token in database with expiration
export async function createVerificationRequest(
  email: string,
  type: "signup" | "password-reset" | "email-change",
  userId?: string,
): Promise<string> {
  if (!validateEmail(email)) {
    throw new Error("Invalid email format")
  }

  const token = generateVerificationToken()
  const expiresAt = new Date()

  // Set expiration based on type
  switch (type) {
    case "signup":
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours
      break
    case "password-reset":
    case "email-change":
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour
      break
  }

  // Store in database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: expiresAt,
      type,
      userId,
    },
  })

  return token
}

// Verify token and perform action
export async function verifyToken(
  token: string,
  type: "signup" | "password-reset" | "email-change",
): Promise<{
  valid: boolean
  email?: string
  userId?: string
  error?: string
}> {
  try {
    // Find token in database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        type,
      },
    })

    // Check if token exists and is not expired
    if (!verificationToken) {
      return { valid: false, error: "Invalid token" }
    }

    if (new Date() > verificationToken.expires) {
      return { valid: false, error: "Token expired" }
    }

    // Return success with email
    return {
      valid: true,
      email: verificationToken.identifier,
      userId: verificationToken.userId || undefined,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { valid: false, error: "Verification failed" }
  }
}

// Consume token after use
export async function consumeToken(token: string): Promise<boolean> {
  try {
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    })
    return true
  } catch (error) {
    console.error("Failed to consume token:", error)
    return false
  }
}

// Enhanced session validation
export async function validateSession(userId: string): Promise<boolean> {
  try {
    // Check if user exists and is not disabled
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        emailVerified: true,
        disabled: true,
        lastPasswordChange: true,
      },
    })

    if (!user) return false
    if (user.disabled) return false

    // Additional checks can be added here

    return true
  } catch (error) {
    console.error("Session validation error:", error)
    return false
  }
}

// Two-factor authentication helpers
export async function setupTwoFactor(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
  // Implementation would go here
  // This is a placeholder - you would use a library like speakeasy to generate TOTP secrets
  return {
    secret: "placeholder_secret",
    qrCodeUrl: "placeholder_qr_url",
  }
}

export async function verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
  // Implementation would go here
  return true // Placeholder
}
