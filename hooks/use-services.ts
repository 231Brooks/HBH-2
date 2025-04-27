"use client"

import { useState, useEffect } from "react"
import { getServices } from "@/app/actions/service-actions"
import type { Service } from "@/types"

interface UseServicesOptions {
  category?: string
  verified?: boolean
  location?: string
  limit?: number
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const fetchServices = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const newOffset = reset ? 0 : offset
      const result = await getServices({
        ...options,
        offset: newOffset,
      })

      if (reset) {
        setServices(result.services)
      } else {
        setServices((prev) => [...prev, ...result.services])
      }

      setTotal(result.total)
      setHasMore(result.hasMore)
      setOffset(reset ? options.limit || 10 : newOffset + (options.limit || 10))
    } catch (err) {
      setError("Failed to fetch services")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchServices()
    }
  }

  const refresh = () => {
    fetchServices(true)
  }

  useEffect(() => {
    fetchServices(true)
  }, [options.category, options.verified, options.location, options.limit])

  return {
    services,
    isLoading,
    error,
    total,
    hasMore,
    loadMore,
    refresh,
  }
}
