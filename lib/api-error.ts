import { NextResponse } from "next/server"
import { logger } from "./logger"

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = "ApiError"
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(message, 400)
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401)
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403)
  }

  static notFound(message = "Not Found") {
    return new ApiError(message, 404)
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(message, 500)
  }
}

export function handleApiError(error: unknown, context = "API") {
  if (error instanceof ApiError) {
    logger.warn(`API Error: ${error.message}`, { context })
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  // For unexpected errors
  const message = error instanceof Error ? error.message : "An unexpected error occurred"
  logger.error(`Unexpected API Error: ${message}`, error, { context })

  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
}
