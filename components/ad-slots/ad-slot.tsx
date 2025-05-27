import type React from "react"
import { cn } from "@/lib/utils"

interface AdSlotProps {
  id: string
  className?: string
  width?: number | string
  height?: number | string
  children?: React.ReactNode
}

export function AdSlot({ id, className, width = "100%", height = "auto", children }: AdSlotProps) {
  return (
    <div
      id={`ad-slot-${id}`}
      className={cn(
        "ad-slot border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center",
        className,
      )}
      style={{ width, height }}
      data-ad-slot={id}
    >
      {children || (
        <div className="text-sm text-slate-400 p-4 text-center">
          <p>Advertisement</p>
          <p className="text-xs">({id})</p>
        </div>
      )}
    </div>
  )
}
