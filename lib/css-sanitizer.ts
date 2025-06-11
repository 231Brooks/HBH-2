/**
 * CSS Sanitization Library
 * Validates and sanitizes CSS to prevent security vulnerabilities
 */

export interface CSSSanitizerOptions {
  maxSize?: number
  timeout?: number
  allowImports?: boolean
  allowFontFace?: boolean
  allowKeyframes?: boolean
  allowCustomProperties?: boolean
  allowedDomains?: string[]
  strictValidation?: boolean
}

const DEFAULT_OPTIONS: CSSSanitizerOptions = {
  maxSize: 50000, // 50KB
  timeout: 5000, // 5 seconds
  allowImports: false,
  allowFontFace: true,
  allowKeyframes: true,
  allowCustomProperties: true,
  allowedDomains: [],
  strictValidation: false,
}

/**
 * Validates CSS for potentially harmful patterns
 */
export function validateCSS(css: string, options: CSSSanitizerOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const reasons: string[] = []

  // Check size
  if (css.length > opts.maxSize!) {
    reasons.push(`CSS exceeds maximum size of ${opts.maxSize} bytes`)
  }

  // Check for harmful patterns
  if (css.includes("javascript:")) {
    reasons.push("Contains javascript: URL")
  }

  if (css.includes("behavior:") || css.includes("behavior=")) {
    reasons.push("Contains behavior property")
  }

  if (css.includes("-moz-binding")) {
    reasons.push("Contains -moz-binding property")
  }

  if (!opts.allowImports && /@import/i.test(css)) {
    reasons.push("Contains @import which is not allowed")
  }

  // Check for potential CSS injection
  if (/<\/?[a-z][\s\S]*>/i.test(css)) {
    reasons.push("Contains HTML tags")
  }

  // Check for expression()
  if (/expression\s*\(/i.test(css)) {
    reasons.push("Contains expression() function")
  }

  // Check for URLs to non-allowed domains
  if (opts.allowedDomains && opts.allowedDomains.length > 0) {
    const urlRegex = /url\s*$$\s*['"]?(https?:\/\/([^'")\s]+))['"]?\s*$$/gi
    let match
    while ((match = urlRegex.exec(css)) !== null) {
      const url = match[1]
      const domain = match[2].split("/")[0]

      if (!opts.allowedDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`))) {
        reasons.push(`URL references non-allowed domain: ${domain}`)
      }
    }
  }

  return {
    isValid: reasons.length === 0,
    reasons,
  }
}

/**
 * Sanitizes CSS by removing or neutralizing harmful patterns
 */
export function sanitizeCSS(css: string, options: CSSSanitizerOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Truncate if too large
  if (css.length > opts.maxSize!) {
    css = css.substring(0, opts.maxSize!)
  }

  // Remove or neutralize harmful patterns
  css = css
    // Remove javascript: URLs
    .replace(/javascript\s*:/gi, "/* harmful protocol removed */")

    // Remove behavior property
    .replace(/behavior\s*:/gi, "/* behavior property not allowed */")

    // Remove -moz-binding
    .replace(/-moz-binding\s*:/gi, "/* removed risky property */")

    // Remove expression()
    .replace(/expression\s*\(/gi, "/* expression not allowed */")

    // Handle @import
    .replace(/@import\s+url\s*$$[^)]+$$\s*;?/gi, opts.allowImports ? "$&" : "/* @import not allowed */")

    // Remove HTML tags
    .replace(/<\/?[a-z][\s\S]*>/gi, "/* HTML removed */")

  // Handle URLs to non-allowed domains
  if (opts.allowedDomains && opts.allowedDomains.length > 0) {
    const urlRegex = /url\s*$$\s*['"]?(https?:\/\/([^'")\s]+))['"]?\s*$$/gi
    css = css.replace(urlRegex, (match, url, domain) => {
      domain = domain.split("/")[0]
      if (opts.allowedDomains!.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`))) {
        return match // Keep allowed domains
      }
      return "url(/* domain not allowed */)"
    })
  }

  return css
}

/**
 * Processes CSS with a timeout to prevent hanging
 */
export async function processCSSWithTimeout<T>(
  css: string,
  processor: (css: string) => Promise<T>,
  options: CSSSanitizerOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Create a promise that rejects after the timeout
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`CSS processing timed out after ${opts.timeout}ms`))
    }, opts.timeout)
  })

  // Create the processing promise
  const processingPromise = processor(css)

  // Race the promises
  return Promise.race([processingPromise, timeoutPromise])
}
