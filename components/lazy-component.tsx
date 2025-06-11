"use client"

import { Suspense, lazy, type ComponentType, type ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  props?: Record<string, any>
  fallback?: ReactNode
}

export function LazyComponent({
  component,
  props = {},
  fallback = <Skeleton className="w-full h-32" />,
}: LazyComponentProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Usage example:
// <LazyComponent
//   component={() => import('@/components/heavy-component')}
//   props={{ data: someData }}
// />
