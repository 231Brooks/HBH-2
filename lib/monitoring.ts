import { logger } from "./logger"

// Define performance thresholds
const THRESHOLDS = {
  API_RESPONSE_TIME: 500, // ms
  DATABASE_QUERY_TIME: 200, // ms
  MEMORY_USAGE_PERCENT: 80, // %
  ERROR_RATE_PERCENT: 1, // %
}

// Performance metrics storage
const metrics = {
  apiResponseTimes: [] as number[],
  databaseQueryTimes: [] as number[],
  errors: {
    count: 0,
    total: 0,
  },
  memoryUsage: 0,
}

// Calculate percentile
function percentile(values: number[], p: number) {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * p
  const base = Math.floor(pos)
  const rest = pos - base

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

// Record API response time
export function recordApiResponseTime(url: string, duration: number) {
  metrics.apiResponseTimes.push(duration)

  // Keep only the last 1000 measurements
  if (metrics.apiResponseTimes.length > 1000) {
    metrics.apiResponseTimes.shift()
  }

  // Check if response time exceeds threshold
  if (duration > THRESHOLDS.API_RESPONSE_TIME) {
    logger.warn(`Slow API response: ${url} took ${duration}ms`, { url, duration })

    // Send alert in production
    if (process.env.NODE_ENV === "production") {
      sendAlert("api_response_time", {
        url,
        duration,
        threshold: THRESHOLDS.API_RESPONSE_TIME,
      })
    }
  }
}

// Record database query time
export function recordDatabaseQueryTime(query: string, duration: number) {
  metrics.databaseQueryTimes.push(duration)

  // Keep only the last 1000 measurements
  if (metrics.databaseQueryTimes.length > 1000) {
    metrics.databaseQueryTimes.shift()
  }

  // Check if query time exceeds threshold
  if (duration > THRESHOLDS.DATABASE_QUERY_TIME) {
    logger.warn(`Slow database query took ${duration}ms`, { query, duration })

    // Send alert in production
    if (process.env.NODE_ENV === "production") {
      sendAlert("database_query_time", {
        query: query.substring(0, 100), // Truncate long queries
        duration,
        threshold: THRESHOLDS.DATABASE_QUERY_TIME,
      })
    }
  }
}

// Record error
export function recordError(error: Error, context?: Record<string, any>) {
  metrics.errors.count++
  metrics.errors.total++

  // Reset error count every 100 requests
  if (metrics.errors.total % 100 === 0) {
    const errorRate = (metrics.errors.count / 100) * 100

    if (errorRate > THRESHOLDS.ERROR_RATE_PERCENT) {
      logger.error(`High error rate: ${errorRate}%`, { errorRate })

      // Send alert in production
      if (process.env.NODE_ENV === "production") {
        sendAlert("error_rate", {
          rate: errorRate,
          threshold: THRESHOLDS.ERROR_RATE_PERCENT,
        })
      }
    }

    metrics.errors.count = 0
  }

  // Log the error
  logger.error("Application error", error, context)
}

// Update memory usage
export function updateMemoryUsage() {
  if (typeof process !== "undefined") {
    const memoryUsage = process.memoryUsage()
    const usedMemory = memoryUsage.heapUsed
    const totalMemory = memoryUsage.heapTotal
    const usagePercent = (usedMemory / totalMemory) * 100

    metrics.memoryUsage = usagePercent

    if (usagePercent > THRESHOLDS.MEMORY_USAGE_PERCENT) {
      logger.warn(`High memory usage: ${usagePercent.toFixed(2)}%`, { usagePercent })

      // Send alert in production
      if (process.env.NODE_ENV === "production") {
        sendAlert("memory_usage", {
          usage: usagePercent,
          threshold: THRESHOLDS.MEMORY_USAGE_PERCENT,
        })
      }
    }
  }
}

// Get performance metrics
export function getPerformanceMetrics() {
  const apiResponseTimes = metrics.apiResponseTimes
  const databaseQueryTimes = metrics.databaseQueryTimes

  return {
    api: {
      p50: percentile(apiResponseTimes, 0.5),
      p95: percentile(apiResponseTimes, 0.95),
      p99: percentile(apiResponseTimes, 0.99),
      count: apiResponseTimes.length,
    },
    database: {
      p50: percentile(databaseQueryTimes, 0.5),
      p95: percentile(databaseQueryTimes, 0.95),
      p99: percentile(databaseQueryTimes, 0.99),
      count: databaseQueryTimes.length,
    },
    errors: {
      rate: metrics.errors.total > 0 ? (metrics.errors.count / Math.min(metrics.errors.total, 100)) * 100 : 0,
      total: metrics.errors.total,
    },
    memory: {
      usage: metrics.memoryUsage,
    },
  }
}

// Send alert to monitoring service
async function sendAlert(type: string, data: Record<string, any>) {
  try {
    await fetch("/api/monitoring/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    logger.error("Failed to send alert", error as Error, { type, data })
  }
}

// Start periodic monitoring
export function startMonitoring() {
  // Update memory usage every minute
  setInterval(updateMemoryUsage, 60000)

  // Log performance metrics every 5 minutes
  setInterval(() => {
    const metrics = getPerformanceMetrics()
    logger.info("Performance metrics", { metrics })
  }, 300000)
}

// Initialize monitoring in production
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  startMonitoring()
}
