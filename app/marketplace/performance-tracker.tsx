"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PerformanceMetrics {
  totalLoadTime: number
  serverResponseTime: number
  renderTime: number
  filterApplyTime: number | null
}

export function PerformanceTracker() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [previousMetrics, setPreviousMetrics] = useState<PerformanceMetrics | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Get performance metrics
    const calculateMetrics = () => {
      const perfEntries = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const paintEntries = performance.getEntriesByType("paint")
      const firstPaint = paintEntries.find((entry) => entry.name === "first-paint")?.startTime || 0

      const metrics: PerformanceMetrics = {
        totalLoadTime: perfEntries.loadEventEnd - perfEntries.fetchStart,
        serverResponseTime: perfEntries.responseEnd - perfEntries.requestStart,
        renderTime: perfEntries.loadEventEnd - perfEntries.responseEnd,
        filterApplyTime: null,
      }

      return metrics
    }

    // Calculate initial metrics
    const initialMetrics = calculateMetrics()
    setMetrics(initialMetrics)

    // Listen for custom filter apply events
    const handleFilterApply = (e: CustomEvent) => {
      const startTime = e.detail.startTime
      const endTime = performance.now()

      setMetrics((prev) => {
        if (!prev) return null

        // Store previous metrics for comparison
        setPreviousMetrics(prev)

        return {
          ...prev,
          filterApplyTime: endTime - startTime,
        }
      })
    }

    // Add event listener for filter apply
    window.addEventListener("filterApplied" as any, handleFilterApply as EventListener)

    return () => {
      window.removeEventListener("filterApplied" as any, handleFilterApply as EventListener)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setVisible(!visible)} className="bg-primary text-white p-2 rounded-full shadow-lg mb-2">
        {visible ? "Hide" : "Show"} Metrics
      </button>

      {visible && metrics && (
        <Card className="w-80 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="flex justify-between">
              <span>Total Load Time:</span>
              <span className="font-mono">{metrics.totalLoadTime.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Server Response Time:</span>
              <span className="font-mono">{metrics.serverResponseTime.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Render Time:</span>
              <span className="font-mono">{metrics.renderTime.toFixed(2)}ms</span>
            </div>

            {metrics.filterApplyTime !== null && (
              <div className="flex justify-between">
                <span>Filter Apply Time:</span>
                <span className="font-mono">{metrics.filterApplyTime.toFixed(2)}ms</span>
              </div>
            )}

            {previousMetrics && metrics.filterApplyTime !== null && (
              <div className="mt-2 pt-2 border-t">
                <div className="text-xs font-medium mb-1">Comparison with Previous</div>
                <div className="flex justify-between">
                  <span>Filter Time Diff:</span>
                  <span
                    className={`font-mono ${metrics.filterApplyTime < (previousMetrics.filterApplyTime || 0) ? "text-green-600" : "text-red-600"}`}
                  >
                    {previousMetrics.filterApplyTime
                      ? `${(((metrics.filterApplyTime - previousMetrics.filterApplyTime) / previousMetrics.filterApplyTime) * 100).toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
