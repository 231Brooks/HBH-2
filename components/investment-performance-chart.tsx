"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the chart
const data = [
  { date: "Jan", value: 2500 },
  { date: "Feb", value: 2700 },
  { date: "Mar", value: 2900 },
  { date: "Apr", value: 3100 },
  { date: "May", value: 3000 },
  { date: "Jun", value: 3200 },
  { date: "Jul", value: 3500 },
]

export function InvestmentPerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            formatter={(value) => [`$${value}`, "Portfolio Value"]}
            labelFormatter={(label) => `${label} 2023`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#3B82F6", stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
