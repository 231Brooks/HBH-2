/**
 * Rate limiting implementation for security
 */

type RateLimitRecord = {
  count: number
  timestamp: number
}

type RateLimitOptions = {
  windowMs: number
  maxRequests: number
  blockDurationMs?: number
}

class RateLimiter {
  private store: Map<string, RateLimitRecord> = new Map()
  private blockedIps: Map<string, number> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor(
    private defaultOptions: RateLimitOptions = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60, // 60 requests per minute
      blockDurationMs: 10 * 60 * 1000, // 10 minutes block
    },
  ) {
    // Cleanup old records every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000)
  }

  check(
    key: string,
    options?: Partial<RateLimitOptions>,
  ): {
    allowed: boolean
    remaining: number
    resetTime: number
  } {
    const opts = { ...this.defaultOptions, ...options }
    const now = Date.now()

    // Check if IP is blocked
    const blockedUntil = this.blockedIps.get(key)
    if (blockedUntil && blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: blockedUntil,
      }
    }

    // Get or create record
    let record = this.store.get(key)
    const windowStart = now - opts.windowMs

    if (!record || record.timestamp < windowStart) {
      record = { count: 0, timestamp: now }
    }

    // Check if limit is reached
    if (record.count >= opts.maxRequests) {
      // Block the IP if configured
      if (opts.blockDurationMs) {
        this.blockedIps.set(key, now + opts.blockDurationMs)
      }

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.timestamp + opts.windowMs,
      }
    }

    // Increment counter
    record.count++
    this.store.set(key, record)

    return {
      allowed: true,
      remaining: opts.maxRequests - record.count,
      resetTime: record.timestamp + opts.windowMs,
    }
  }

  private cleanup() {
    const now = Date.now()

    // Clean up rate limit records
    for (const [key, record] of this.store.entries()) {
      if (now - record.timestamp > this.defaultOptions.windowMs) {
        this.store.delete(key)
      }
    }

    // Clean up blocked IPs
    for (const [ip, blockedUntil] of this.blockedIps.entries()) {
      if (blockedUntil < now) {
        this.blockedIps.delete(ip)
      }
    }
  }

  // For testing and monitoring
  getStats() {
    return {
      activeRecords: this.store.size,
      blockedIps: this.blockedIps.size,
    }
  }

  // Clean up resources when no longer needed
  destroy() {
    clearInterval(this.cleanupInterval)
  }
}

// Create singleton instances for different purposes
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes block
})

export const emailRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 emails per hour
  blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours block
})
