type LogLevel = "debug" | "info" | "warn" | "error"

interface LogOptions {
  context?: string
  data?: any
}

class Logger {
  private static instance: Logger
  private isProd = process.env.NODE_ENV === "production"

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString()
    const context = options?.context ? `[${options.context}]` : ""
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isProd) return
    console.debug(this.formatMessage("debug", message, options), options?.data || "")
  }

  info(message: string, options?: LogOptions): void {
    console.info(this.formatMessage("info", message, options), options?.data || "")
  }

  warn(message: string, options?: LogOptions): void {
    console.warn(this.formatMessage("warn", message, options), options?.data || "")
  }

  error(message: string, error?: any, options?: LogOptions): void {
    console.error(this.formatMessage("error", message, options), error || "", options?.data || "")

    // In production, you might want to send errors to a monitoring service
    if (this.isProd) {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error)
    }
  }
}

export const logger = Logger.getInstance()
