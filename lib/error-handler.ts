// Error types
export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  INTERNAL = "INTERNAL_ERROR",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE_ERROR",
}

// Base application error class
export class AppError extends Error {
  type: ErrorType
  statusCode: number
  isOperational: boolean

  constructor(message: string, type: ErrorType = ErrorType.INTERNAL, statusCode = 500, isOperational = true) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.VALIDATION, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, ErrorType.AUTHENTICATION, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, ErrorType.AUTHORIZATION, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, ErrorType.NOT_FOUND, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.CONFLICT, 409)
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.EXTERNAL_SERVICE, 502)
  }
}

// Global error handler for API routes
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    // Log operational errors but don't crash
    console.error(`[${error.type}] ${error.message}`)
    return { statusCode: error.statusCode, message: error.message, type: error.type }
  }

  // Unexpected errors
  console.error("[UNHANDLED_ERROR]", error)
  return { statusCode: 500, message: "An unexpected error occurred", type: ErrorType.INTERNAL }
}
