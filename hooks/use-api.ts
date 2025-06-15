"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface ApiOptions {
  immediate?: boolean
  showErrorToast?: boolean
  retries?: number
  retryDelay?: number
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface ApiReturn<T> extends ApiState<T> {
  refetch: () => Promise<void>
  mutate: (newData: T) => void
  reset: () => void
}

/**
 * Custom hook for API calls with loading, error states, and caching
 * Eliminates repeated API call patterns across components
 */
export function useApi<T = any>(
  url: string | null,
  options: ApiOptions = {}
): ApiReturn<T> {
  const { immediate = true, showErrorToast = false, retries = 3, retryDelay = 1000 } = options
  const { toast } = useToast()

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = useCallback(async (attempt = 0): Promise<void> => {
    if (!url) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setState({
        data,
        loading: false,
        error: null
      })
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      // Retry logic
      if (attempt < retries) {
        setTimeout(() => {
          fetchData(attempt + 1)
        }, retryDelay * Math.pow(2, attempt)) // Exponential backoff
        return
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }))

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorObj.message,
          variant: "destructive"
        })
      }
    }
  }, [url, retries, retryDelay, showErrorToast, toast])

  const mutate = useCallback((newData: T) => {
    setState(prev => ({ ...prev, data: newData }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  useEffect(() => {
    if (immediate && url) {
      fetchData()
    }
  }, [url, immediate, fetchData])

  return {
    ...state,
    refetch: fetchData,
    mutate,
    reset
  }
}

/**
 * Hook for POST requests
 */
export function useApiPost<TRequest = any, TResponse = any>(url: string) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const post = useCallback(async (data: TRequest): Promise<TResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      
      toast({
        title: "Error",
        description: errorObj.message,
        variant: "destructive"
      })
      
      return null
    } finally {
      setLoading(false)
    }
  }, [url, toast])

  return { post, loading, error }
}

/**
 * Hook for PUT requests
 */
export function useApiPut<TRequest = any, TResponse = any>(url: string) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const put = useCallback(async (data: TRequest): Promise<TResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      
      toast({
        title: "Error",
        description: errorObj.message,
        variant: "destructive"
      })
      
      return null
    } finally {
      setLoading(false)
    }
  }, [url, toast])

  return { put, loading, error }
}

/**
 * Hook for DELETE requests
 */
export function useApiDelete(url: string) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteItem = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
        variant: "default"
      })

      return true
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      
      toast({
        title: "Error",
        description: errorObj.message,
        variant: "destructive"
      })
      
      return false
    } finally {
      setLoading(false)
    }
  }, [url, toast])

  return { deleteItem, loading, error }
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T = any>(
  baseUrl: string,
  pageSize = 10
) {
  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  
  const url = `${baseUrl}?page=${page}&limit=${pageSize}`
  const { data, loading, error, refetch } = useApi<{ items: T[], hasMore: boolean }>(url)

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllData(data.items)
      } else {
        setAllData(prev => [...prev, ...data.items])
      }
      setHasMore(data.hasMore)
    }
  }, [data, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  const reset = useCallback(() => {
    setPage(1)
    setAllData([])
    setHasMore(true)
  }, [])

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    refetch: () => {
      reset()
      refetch()
    }
  }
}
