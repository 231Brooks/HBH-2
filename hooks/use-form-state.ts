"use client"

import { useState, useCallback, useEffect } from "react"
import { z } from "zod"

interface FormStateOptions<T> {
  initialValues: T
  validationSchema?: z.ZodType<T>
  onSubmit?: (values: T) => Promise<void> | void
  resetOnSubmit?: boolean
}

interface FormFieldError {
  message: string
  type: string
}

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, FormFieldError>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void
  setValues: (values: Partial<T>) => void
  setError: (field: keyof T, error: FormFieldError) => void
  clearError: (field: keyof T) => void
  setTouched: (field: keyof T, touched?: boolean) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: () => void
  validate: () => boolean
  validateField: (field: keyof T) => boolean
}

/**
 * Custom hook for comprehensive form state management
 * Eliminates repeated form handling patterns across components
 */
export function useFormState<T extends Record<string, any>>(
  options: FormStateOptions<T>
): FormState<T> & FormActions<T> {
  const { initialValues, validationSchema, onSubmit, resetOnSubmit = false } = options

  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, FormFieldError>>>({})
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate derived state
  const isValid = Object.keys(errors).length === 0
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }))
  }, [])

  const setError = useCallback((field: keyof T, error: FormFieldError) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const setTouched = useCallback((field: keyof T, touchedValue = true) => {
    setTouchedState(prev => ({ ...prev, [field]: touchedValue }))
  }, [])

  const validateField = useCallback((field: keyof T): boolean => {
    if (!validationSchema) return true

    try {
      // Create a partial schema for single field validation
      const fieldSchema = validationSchema.pick({ [field]: true } as any)
      fieldSchema.parse({ [field]: values[field] })
      clearError(field)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]
        setError(field, {
          message: fieldError.message,
          type: fieldError.code
        })
      }
      return false
    }
  }, [values, validationSchema, setError, clearError])

  const validate = useCallback((): boolean => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, FormFieldError>> = {}
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T
          newErrors[field] = {
            message: err.message,
            type: err.code
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [values, validationSchema])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (isSubmitting) return

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as Partial<Record<keyof T, boolean>>)
    setTouchedState(allTouched)

    // Validate form
    if (!validate()) return

    setIsSubmitting(true)

    try {
      await onSubmit?.(values)
      
      if (resetOnSubmit) {
        reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, isSubmitting, validate, onSubmit, resetOnSubmit])

  const reset = useCallback(() => {
    setValuesState(initialValues)
    setErrors({})
    setTouchedState({})
    setIsSubmitting(false)
  }, [initialValues])

  // Validate on value changes if field is touched
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field as keyof T]) {
        validateField(field as keyof T)
      }
    })
  }, [values, touched, validateField])

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    
    // Actions
    setValue,
    setValues,
    setError,
    clearError,
    setTouched,
    handleSubmit,
    reset,
    validate,
    validateField
  }
}

/**
 * Helper hook for handling file uploads in forms
 */
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const uploadFile = useCallback(async (file: File, uploadUrl: string): Promise<string> => {
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return result.url
    } finally {
      setUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFiles([])
    setUploading(false)
    setUploadProgress({})
  }, [])

  return {
    files,
    uploading,
    uploadProgress,
    addFiles,
    removeFile,
    uploadFile,
    reset
  }
}
