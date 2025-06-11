import { AdSlot } from "./ad-slot"

interface SidebarAdProps {
  position?: "top" | "middle" | "bottom"
}

export function SidebarAd({ position = "top" }: SidebarAdProps) {
  return (
    <div className="w-full mb-6">
      {/* SIDEBAR AD SLOT */}
      <AdSlot
        id={`sidebar-${position}`}
        className="max-h-[600px]"
        height={position === "top" ? 250 : position === "middle" ? 300 : 250}
      />
    </div>
  )
}
