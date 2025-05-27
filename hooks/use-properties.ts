"use client"

import { useState, useEffect } from "react"
import { getProperties } from "@/app/actions/property-actions"
import type { Property } from "@/types"

interface UsePropertiesOptions {
  status?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  limit?: number
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const fetchProperties = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const newOffset = reset ? 0 : offset
      const result = await getProperties({
        ...options,
        offset: newOffset,
      })

      if (reset) {
        setProperties(result.properties)
      } else {
        setProperties((prev) => [...prev, ...result.properties])
      }

      setTotal(result.total)
      setHasMore(result.hasMore)
      setOffset(reset ? options.limit || 10 : newOffset + (options.limit || 10))
    } catch (err) {
      setError("Failed to fetch properties")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchProperties()
    }
  }

  const refresh = () => {
    fetchProperties(true)
  }

  useEffect(() => {
    fetchProperties(true)
  }, [options.status, options.type, options.minPrice, options.maxPrice, options.beds, options.baths, options.limit])

  return {
    properties,
    isLoading,
    error,
    total,
    hasMore,
    loadMore,
    refresh,
  }
}
