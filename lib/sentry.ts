import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.SENTRY_DSN

export function initSentry() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === "development",
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      environment: process.env.NODE_ENV,
    })
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    })
  } else {
    console.error("Error captured:", error, context)
  }
}

export function captureMessage(message: string, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, {
      extra: context,
    })
  } else {
    console.log("Message captured:", message, context)
  }
}

export function setUser(user: { id: string; email?: string; username?: string }) {
  if (SENTRY_DSN) {
    Sentry.setUser(user)
  }
}

export function clearUser() {
  if (SENTRY_DSN) {
    Sentry.setUser(null)
  }
}
