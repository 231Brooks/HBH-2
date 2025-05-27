import { headers } from "next/headers"

/**
 * Gets the CSP nonce from request headers
 * This is used to allow specific inline scripts in CSP
 */
export function getCspNonce(): string {
  const headersList = headers()
  return headersList.get("x-nonce") || ""
}

/**
 * Applies the nonce to a script tag
 * Usage: <script {...nonce()}>{`console.log('Hello world')`}</script>
 */
export function nonce() {
  const cspNonce = getCspNonce()
  return {
    nonce: cspNonce,
  }
}
