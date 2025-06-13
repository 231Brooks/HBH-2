import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { v2 as cloudinary } from "cloudinary"
import Stripe from "stripe"
import nodemailer from "nodemailer"
import Pusher from "pusher"
import { Redis } from "@upstash/redis"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get category filter from query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Run diagnostics
    const results = await runDiagnostics(category || undefined)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Diagnostics error:", error)
    return NextResponse.json({ error: "Failed to run diagnostics" }, { status: 500 })
  }
}

async function runDiagnostics(category?: string) {
  const results = []

  // Database tests
  if (!category || category === "database") {
    // Test Postgres connection
    try {
      const startTime = Date.now()
      const users = await prisma.user.findMany({ take: 1 })
      const endTime = Date.now()

      results.push({
        name: "PostgreSQL Database",
        description: "Tests connection to the primary PostgreSQL database",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: { connectionTime: `${endTime - startTime}ms` },
        category: "database",
      })
    } catch (error) {
      results.push({
        name: "PostgreSQL Database",
        description: "Tests connection to the primary PostgreSQL database",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "database",
      })
    }

    // Test Supabase connection
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase URL or service key not configured")
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const startTime = Date.now()
      const { data, error } = await supabase.from("messages").select("count").limit(1)
      const endTime = Date.now()

      if (error) throw error

      results.push({
        name: "Supabase",
        description: "Tests connection to Supabase",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: { connectionTime: `${endTime - startTime}ms` },
        category: "database",
      })
    } catch (error) {
      results.push({
        name: "Supabase",
        description: "Tests connection to Supabase",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "database",
      })
    }
  }

  // Redis/KV tests
  if (!category || category === "database") {
    try {
      const redisUrl = process.env.REDIS_URL || process.env.KV_URL
      const redisToken = process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN

      if (!redisUrl || !redisToken) {
        throw new Error("Redis URL or token not configured")
      }

      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      })

      const startTime = Date.now()
      const testKey = `diagnostic-test-${Date.now()}`
      await redis.set(testKey, "test-value", { ex: 60 }) // Expires in 60 seconds
      const value = await redis.get(testKey)
      const endTime = Date.now()

      if (value !== "test-value") {
        throw new Error("Redis value mismatch")
      }

      results.push({
        name: "Redis/Upstash KV",
        description: "Tests connection to Redis/Upstash KV",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: { connectionTime: `${endTime - startTime}ms` },
        category: "database",
      })
    } catch (error) {
      results.push({
        name: "Redis/Upstash KV",
        description: "Tests connection to Redis/Upstash KV",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "database",
      })
    }
  }

  // Authentication tests
  if (!category || category === "auth") {
    // Test NextAuth configuration
    try {
      const nextAuthSecret = process.env.NEXTAUTH_SECRET
      const nextAuthUrl = process.env.NEXTAUTH_URL

      if (!nextAuthSecret) {
        throw new Error("NEXTAUTH_SECRET is not configured")
      }

      if (!nextAuthUrl) {
        throw new Error("NEXTAUTH_URL is not configured")
      }

      results.push({
        name: "NextAuth",
        description: "Tests NextAuth configuration",
        status: "success",
        message: "NextAuth is properly configured",
        category: "auth",
      })
    } catch (error) {
      results.push({
        name: "NextAuth",
        description: "Tests NextAuth configuration",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "auth",
      })
    }

    // Test GitHub OAuth
    try {
      const githubId = process.env.GITHUB_ID
      const githubSecret = process.env.GITHUB_SECRET

      if (!githubId || !githubSecret) {
        throw new Error("GitHub OAuth credentials are not configured")
      }

      results.push({
        name: "GitHub OAuth",
        description: "Tests GitHub OAuth configuration",
        status: "success",
        message: "GitHub OAuth is properly configured",
        category: "auth",
      })
    } catch (error) {
      results.push({
        name: "GitHub OAuth",
        description: "Tests GitHub OAuth configuration",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "auth",
      })
    }
  }

  // Storage tests
  if (!category || category === "storage") {
    // Test Cloudinary
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const apiKey = process.env.CLOUDINARY_API_KEY
      const apiSecret = process.env.CLOUDINARY_API_SECRET

      if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary credentials are not configured")
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      })

      const startTime = Date.now()
      const result = await cloudinary.api.ping()
      const endTime = Date.now()

      results.push({
        name: "Cloudinary",
        description: "Tests connection to Cloudinary",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: { status: result.status },
        category: "storage",
      })
    } catch (error) {
      results.push({
        name: "Cloudinary",
        description: "Tests connection to Cloudinary",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "storage",
      })
    }
  }

  // Messaging tests
  if (!category || category === "messaging") {
    // Test Email
    try {
      const emailHost = process.env.EMAIL_SERVER_HOST
      const emailPort = process.env.EMAIL_SERVER_PORT
      const emailUser = process.env.EMAIL_SERVER_USER
      const emailPass = process.env.EMAIL_SERVER_PASSWORD
      const emailFrom = process.env.EMAIL_FROM

      if (!emailHost || !emailPort || !emailUser || !emailPass || !emailFrom) {
        throw new Error("Email configuration is incomplete")
      }

      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: Number(emailPort),
        secure: Number(emailPort) === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      })

      // We don't actually send an email, just verify the connection
      const startTime = Date.now()
      await transporter.verify()
      const endTime = Date.now()

      results.push({
        name: "Email (SMTP)",
        description: "Tests connection to email server",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: { server: emailHost, port: emailPort },
        category: "messaging",
      })
    } catch (error) {
      results.push({
        name: "Email (SMTP)",
        description: "Tests connection to email server",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "messaging",
      })
    }

    // Test Pusher
    try {
      const pusherAppId = process.env.PUSHER_APP_ID
      const pusherKey = process.env.PUSHER_KEY
      const pusherSecret = process.env.PUSHER_SECRET
      const pusherCluster = process.env.PUSHER_CLUSTER

      if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster) {
        throw new Error("Pusher configuration is incomplete")
      }

      const pusher = new Pusher({
        appId: pusherAppId,
        key: pusherKey,
        secret: pusherSecret,
        cluster: pusherCluster,
        useTLS: true,
      })

      // We don't actually send a message, just check if the configuration is valid
      results.push({
        name: "Pusher",
        description: "Tests Pusher configuration",
        status: "success",
        message: "Pusher is properly configured",
        details: { cluster: pusherCluster },
        category: "messaging",
      })
    } catch (error) {
      results.push({
        name: "Pusher",
        description: "Tests Pusher configuration",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "messaging",
      })
    }
  }

  // Payment tests
  if (!category || category === "payment") {
    // Test Stripe
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY
      const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

      if (!stripeSecretKey) {
        throw new Error("Stripe secret key is not configured")
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
      })

      const startTime = Date.now()
      const balance = await stripe.balance.retrieve()
      const endTime = Date.now()

      results.push({
        name: "Stripe",
        description: "Tests connection to Stripe",
        status: "success",
        message: `Connected successfully in ${endTime - startTime}ms`,
        details: {
          webhookConfigured: !!stripeWebhookSecret,
          availableCurrencies: balance.available.map((b) => b.currency),
        },
        category: "payment",
      })
    } catch (error) {
      results.push({
        name: "Stripe",
        description: "Tests connection to Stripe",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        category: "payment",
      })
    }
  }

  return results
}
