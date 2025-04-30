import PropertyMap from "@/components/property-map"

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <p className="mb-6">This page is under construction.</p>

      {/* Add a sample property map with no properties */}
      <PropertyMap properties={[]} />
    </div>
  )
}
