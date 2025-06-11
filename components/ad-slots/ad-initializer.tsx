"use client"

import { useEffect } from "react"
import { adManager } from "@/lib/ad-manager"

export function AdInitializer() {
  useEffect(() => {
    // Register ads
    // These would typically come from your CMS or ad server
    const sampleAds = [
      {
        id: "header-main",
        content: `
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f9ff;color:#0369a1;font-weight:500;">
            <span>Header Advertisement - 728x90</span>
          </div>
        `,
        trackingId: "header-main-001",
      },
      {
        id: "sidebar-top",
        content: `
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f9ff;color:#0369a1;font-weight:500;">
            <span>Sidebar Top Ad - 300x250</span>
          </div>
        `,
        trackingId: "sidebar-top-001",
      },
      {
        id: "in-feed-0",
        content: `
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f9ff;color:#0369a1;font-weight:500;">
            <span>In-Feed Advertisement - 728x90</span>
          </div>
        `,
        trackingId: "in-feed-001",
      },
      {
        id: "footer-main",
        content: `
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f9ff;color:#0369a1;font-weight:500;">
            <span>Footer Advertisement - 728x90</span>
          </div>
        `,
        trackingId: "footer-main-001",
      },
    ]

    // Register sample ads
    sampleAds.forEach((ad) => adManager.registerAd(ad))

    // Fill all ad slots
    adManager.fillAllAdSlots()

    // Set up a mutation observer to detect new ad slots
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const adSlots = node.querySelectorAll("[data-ad-slot]")
            adSlots.forEach((slot) => {
              if (slot instanceof HTMLElement) {
                const slotId = slot.dataset.adSlot
                if (slotId) {
                  adManager.fillAdSlot(slotId)
                }
              }
            })
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
