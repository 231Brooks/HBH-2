/**
 * API client with retry logic for the real estate platform
 */

// Options for fetch requests with retry functionality
interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  retryStatusCodes?: number[]
}

/**
 * Enhanced fetch with retry logic, timeout, and error handling
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}) {
  const { retries = 3, retryDelay = 300, retryStatusCodes = [408, 429, 500, 502, 503, 504], ...fetchOptions } = options

  let lastError: Error | null = null
  let attempt = 0

  while (attempt <= retries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // If response is not ok and status code is in retryStatusCodes
      if (!response.ok && retryStatusCodes.includes(response.status)) {
        if (attempt === retries) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        attempt++
        continue
      }

      // If response is not ok but status code is not in retryStatusCodes
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error as Error

      // Don't retry if it's a client error (e.g., invalid request)
      if (lastError.name === "AbortError" || lastError.message.includes("Failed to fetch")) {
        if (attempt === retries) {
          throw lastError
        }

        // Wait before retrying
        const delay = retryDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        attempt++
      } else {
        throw lastError
      }
    }
  }

  throw lastError || new Error("Request failed after retries")
}

/**
 * API client with methods for common operations
 */
export const apiClient = {
  get: (url: string, options?: FetchOptions) => fetchWithRetry(url, { method: "GET", ...options }),

  post: (url: string, data: any, options?: FetchOptions) =>
    fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...options,
    }),

  put: (url: string, data: any, options?: FetchOptions) =>
    fetchWithRetry(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...options,
    }),

  delete: (url: string, options?: FetchOptions) => fetchWithRetry(url, { method: "DELETE", ...options }),
}
