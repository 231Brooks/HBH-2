import { NextRequest } from 'next/server'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

// Security configuration for production deployment
export const SecurityConfig = {
  // Rate limiting configuration
  rateLimiting: {
    // General API rate limiting
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },

    // Authentication endpoints (stricter)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 login attempts per windowMs
      message: 'Too many authentication attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },

    // Sync endpoints (moderate)
    sync: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 10, // Limit sync operations
      message: 'Too many sync requests, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    },

    // Real-time endpoints (lenient but monitored)
    realtime: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 60, // Allow frequent real-time updates
      message: 'Real-time rate limit exceeded.',
      standardHeaders: true,
      legacyHeaders: false,
    },
  },

  // Slow down configuration for suspicious activity
  slowDown: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Allow 50 requests per windowMs without delay
    delayMs: 500, // Add 500ms delay per request after delayAfter
    maxDelayMs: 20000, // Maximum delay of 20 seconds
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://hbh2.com',
          'https://portal.hbh2.com',
          'https://api.hbh2.com',
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-Platform',
    ],
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Next.js
        "'unsafe-eval'", // Required for development
        'https://js.pusher.com',
        'https://sockjs-us3.pusher.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind CSS
        'https://fonts.googleapis.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https:',
      ],
      connectSrc: [
        "'self'",
        'https://api.hbh2.com',
        'wss://ws-us3.pusher.com',
        'https://sockjs-us3.pusher.com',
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : undefined,
    },
  },

  // Security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': process.env.NODE_ENV === 'production' 
      ? 'max-age=31536000; includeSubDomains; preload'
      : undefined,
  },

  // Session configuration
  session: {
    name: 'hbh-session',
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict' as const,
    },
  },

  // Input validation patterns
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    phoneNumber: /^\+?[1-9]\d{1,14}$/,
    
    // Dangerous patterns to reject
    sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|(-{2})|(\*\/)|(\*)|(\bOR\b.*=.*)|(\bAND\b.*=.*)/i,
    xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    pathTraversal: /\.\.[\/\\]/,
    commandInjection: /[;&|`$(){}[\]]/,
  },

  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
  },

  // Audit logging configuration
  audit: {
    sensitiveOperations: [
      'user.role.change',
      'user.permission.grant',
      'user.permission.revoke',
      'team.member.add',
      'team.member.remove',
      'team.leader.change',
      'investment.create',
      'investment.distribute',
      'kpi.create',
      'kpi.delete',
      'course.create',
      'course.publish',
      'sync.manual',
    ],
    retentionDays: 365,
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
}

// Security middleware functions
export class SecurityMiddleware {
  // Validate and sanitize input
  static validateInput(input: any, type: keyof typeof SecurityConfig.validation): boolean {
    if (typeof input !== 'string') return false
    
    const pattern = SecurityConfig.validation[type]
    if (pattern instanceof RegExp) {
      return pattern.test(input)
    }
    
    return false
  }

  // Check for malicious patterns
  static containsMaliciousContent(input: string): boolean {
    const patterns = [
      SecurityConfig.validation.sqlInjection,
      SecurityConfig.validation.xss,
      SecurityConfig.validation.pathTraversal,
      SecurityConfig.validation.commandInjection,
    ]

    return patterns.some(pattern => pattern.test(input))
  }

  // Sanitize string input
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;&|`$(){}[\]]/g, '') // Remove command injection chars
      .trim()
      .substring(0, 1000) // Limit length
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  // Hash sensitive data
  static async hashSensitiveData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Validate request origin
  static validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    if (!origin && !referer) {
      // Allow requests without origin/referer (e.g., direct API calls)
      return true
    }

    const allowedOrigins = SecurityConfig.cors.origin
    const requestOrigin = origin || (referer ? new URL(referer).origin : '')

    return allowedOrigins.includes(requestOrigin)
  }

  // Check if IP is suspicious
  static isSuspiciousIP(ip: string): boolean {
    // Add logic to check against known malicious IPs
    // This could integrate with threat intelligence services
    const suspiciousPatterns = [
      /^10\./, // Private networks (if not expected)
      /^192\.168\./, // Private networks (if not expected)
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private networks (if not expected)
    ]

    // In production, you might want to allow private networks
    // This is just an example
    return false
  }

  // Log security events
  static logSecurityEvent(event: {
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    userId?: string
    ip?: string
    userAgent?: string
    details: any
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    }

    // In production, send to security monitoring system
    console.log('SECURITY_EVENT:', JSON.stringify(logEntry))

    // For critical events, trigger immediate alerts
    if (event.severity === 'critical') {
      // Trigger alert system
      console.error('CRITICAL_SECURITY_EVENT:', logEntry)
    }
  }
}

// Export rate limiting middleware
export const createRateLimiter = (config: any) => {
  return rateLimit(config)
}

export const createSlowDown = (config: any) => {
  return slowDown(config)
}
