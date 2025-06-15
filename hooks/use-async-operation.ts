"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface AsyncOperationOptions {
  successMessage?: string
  errorMessage?: string
  onSuccess?: (data?: any) => void
  onError?: (error: Error) => void
  showToast?: boolean
}

interface AsyncOperationState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface AsyncOperationReturn<T> extends AsyncOperationState<T> {
  execute: (operation: () => Promise<T>) => Promise<T | null>
  reset: () => void
}

/**
 * Custom hook for handling async operations with loading, error states, and toast notifications
 * Eliminates repeated async operation patterns across components
 */
export function useAsyncOperation<T = any>(
  options: AsyncOperationOptions = {}
): AsyncOperationReturn<T> {
  const { toast } = useToast()
  const {
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    showToast = true
  } = options

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await operation()
      
      setState({
        data: result,
        loading: false,
        error: null
      })

      if (showToast && successMessage) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "default"
        })
      }

      onSuccess?.(result)
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }))

      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage || errorObj.message,
          variant: "destructive"
        })
      }

      onError?.(errorObj)
      return null
    }
  }, [successMessage, errorMessage, onSuccess, onError, showToast, toast])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

/**
 * Specialized hook for form submissions
 */
export function useFormSubmission<T = any>(options: AsyncOperationOptions = {}) {
  return useAsyncOperation<T>({
    successMessage: "Form submitted successfully",
    errorMessage: "Failed to submit form",
    ...options
  })
}

/**
 * Specialized hook for data fetching
 */
export function useDataFetch<T = any>(options: AsyncOperationOptions = {}) {
  return useAsyncOperation<T>({
    errorMessage: "Failed to load data",
    showToast: false, // Usually don't show toast for fetch errors
    ...options
  })
}

/**
 * Specialized hook for delete operations
 */
export function useDeleteOperation(options: AsyncOperationOptions = {}) {
  return useAsyncOperation({
    successMessage: "Item deleted successfully",
    errorMessage: "Failed to delete item",
    ...options
  })
}
