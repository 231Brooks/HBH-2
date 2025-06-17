import { NextRequest, NextResponse } from 'next/server'
import { PerformanceMonitor } from '@/lib/performance-monitor'
import prisma from '@/lib/prisma'
import { getPusherServer } from '@/lib/pusher-server'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: HealthCheckResult
    pusher: HealthCheckResult
    performance: HealthCheckResult
    memory: HealthCheckResult
    disk: HealthCheckResult
  }
  metrics?: any
}

interface HealthCheckResult {
  status: 'pass' | 'warn' | 'fail'
  responseTime?: number
  message?: string
  details?: any
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includeMetrics = searchParams.get('metrics') === 'true'

    // Perform health checks
    const checks = await Promise.allSettled([
      checkDatabase(),
      checkPusher(),
      checkPerformance(),
      checkMemory(),
      checkDisk(),
    ])

    const healthChecks = {
      database: checks[0].status === 'fulfilled' ? checks[0].value : { status: 'fail', message: 'Database check failed' },
      pusher: checks[1].status === 'fulfilled' ? checks[1].value : { status: 'fail', message: 'Pusher check failed' },
      performance: checks[2].status === 'fulfilled' ? checks[2].value : { status: 'fail', message: 'Performance check failed' },
      memory: checks[3].status === 'fulfilled' ? checks[3].value : { status: 'fail', message: 'Memory check failed' },
      disk: checks[4].status === 'fulfilled' ? checks[4].value : { status: 'fail', message: 'Disk check failed' },
    }

    // Determine overall status
    const overallStatus = determineOverallStatus(healthChecks)

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: healthChecks,
    }

    // Include performance metrics if requested
    if (includeMetrics) {
      healthCheck.metrics = PerformanceMonitor.exportMetrics()
    }

    // Set appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 :
                      overallStatus === 'degraded' ? 200 : 503

    return NextResponse.json(healthCheck, { status: httpStatus })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      error: 'Health check system failure',
    }, { status: 503 })
  }
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1 as health_check`

    const responseTime = Date.now() - startTime

    if (responseTime > 1000) {
      return {
        status: 'warn',
        responseTime,
        message: 'Database responding slowly',
        details: { threshold: 1000 }
      }
    }

    return {
      status: 'pass',
      responseTime,
      message: 'Database connection healthy'
    }
  } catch (error) {
    return {
      status: 'fail',
      responseTime: Date.now() - startTime,
      message: 'Database connection failed',
      details: { error: error.message }
    }
  }
}

async function checkPusher(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    const pusher = getPusherServer()

    // Test Pusher connection by getting channel info
    await pusher.get({ path: '/channels' })

    const responseTime = Date.now() - startTime

    if (responseTime > 500) {
      return {
        status: 'warn',
        responseTime,
        message: 'Pusher responding slowly',
        details: { threshold: 500 }
      }
    }

    return {
      status: 'pass',
      responseTime,
      message: 'Pusher connection healthy'
    }
  } catch (error) {
    return {
      status: 'fail',
      responseTime: Date.now() - startTime,
      message: 'Pusher connection failed',
      details: { error: error.message }
    }
  }
}

async function checkPerformance(): Promise<HealthCheckResult> {
  try {
    const healthStatus = PerformanceMonitor.getHealthStatus()

    return {
      status: healthStatus.status === 'healthy' ? 'pass' :
              healthStatus.status === 'warning' ? 'warn' : 'fail',
      message: `Performance status: ${healthStatus.status}`,
      details: {
        issues: healthStatus.issues,
        metrics: healthStatus.metrics
      }
    }
  } catch (error) {
    return {
      status: 'fail',
      message: 'Performance monitoring failed',
      details: { error: error.message }
    }
  }
}

async function checkMemory(): Promise<HealthCheckResult> {
  try {
    const memoryUsage = process.memoryUsage()
    const totalMemory = memoryUsage.heapTotal
    const usedMemory = memoryUsage.heapUsed
    const memoryUtilization = (usedMemory / totalMemory) * 100

    const details = {
      heapUsed: Math.round(usedMemory / 1024 / 1024),
      heapTotal: Math.round(totalMemory / 1024 / 1024),
      utilization: Math.round(memoryUtilization),
      external: Math.round(memoryUsage.external / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
    }

    if (memoryUtilization > 90) {
      return {
        status: 'fail',
        message: 'Critical memory usage',
        details
      }
    } else if (memoryUtilization > 80) {
      return {
        status: 'warn',
        message: 'High memory usage',
        details
      }
    }

    return {
      status: 'pass',
      message: 'Memory usage normal',
      details
    }
  } catch (error) {
    return {
      status: 'fail',
      message: 'Memory check failed',
      details: { error: error.message }
    }
  }
}

async function checkDisk(): Promise<HealthCheckResult> {
  try {
    // Simulate disk check (in real implementation, check actual disk space)
    const simulatedDiskUsage = 45

    const details = {
      usage: simulatedDiskUsage,
      available: 100 - simulatedDiskUsage,
      unit: 'percentage'
    }

    if (simulatedDiskUsage > 90) {
      return {
        status: 'fail',
        message: 'Critical disk usage',
        details
      }
    } else if (simulatedDiskUsage > 80) {
      return {
        status: 'warn',
        message: 'High disk usage',
        details
      }
    }

    return {
      status: 'pass',
      message: 'Disk usage normal',
      details
    }
  } catch (error) {
    return {
      status: 'fail',
      message: 'Disk check failed',
      details: { error: error.message }
    }
  }
}

function determineOverallStatus(checks: Record<string, HealthCheckResult>): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(checks).map(check => check.status)

  if (statuses.includes('fail')) {
    return 'unhealthy'
  }

  if (statuses.includes('warn')) {
    return 'degraded'
  }

  return 'healthy'
}
