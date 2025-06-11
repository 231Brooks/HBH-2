/**
 * Comprehensive validation utilities for security
 */

// RFC 5322 compliant email regex
export function validateEmail(email: string): boolean {
  if (!email) return false

  // Basic validation first (faster)
  if (email.length > 320 || !email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
    return false
  }

  // More comprehensive validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

// URL validation with allowed domains
export function validateCallbackUrl(url: string, allowedDomains: string[] = []): boolean {
  if (!url) return false

  try {
    // Allow relative URLs
    if (url.startsWith("/")) return true

    const parsedUrl = new URL(url)

    // Check if the domain is in the allowed list
    return allowedDomains.some((domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`))
  } catch (error) {
    return false
  }
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  if (!input) return ""
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean
  message?: string
} {
  if (!password) return { valid: false, message: "Password is required" }
  if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters" }

  let strength = 0
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength < 3) {
    return {
      valid: false,
      message: "Password must contain at least 3 of: lowercase, uppercase, numbers, special characters",
    }
  }

  return { valid: true }
}
