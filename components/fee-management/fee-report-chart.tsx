"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

export function FeeReportChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Mock data for the chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const serviceFees = [1200, 1350, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200]
    const transactionFees = [800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800]

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Service Fees",
              data: serviceFees,
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 1,
            },
            {
              label: "Transaction Fees",
              data: transactionFees,
              backgroundColor: "rgba(16, 185, 129, 0.7)",
              borderColor: "rgb(16, 185, 129)",
              borderWidth: 1,
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
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                      context.parsed.y,
                    )
                  }
                  return label
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Revenue (USD)",
              },
              ticks: {
                callback: (value) => "$" + value,
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
  }, [])

  return (
    <div className="h-96">
      <canvas ref={chartRef} />
    </div>
  )
}
