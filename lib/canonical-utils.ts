import { getBaseUrl } from "./url-utils"

/**
 * Generates a canonical URL path for a page, handling pagination and filters
 *
 * @param basePath The base path of the page (e.g., "/marketplace")
 * @param params Optional parameters to include in the canonical URL
 * @param excludeParams Optional array of parameter names to exclude from the canonical URL
 * @returns The canonical path (without domain)
 */
export function getCanonicalPath(
  basePath: string,
  params?: Record<string, string | string[] | undefined>,
  excludeParams: string[] = ["page", "sort", "view"],
): string {
  if (!params || Object.keys(params).length === 0) {
    return basePath
  }

  // Filter out excluded parameters and empty values
  const filteredParams = Object.entries(params).filter(
    ([key, value]) =>
      !excludeParams.includes(key) &&
      value !== undefined &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true),
  )

  if (filteredParams.length === 0) {
    return basePath
  }

  // Build query string
  const queryString = filteredParams
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&")
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    })
    .join("&")

  return `${basePath}?${queryString}`
}

/**
 * Generates a full canonical URL including the domain
 */
export function getFullCanonicalUrl(
  basePath: string,
  params?: Record<string, string | string[] | undefined>,
  excludeParams?: string[],
): string {
  const baseUrl = getBaseUrl()
  const canonicalPath = getCanonicalPath(basePath, params, excludeParams)
  return `${baseUrl}${canonicalPath}`
}
