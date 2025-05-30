import { NextResponse } from "next/server"
import { runDeploymentReadinessCheck } from "@/lib/deployment-diagnostics"

export async function GET() {
  try {
    const check = runDeploymentReadinessCheck()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      deploymentReady: check.ready,
      issues: check.issues,
      warnings: check.warnings,
      recommendations: check.recommendations,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
        vercelUrl: process.env.VERCEL_URL || null,
      },
    })
  } catch (error) {
    console.error("Deployment check error:", error)
    return NextResponse.json(
      {
        error: "Failed to run deployment check",
        deploymentReady: false,
        issues: ["Deployment check failed to run"],
      },
      { status: 500 },
    )
  }
}
