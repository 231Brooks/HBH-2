/**
 * Utility functions for safe CSS processing
 */

import postcss from "postcss"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

/**
 * Process CSS with a timeout to prevent ReDoS attacks
 * @param css The CSS string to process
 * @param timeoutMs Timeout in milliseconds
 * @returns Processed CSS
 */
export async function processCssWithTimeout(css: string, timeoutMs = 5000): Promise<string> {
  // Create a promise that resolves with the processed CSS
  const processingPromise = postcss([tailwindcss, autoprefixer])
    .process(css, {
      from: undefined,
    })
    .then((result) => result.css)

  // Create a timeout promise
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("CSS processing timed out")), timeoutMs)
  })

  // Race the promises
  try {
    return await Promise.race([processingPromise, timeoutPromise])
  } catch (error) {
    console.error("Error processing CSS:", error)
    // Return the original CSS if processing fails
    return css
  }
}

/**
 * Validate CSS to ensure it doesn't contain potentially malicious patterns
 * @param css The CSS string to validate
 * @returns Whether the CSS is safe
 */
export function validateCss(css: string): boolean {
  // Check for extremely nested selectors (potential ReDoS vector)
  const nestedSelectorRegex = /([^{]*\{){10,}/
  if (nestedSelectorRegex.test(css)) {
    return false
  }

  // Check for extremely long attribute selectors
  const longAttrSelectorRegex = /\[\w+([~|^$*]?=["'][^\]"']{1000,}["']\])/
  if (longAttrSelectorRegex.test(css)) {
    return false
  }

  return true
}
