/**
 * Form utility functions for common form operations
 * Eliminates repeated form handling logic across components
 */

import { z } from "zod"

/**
 * Convert FormData to a plain object
 */
export function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {}
  
  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      // Handle multiple values for the same key (e.g., checkboxes)
      if (Array.isArray(obj[key])) {
        obj[key].push(value)
      } else {
        obj[key] = [obj[key], value]
      }
    } else {
      obj[key] = value
    }
  }
  
  return obj
}

/**
 * Validate form data against a Zod schema
 */
export async function validateFormData<T>(
  formData: FormData | Record<string, any>,
  schema: z.ZodType<T>
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const data = formData instanceof FormData ? formDataToObject(formData) : formData
    const validatedData = schema.parse(data)
    
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach(err => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

/**
 * Sanitize form input to prevent XSS
 */
export function sanitizeFormInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/&/g, "&amp;")
}

/**
 * Format form errors for display
 */
export function formatFormErrors(errors: Record<string, string>): string[] {
  return Object.entries(errors).map(([field, message]) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
    return `${fieldName}: ${message}`
  })
}

/**
 * Extract nested form data (e.g., address.street)
 */
export function extractNestedFormData(
  formData: FormData,
  prefix: string
): Record<string, any> {
  const nested: Record<string, any> = {}
  
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(prefix + '.')) {
      const nestedKey = key.substring(prefix.length + 1)
      nested[nestedKey] = value
    }
  }
  
  return nested
}

/**
 * Handle file uploads in forms
 */
export async function handleFileUploads(
  files: File[],
  uploadEndpoint: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}`)
    }
    
    const result = await response.json()
    return result.url
  })
  
  return Promise.all(uploadPromises)
}

/**
 * Debounce form validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Format currency input
 */
export function formatCurrency(value: string): string {
  // Remove non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')
  
  // Ensure only one decimal point
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit decimal places to 2
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2)
  }
  
  const formatted = parts.join('.')
  
  // Add commas for thousands
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }
  
  return formatted
}

/**
 * Format phone number input
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (numericValue.length >= 10) {
    return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`
  } else if (numericValue.length >= 6) {
    return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6)}`
  } else if (numericValue.length >= 3) {
    return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`
  } else {
    return numericValue
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
  return phoneRegex.test(phone)
}

/**
 * Generate form field ID
 */
export function generateFieldId(formId: string, fieldName: string): string {
  return `${formId}-${fieldName}`
}

/**
 * Handle form submission with loading state
 */
export async function handleFormSubmission<T>(
  formData: FormData | Record<string, any>,
  submitFunction: (data: T) => Promise<any>,
  schema: z.ZodType<T>,
  options: {
    onSuccess?: (result: any) => void
    onError?: (error: Error) => void
    resetForm?: () => void
  } = {}
): Promise<{ success: boolean; result?: any; errors?: Record<string, string> }> {
  try {
    // Validate form data
    const validation = await validateFormData(formData, schema)
    
    if (!validation.success) {
      return { success: false, errors: validation.errors }
    }
    
    // Submit form
    const result = await submitFunction(validation.data!)
    
    options.onSuccess?.(result)
    options.resetForm?.()
    
    return { success: true, result }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    options.onError?.(errorObj)
    
    return { 
      success: false, 
      errors: { general: errorObj.message } 
    }
  }
}

/**
 * Create form field props for consistent styling
 */
export function createFieldProps(
  name: string,
  value: any,
  error?: string,
  touched?: boolean
) {
  return {
    name,
    value,
    error: touched ? error : undefined,
    'aria-invalid': touched && error ? 'true' : 'false',
    'aria-describedby': error ? `${name}-error` : undefined,
  }
}
