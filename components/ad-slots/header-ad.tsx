import { AdSlot } from "./ad-slot"

export function HeaderAd() {
  return (
    <div className="w-full py-2 bg-slate-50">
      <div className="container">
        {/* HEADER AD SLOT */}
        <AdSlot id="header-main" className="max-h-24" height={90} />
      </div>
    </div>
  )
}
