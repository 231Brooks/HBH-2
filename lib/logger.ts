type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
}

// Simple logger that can be replaced with a more robust solution
export const logger = {
  debug: (message: string, data?: any) => log("debug", message, data),
  info: (message: string, data?: any) => log("info", message, data),
  warn: (message: string, data?: any) => log("warn", message, data),
  error: (message: string, data?: any) => log("error", message, data),
}

function log(level: LogLevel, message: string, data?: any) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data: sanitizeData(data) }),
  }

  // In production, you might want to send logs to a service
  if (process.env.NODE_ENV === "production") {
    // Here you could send logs to a service like Datadog, Sentry, etc.
    // For now, we'll just console.log
    console[level](JSON.stringify(entry))
  } else {
    // In development, pretty print
    if (data) {
      console[level](`[${entry.timestamp}] ${message}`, sanitizeData(data))
    } else {
      console[level](`[${entry.timestamp}] ${message}`)
    }
  }
}

// Remove sensitive data before logging
function sanitizeData(data: any): any {
  if (!data) return data

  // Deep clone to avoid modifying the original
  const sanitized = JSON.parse(JSON.stringify(data))

  // List of fields to redact
  const sensitiveFields = ["password", "token", "secret", "apiKey", "credit_card", "key"]

  // Recursively sanitize objects
  function sanitizeObject(obj: any) {
    if (typeof obj !== "object" || obj === null) return

    Object.keys(obj).forEach((key) => {
      if (sensitiveFields.includes(key.toLowerCase())) {
        obj[key] = "[REDACTED]"
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    })
  }

  sanitizeObject(sanitized)
  return sanitized
}
