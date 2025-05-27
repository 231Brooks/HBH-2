/**
 * Timeout utilities for expensive operations
 */

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimeoutError"
  }
}

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap
 * @param timeoutMs Timeout in milliseconds
 * @param errorMessage Custom error message
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 5000,
  errorMessage = "Operation timed out",
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new TimeoutError(errorMessage)), timeoutMs)
    }),
  ])
}

/**
 * Creates a function that will automatically timeout after the specified duration
 * @param fn The function to wrap
 * @param timeoutMs Timeout in milliseconds
 */
export function createTimeoutFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  timeoutMs = 5000,
): (...args: T) => Promise<R> {
  return (...args: T) => withTimeout(fn(...args), timeoutMs)
}

// Predefined timeout durations for different operation types
export const TIMEOUT_DURATIONS = {
  DB_QUERY: 5000, // 5 seconds for database queries
  EMAIL_SEND: 10000, // 10 seconds for sending emails
  FILE_UPLOAD: 30000, // 30 seconds for file uploads
  EXTERNAL_API: 8000, // 8 seconds for external API calls
  AUTH_OPERATION: 15000, // 15 seconds for authentication operations
  REPORT_GENERATION: 60000, // 60 seconds for report generation
}
