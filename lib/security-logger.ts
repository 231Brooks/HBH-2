/**
 * Security logging utility
 */

import prisma from "./prisma"
import { withTimeout, TIMEOUT_DURATIONS } from "./operation-timeout"

type SecurityAction =
  | "login_success"
  | "login_failure"
  | "logout"
  | "password_change"
  | "email_change"
  | "account_locked"
  | "account_unlocked"
  | "two_factor_enabled"
  | "two_factor_disabled"
  | "verification_requested"
  | "verification_completed"
  | "admin_action"
  | "api_key_created"
  | "api_key_revoked"
  | "suspicious_activity"

interface LogSecurityEventParams {
  userId?: string
  action: SecurityAction
  details?: string
  ip?: string
  userAgent?: string
}

export async function logSecurityEvent({
  userId,
  action,
  details,
  ip,
  userAgent,
}: LogSecurityEventParams): Promise<void> {
  try {
    await withTimeout(
      prisma.securityLog.create({
        data: {
          userId,
          action,
          details,
          ip,
          userAgent,
        },
      }),
      TIMEOUT_DURATIONS.DB_QUERY,
      "Security log database operation timed out",
    )
  } catch (error) {
    console.error("Failed to log security event:", error)
    // Don't throw - logging should not break the application flow
  }
}

export async function getSecurityLogs(userId: string, limit = 50): Promise<any[]> {
  try {
    return await withTimeout(
      prisma.securityLog.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      }),
      TIMEOUT_DURATIONS.DB_QUERY,
      "Security logs retrieval timed out",
    )
  } catch (error) {
    console.error("Failed to retrieve security logs:", error)
    return []
  }
}

export async function getRecentSuspiciousActivity(days = 7): Promise<any[]> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return await withTimeout(
      prisma.securityLog.findMany({
        where: {
          action: "suspicious_activity",
          createdAt: {
            gte: cutoffDate,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      TIMEOUT_DURATIONS.DB_QUERY,
      "Suspicious activity retrieval timed out",
    )
  } catch (error) {
    console.error("Failed to retrieve suspicious activity:", error)
    return []
  }
}
