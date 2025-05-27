/**
 * Ad Manager Utility
 *
 * This utility helps manage ad slots across the website.
 * It provides functions to register, fill, and track ad slots.
 */

interface AdConfig {
  id: string
  content: string | HTMLElement
  trackingId?: string
}

class AdManager {
  private ads: Map<string, AdConfig> = new Map()

  /**
   * Register an ad configuration
   */
  registerAd(config: AdConfig): void {
    this.ads.set(config.id, config)
  }

  /**
   * Fill an ad slot with content
   */
  fillAdSlot(slotId: string): void {
    if (typeof window === "undefined") return

    const adConfig = this.ads.get(slotId)
    if (!adConfig) return

    const adSlot = document.getElementById(`ad-slot-${slotId}`)
    if (!adSlot) return

    // Clear existing content
    adSlot.innerHTML = ""

    // Add new content
    if (typeof adConfig.content === "string") {
      adSlot.innerHTML = adConfig.content
    } else {
      adSlot.appendChild(adConfig.content)
    }

    // Track impression if tracking ID is provided
    if (adConfig.trackingId) {
      this.trackImpression(adConfig.trackingId)
    }
  }

  /**
   * Fill all registered ad slots
   */
  fillAllAdSlots(): void {
    this.ads.forEach((_, slotId) => {
      this.fillAdSlot(slotId)
    })
  }

  /**
   * Track ad impression
   */
  private trackImpression(trackingId: string): void {
    // Implementation would depend on your analytics setup
    console.log(`Ad impression tracked: ${trackingId}`)

    // Example implementation with Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "ad_impression", {
        ad_tracking_id: trackingId,
      })
    }
  }

  /**
   * Track ad click
   */
  trackClick(trackingId: string): void {
    // Implementation would depend on your analytics setup
    console.log(`Ad click tracked: ${trackingId}`)

    // Example implementation with Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "ad_click", {
        ad_tracking_id: trackingId,
      })
    }
  }
}

// Export singleton instance
export const adManager = new AdManager()
