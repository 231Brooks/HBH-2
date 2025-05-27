import { AdSlot } from "./ad-slot"

interface InFeedAdProps {
  index: number
}

export function InFeedAd({ index }: InFeedAdProps) {
  return (
    <div className="w-full my-6">
      {/* IN-FEED AD SLOT */}
      <AdSlot id={`in-feed-${index}`} className="max-h-32" height={120} />
    </div>
  )
}
