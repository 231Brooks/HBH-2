"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase client for admin operations (only if env vars are available)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Apply database optimizations
export async function applyDatabaseOptimizations(formData: FormData) {
  try {
    const apiKey = process.env.INTERNAL_API_KEY
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000"
    const protocol = vercelUrl.includes("localhost") ? "http" : "https"

    const response = await fetch(`${protocol}://${vercelUrl}/api/setup-db-optimizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to apply optimizations: ${response.statusText}`)
    }

    const result = await response.json()
    revalidatePath("/admin/db-optimizations")
    return { success: true, result }
  } catch (error: any) {
    console.error("Error applying database optimizations:", error)
    return { success: false, error: error.message }
  }
}

// Get query performance logs
export async function getQueryPerformanceLogs(limit = 10, minDuration = 0) {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty performance logs")
      return []
    }

    const { data, error } = await supabase
      .from("query_performance_logs")
      .select("*")
      .gt("duration_ms", minDuration)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Failed to fetch query performance logs:", error)
    return []
  }
}

// Get cache performance metrics
export async function getCacheMetrics() {
  // This would typically come from Redis metrics
  // For now, we'll return mock data
  return {
    hitRate: 76,
    missRate: 24,
    avgTtl: 450,
    byType: {
      propertyList: { hitRate: 82, avgTtl: 300 },
      propertyDetail: { hitRate: 91, avgTtl: 1800 },
      userProfile: { hitRate: 68, avgTtl: 3600 },
      searchResults: { hitRate: 54, avgTtl: 120 },
    },
  }
}

// Update cache TTL settings
export async function updateCacheTtlSettings(formData: FormData) {
  try {
    const settings = {
      propertyList: Number.parseInt(formData.get("propertyListTtl") as string),
      propertyDetail: Number.parseInt(formData.get("propertyDetailTtl") as string),
      userProfile: Number.parseInt(formData.get("userProfileTtl") as string),
      searchResults: Number.parseInt(formData.get("searchResultsTtl") as string),
    }

    // In a real implementation, this would update your Redis configuration
    // For now, we'll just return success

    return { success: true, settings }
  } catch (error: any) {
    console.error("Failed to update cache TTL settings:", error)
    return { success: false, error: error.message }
  }
}
