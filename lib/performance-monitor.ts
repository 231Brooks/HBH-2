import { performance } from 'perf_hooks'

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

interface DatabaseMetric {
  query: string
  duration: number
  rowCount?: number
  cached?: boolean
}

interface APIMetric {
  endpoint: string
  method: string
  statusCode: number
  duration: number
  userId?: string
  userAgent?: string
}

interface RealtimeMetric {
  event: string
  channel: string
  duration: number
  recipientCount: number
  success: boolean
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = []
  private static dbMetrics: DatabaseMetric[] = []
  private static apiMetrics: APIMetric[] = []
  private static realtimeMetrics: RealtimeMetric[] = []
  
  // Performance thresholds
  private static thresholds = {
    api: {
      fast: 200, // ms
      acceptable: 500, // ms
      slow: 1000, // ms
    },
    database: {
      fast: 50, // ms
      acceptable: 200, // ms
      slow: 500, // ms
    },
    realtime: {
      fast: 50, // ms
      acceptable: 100, // ms
      slow: 200, // ms
    },
  }

  // Start timing an operation
  static startTimer(name: string, metadata?: Record<string, any>): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        metadata,
      })
      
      return duration
    }
  }

  // Record a performance metric
  static recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Log slow operations
    if (metric.duration > this.thresholds.api.slow) {
      console.warn(`Slow operation detected: ${metric.name} took ${metric.duration.toFixed(2)}ms`)
    }
  }

  // Record database query performance
  static recordDatabaseQuery(metric: DatabaseMetric): void {
    this.dbMetrics.push(metric)
    
    if (this.dbMetrics.length > 500) {
      this.dbMetrics = this.dbMetrics.slice(-500)
    }

    // Alert on slow queries
    if (metric.duration > this.thresholds.database.slow) {
      console.warn(`Slow database query: ${metric.query.substring(0, 100)}... took ${metric.duration.toFixed(2)}ms`)
    }
  }

  // Record API endpoint performance
  static recordAPICall(metric: APIMetric): void {
    this.apiMetrics.push(metric)
    
    if (this.apiMetrics.length > 1000) {
      this.apiMetrics = this.apiMetrics.slice(-1000)
    }

    // Alert on slow API calls
    if (metric.duration > this.thresholds.api.slow) {
      console.warn(`Slow API call: ${metric.method} ${metric.endpoint} took ${metric.duration.toFixed(2)}ms`)
    }
  }

  // Record real-time operation performance
  static recordRealtimeOperation(metric: RealtimeMetric): void {
    this.realtimeMetrics.push(metric)
    
    if (this.realtimeMetrics.length > 500) {
      this.realtimeMetrics = this.realtimeMetrics.slice(-500)
    }

    // Alert on slow real-time operations
    if (metric.duration > this.thresholds.realtime.slow) {
      console.warn(`Slow real-time operation: ${metric.event} on ${metric.channel} took ${metric.duration.toFixed(2)}ms`)
    }
  }

  // Get performance statistics
  static getStats(): {
    general: any
    database: any
    api: any
    realtime: any
  } {
    return {
      general: this.calculateStats(this.metrics.map(m => m.duration)),
      database: this.calculateStats(this.dbMetrics.map(m => m.duration)),
      api: this.calculateStats(this.apiMetrics.map(m => m.duration)),
      realtime: this.calculateStats(this.realtimeMetrics.map(m => m.duration)),
    }
  }

  // Calculate statistics for a set of durations
  private static calculateStats(durations: number[]): {
    count: number
    min: number
    max: number
    avg: number
    p50: number
    p95: number
    p99: number
  } {
    if (durations.length === 0) {
      return {
        count: 0,
        min: 0,
        max: 0,
        avg: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      }
    }

    const sorted = durations.sort((a, b) => a - b)
    const count = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sum / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    }
  }

  // Get slow operations
  static getSlowOperations(threshold: number = 1000): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration > threshold)
  }

  // Get API performance by endpoint
  static getAPIPerformanceByEndpoint(): Record<string, any> {
    const endpointStats: Record<string, number[]> = {}
    
    this.apiMetrics.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`
      if (!endpointStats[key]) {
        endpointStats[key] = []
      }
      endpointStats[key].push(metric.duration)
    })

    const result: Record<string, any> = {}
    Object.entries(endpointStats).forEach(([endpoint, durations]) => {
      result[endpoint] = this.calculateStats(durations)
    })

    return result
  }

  // Get database performance by query type
  static getDatabasePerformanceByType(): Record<string, any> {
    const queryStats: Record<string, number[]> = {}
    
    this.dbMetrics.forEach(metric => {
      const queryType = metric.query.split(' ')[0].toUpperCase()
      if (!queryStats[queryType]) {
        queryStats[queryType] = []
      }
      queryStats[queryType].push(metric.duration)
    })

    const result: Record<string, any> = {}
    Object.entries(queryStats).forEach(([queryType, durations]) => {
      result[queryType] = this.calculateStats(durations)
    })

    return result
  }

  // Get real-time performance by event type
  static getRealtimePerformanceByEvent(): Record<string, any> {
    const eventStats: Record<string, number[]> = {}
    
    this.realtimeMetrics.forEach(metric => {
      if (!eventStats[metric.event]) {
        eventStats[metric.event] = []
      }
      eventStats[metric.event].push(metric.duration)
    })

    const result: Record<string, any> = {}
    Object.entries(eventStats).forEach(([event, durations]) => {
      result[event] = this.calculateStats(durations)
    })

    return result
  }

  // Check system health
  static getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical'
    issues: string[]
    metrics: any
  } {
    const stats = this.getStats()
    const issues: string[] = []
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'

    // Check API performance
    if (stats.api.p95 > this.thresholds.api.slow) {
      issues.push(`API 95th percentile response time is ${stats.api.p95.toFixed(2)}ms (threshold: ${this.thresholds.api.slow}ms)`)
      status = 'warning'
    }

    if (stats.api.p99 > this.thresholds.api.slow * 2) {
      issues.push(`API 99th percentile response time is ${stats.api.p99.toFixed(2)}ms (critical threshold: ${this.thresholds.api.slow * 2}ms)`)
      status = 'critical'
    }

    // Check database performance
    if (stats.database.p95 > this.thresholds.database.slow) {
      issues.push(`Database 95th percentile query time is ${stats.database.p95.toFixed(2)}ms (threshold: ${this.thresholds.database.slow}ms)`)
      status = status === 'critical' ? 'critical' : 'warning'
    }

    // Check real-time performance
    if (stats.realtime.p95 > this.thresholds.realtime.slow) {
      issues.push(`Real-time 95th percentile operation time is ${stats.realtime.p95.toFixed(2)}ms (threshold: ${this.thresholds.realtime.slow}ms)`)
      status = status === 'critical' ? 'critical' : 'warning'
    }

    // Check error rates
    const recentAPIMetrics = this.apiMetrics.slice(-100)
    const errorRate = recentAPIMetrics.filter(m => m.statusCode >= 500).length / recentAPIMetrics.length
    
    if (errorRate > 0.05) { // 5% error rate
      issues.push(`High error rate: ${(errorRate * 100).toFixed(1)}% of recent API calls failed`)
      status = 'critical'
    } else if (errorRate > 0.01) { // 1% error rate
      issues.push(`Elevated error rate: ${(errorRate * 100).toFixed(1)}% of recent API calls failed`)
      status = status === 'critical' ? 'critical' : 'warning'
    }

    return {
      status,
      issues,
      metrics: stats,
    }
  }

  // Export metrics for external monitoring
  static exportMetrics(): {
    timestamp: number
    general: PerformanceMetric[]
    database: DatabaseMetric[]
    api: APIMetric[]
    realtime: RealtimeMetric[]
    stats: any
    health: any
  } {
    return {
      timestamp: Date.now(),
      general: this.metrics.slice(-100), // Last 100 general metrics
      database: this.dbMetrics.slice(-100), // Last 100 DB metrics
      api: this.apiMetrics.slice(-100), // Last 100 API metrics
      realtime: this.realtimeMetrics.slice(-100), // Last 100 real-time metrics
      stats: this.getStats(),
      health: this.getHealthStatus(),
    }
  }

  // Clear old metrics (for memory management)
  static clearOldMetrics(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - olderThanMs
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff)
    // Note: DB, API, and real-time metrics don't have timestamps in this implementation
    // In a real system, you'd add timestamps to all metric types
  }

  // Reset all metrics (for testing)
  static reset(): void {
    this.metrics = []
    this.dbMetrics = []
    this.apiMetrics = []
    this.realtimeMetrics = []
  }
}

// Decorator for automatic performance monitoring
export function monitor(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value

  descriptor.value = async function (...args: any[]) {
    const stopTimer = PerformanceMonitor.startTimer(`${target.constructor.name}.${propertyName}`)
    
    try {
      const result = await method.apply(this, args)
      stopTimer()
      return result
    } catch (error) {
      stopTimer()
      throw error
    }
  }

  return descriptor
}

// Middleware for API performance monitoring
export function createPerformanceMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = performance.now()
    
    res.on('finish', () => {
      const duration = performance.now() - startTime
      
      PerformanceMonitor.recordAPICall({
        endpoint: req.path || req.url,
        method: req.method,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.id,
        userAgent: req.headers['user-agent'],
      })
    })
    
    next()
  }
}
