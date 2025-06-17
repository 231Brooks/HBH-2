'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPI {
  id: string
  name: string
  currentValue: number
  targetValue: number
  unit: string
  status: 'on-track' | 'at-risk' | 'exceeded'
  trend: 'up' | 'down' | 'stable'
  category: string
}

const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Monthly Sales',
    currentValue: 15,
    targetValue: 20,
    unit: 'deals',
    status: 'on-track',
    trend: 'up',
    category: 'Sales'
  },
  {
    id: '2',
    name: 'Revenue',
    currentValue: 125000,
    targetValue: 150000,
    unit: 'dollars',
    status: 'on-track',
    trend: 'up',
    category: 'Financial'
  },
  {
    id: '3',
    name: 'Client Satisfaction',
    currentValue: 4.8,
    targetValue: 4.5,
    unit: 'rating',
    status: 'exceeded',
    trend: 'stable',
    category: 'Quality'
  }
]

export function KPIList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return 'bg-green-100 text-green-800'
      case 'on-track':
        return 'bg-blue-100 text-blue-800'
      case 'at-risk':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === 'dollars') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return `${value} ${unit}`
  }

  return (
    <div className="space-y-4">
      {mockKPIs.map((kpi) => {
        const progress = (kpi.currentValue / kpi.targetValue) * 100
        
        return (
          <Card key={kpi.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{kpi.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getTrendIcon(kpi.trend)}
                  <Badge className={getStatusColor(kpi.status)}>
                    {kpi.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current: {formatValue(kpi.currentValue, kpi.unit)}</span>
                  <span>Target: {formatValue(kpi.targetValue, kpi.unit)}</span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Category: {kpi.category}</span>
                  <span>{Math.round(progress)}% of target</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
