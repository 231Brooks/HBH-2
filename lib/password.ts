import * as bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Password strength validation
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  // At least 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    }
  }

  // Check for uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const requirements = [
    { condition: hasUppercase, message: "uppercase letter" },
    { condition: hasLowercase, message: "lowercase letter" },
    { condition: hasNumber, message: "number" },
    { condition: hasSpecialChar, message: "special character" },
  ]

  const missingRequirements = requirements.filter((req) => !req.condition).map((req) => req.message)

  if (missingRequirements.length > 0) {
    return {
      isValid: false,
      message: `Password must include at least one ${missingRequirements.join(", ")}`,
    }
  }

  return { isValid: true }
}

// Generate a secure random token
export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex")
}
