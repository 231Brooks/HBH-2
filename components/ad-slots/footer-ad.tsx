import { AdSlot } from "./ad-slot"

export function FooterAd() {
  return (
    <div className="w-full py-4 bg-slate-50 mt-8">
      <div className="container">
        {/* FOOTER AD SLOT */}
        <AdSlot id="footer-main" className="max-h-28" height={100} />
      </div>
    </div>
  )
}
