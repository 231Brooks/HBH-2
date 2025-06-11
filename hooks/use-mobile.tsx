"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen width is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typically md breakpoint in Tailwind
    }

    // Check on initial load
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

// Export both names for flexibility
export const useMobile = useIsMobile
