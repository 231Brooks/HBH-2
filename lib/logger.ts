type LogLevel = "debug" | "info" | "warn" | "error"

type LogData = {
  message: string
  level: LogLevel
  timestamp: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel = "info"
  private shouldSendToServer: boolean = process.env.NODE_ENV === "production"

  private constructor() {
    // Set log level from environment
    if (process.env.LOG_LEVEL) {
      this.logLevel = process.env.LOG_LEVEL as LogLevel
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }

    return levels[level] >= levels[this.logLevel]
  }

  private formatLog(data: LogData): string {
    return `[${data.timestamp}] [${data.level.toUpperCase()}] ${data.message}`
  }

  private async sendToServer(data: LogData): Promise<void> {
    if (!this.shouldSendToServer) return

    try {
      await fetch("/api/logging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch (error) {
      // Fallback to console if server logging fails
      console.error("Failed to send log to server:", error)
      console.error(data)
    }
  }

  public debug(message: string, context?: Record<string, any>, userId?: string): void {
    if (!this.shouldLog("debug")) return

    const data: LogData = {
      message,
      level: "debug",
      timestamp: new Date().toISOString(),
      context,
      userId,
      requestId: this.getRequestId(),
    }

    console.debug(this.formatLog(data), context)

    if (this.shouldSendToServer) {
      this.sendToServer(data)
    }
  }

  public info(message: string, context?: Record<string, any>, userId?: string): void {
    if (!this.shouldLog("info")) return

    const data: LogData = {
      message,
      level: "info",
      timestamp: new Date().toISOString(),
      context,
      userId,
      requestId: this.getRequestId(),
    }

    console.info(this.formatLog(data), context)

    if (this.shouldSendToServer) {
      this.sendToServer(data)
    }
  }

  public warn(message: string, context?: Record<string, any>, userId?: string): void {
    if (!this.shouldLog("warn")) return

    const data: LogData = {
      message,
      level: "warn",
      timestamp: new Date().toISOString(),
      context,
      userId,
      requestId: this.getRequestId(),
    }

    console.warn(this.formatLog(data), context)

    if (this.shouldSendToServer) {
      this.sendToServer(data)
    }
  }

  public error(message: string, error?: Error, context?: Record<string, any>, userId?: string): void {
    if (!this.shouldLog("error")) return

    const data: LogData = {
      message,
      level: "error",
      timestamp: new Date().toISOString(),
      context,
      userId,
      requestId: this.getRequestId(),
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }

    console.error(this.formatLog(data), error, context)

    if (this.shouldSendToServer) {
      this.sendToServer(data)
    }
  }

  private getRequestId(): string | undefined {
    // In browser context, generate a request ID if needed
    if (typeof window !== "undefined") {
      if (!window.__requestId) {
        window.__requestId = crypto.randomUUID()
      }
      return window.__requestId
    }
    return undefined
  }
}

// Add requestId to Window interface
declare global {
  interface Window {
    __requestId?: string
  }
}

// Export singleton instance
export const logger = Logger.getInstance()
