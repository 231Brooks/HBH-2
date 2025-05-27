"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface AdPerformanceChartProps {
  analytics: any
}

export function AdPerformanceChart({ analytics }: AdPerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !analytics) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data for the chart
    const dailyData = analytics.dailyStats || []
    const dates = [...new Set(dailyData.map((item: any) => new Date(item.date).toLocaleDateString()))]

    const impressionsData = dates.map((date) => {
      const entry = dailyData.find(
        (item: any) => new Date(item.date).toLocaleDateString() === date && item.type === "IMPRESSION",
      )
      return entry ? entry.count : 0
    })

    const clicksData = dates.map((date) => {
      const entry = dailyData.find(
        (item: any) => new Date(item.date).toLocaleDateString() === date && item.type === "CLICK",
      )
      return entry ? entry.count : 0
    })

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Impressions",
              data: impressionsData,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Clicks",
              data: clicksData,
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [analytics])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <canvas ref={chartRef} />
    </div>
  )
}
