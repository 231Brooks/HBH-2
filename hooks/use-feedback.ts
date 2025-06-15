"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface FeedbackOptions {
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  errorMessage?: string
  showToast?: boolean
  autoReset?: boolean
  resetDelay?: number
}

interface FeedbackState {
  loading: boolean
  success: boolean
  error: Error | null
}

interface FeedbackActions {
  execute: <T>(operation: () => Promise<T>, options?: FeedbackOptions) => Promise<T | null>
  setLoading: (loading: boolean) => void
  setSuccess: (success: boolean) => void
  setError: (error: Error | null) => void
  reset: () => void
}

/**
 * Custom hook for managing user feedback states
 * Provides consistent feedback patterns across the application
 */
export function useFeedback(defaultOptions: FeedbackOptions = {}): FeedbackState & FeedbackActions {
  const { toast } = useToast()
  const [state, setState] = useState<FeedbackState>({
    loading: false,
    success: false,
    error: null
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setSuccess = useCallback((success: boolean) => {
    setState(prev => ({ ...prev, success, loading: false, error: null }))
  }, [])

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error, loading: false, success: false }))
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, success: false, error: null })
  }, [])

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options: FeedbackOptions = {}
  ): Promise<T | null> => {
    const mergedOptions = { ...defaultOptions, ...options }
    const {
      successTitle = "Success",
      successMessage,
      errorTitle = "Error",
      errorMessage,
      showToast = true,
      autoReset = true,
      resetDelay = 3000
    } = mergedOptions

    setLoading(true)

    try {
      const result = await operation()
      setSuccess(true)

      if (showToast && successMessage) {
        toast({
          title: successTitle,
          description: successMessage,
          variant: "default"
        })
      }

      if (autoReset) {
        setTimeout(reset, resetDelay)
      }

      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)

      if (showToast) {
        toast({
          title: errorTitle,
          description: errorMessage || errorObj.message,
          variant: "destructive"
        })
      }

      if (autoReset) {
        setTimeout(reset, resetDelay)
      }

      return null
    }
  }, [defaultOptions, setLoading, setSuccess, setError, reset, toast])

  return {
    ...state,
    execute,
    setLoading,
    setSuccess,
    setError,
    reset
  }
}

/**
 * Specialized hook for form submission feedback
 */
export function useFormFeedback() {
  return useFeedback({
    successTitle: "Form Submitted",
    successMessage: "Your form has been submitted successfully",
    errorTitle: "Submission Failed",
    showToast: true,
    autoReset: true,
    resetDelay: 3000
  })
}

/**
 * Specialized hook for save operation feedback
 */
export function useSaveFeedback() {
  return useFeedback({
    successTitle: "Saved",
    successMessage: "Your changes have been saved",
    errorTitle: "Save Failed",
    showToast: true,
    autoReset: true,
    resetDelay: 2000
  })
}

/**
 * Specialized hook for delete operation feedback
 */
export function useDeleteFeedback() {
  return useFeedback({
    successTitle: "Deleted",
    successMessage: "Item has been deleted successfully",
    errorTitle: "Delete Failed",
    showToast: true,
    autoReset: true,
    resetDelay: 2000
  })
}

/**
 * Specialized hook for copy operation feedback
 */
export function useCopyFeedback() {
  return useFeedback({
    successTitle: "Copied",
    successMessage: "Text copied to clipboard",
    errorTitle: "Copy Failed",
    errorMessage: "Failed to copy text to clipboard",
    showToast: true,
    autoReset: true,
    resetDelay: 1500
  })
}

/**
 * Hook for managing multiple feedback states (e.g., multiple buttons)
 */
export function useMultipleFeedback() {
  const [feedbackStates, setFeedbackStates] = useState<Record<string, FeedbackState>>({})

  const getFeedback = useCallback((key: string): FeedbackState => {
    return feedbackStates[key] || { loading: false, success: false, error: null }
  }, [feedbackStates])

  const setFeedback = useCallback((key: string, state: Partial<FeedbackState>) => {
    setFeedbackStates(prev => ({
      ...prev,
      [key]: { ...getFeedback(key), ...state }
    }))
  }, [getFeedback])

  const execute = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options: FeedbackOptions = {}
  ): Promise<T | null> => {
    const { toast } = useToast()
    const {
      successTitle = "Success",
      successMessage,
      errorTitle = "Error",
      errorMessage,
      showToast = true,
      autoReset = true,
      resetDelay = 3000
    } = options

    setFeedback(key, { loading: true, error: null })

    try {
      const result = await operation()
      setFeedback(key, { loading: false, success: true })

      if (showToast && successMessage) {
        toast({
          title: successTitle,
          description: successMessage,
          variant: "default"
        })
      }

      if (autoReset) {
        setTimeout(() => {
          setFeedback(key, { success: false })
        }, resetDelay)
      }

      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setFeedback(key, { loading: false, error: errorObj })

      if (showToast) {
        toast({
          title: errorTitle,
          description: errorMessage || errorObj.message,
          variant: "destructive"
        })
      }

      if (autoReset) {
        setTimeout(() => {
          setFeedback(key, { error: null })
        }, resetDelay)
      }

      return null
    }
  }, [setFeedback, toast])

  const reset = useCallback((key: string) => {
    setFeedback(key, { loading: false, success: false, error: null })
  }, [setFeedback])

  const resetAll = useCallback(() => {
    setFeedbackStates({})
  }, [])

  return {
    getFeedback,
    execute,
    reset,
    resetAll
  }
}

/**
 * Hook for progress feedback (e.g., file uploads)
 */
export function useProgressFeedback() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'progress' | 'complete' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const start = useCallback((initialMessage = 'Starting...') => {
    setProgress(0)
    setStatus('progress')
    setMessage(initialMessage)
  }, [])

  const updateProgress = useCallback((newProgress: number, newMessage?: string) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))
    if (newMessage) setMessage(newMessage)
  }, [])

  const complete = useCallback((completeMessage = 'Complete!') => {
    setProgress(100)
    setStatus('complete')
    setMessage(completeMessage)
  }, [])

  const error = useCallback((errorMessage = 'An error occurred') => {
    setStatus('error')
    setMessage(errorMessage)
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setStatus('idle')
    setMessage('')
  }, [])

  return {
    progress,
    status,
    message,
    start,
    updateProgress,
    complete,
    error,
    reset
  }
}
