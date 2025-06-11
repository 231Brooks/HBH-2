"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname

      // Send to your analytics service
      trackPageView(url)
    }
  }, [pathname, searchParams])

  function trackPageView(url: string) {
    // Replace with your analytics tracking code
    if (typeof window !== "undefined" && window.va) {
      window.va("send", "pageview", { path: url })
    }
  }

  return (
    <>
      {/* Vercel Analytics */}
      <Script strategy="afterInteractive" src="/_vercel/insights/script.js" />

      {/* You can add other analytics scripts here */}
    </>
  )
}
