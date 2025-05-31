"use client"

import { useState } from "react"
import Image from "next/image"

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Modern Family Home",
    address: "123 Main Street, Phoenix, AZ",
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    type: "sale",
    image: "/placeholder.svg?height=300&width=400&text=Property+1",
  },
  {
    id: "2",
    title: "Downtown Condo",
    address: "456 Oak Avenue, Scottsdale, AZ",
    price: 750000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "sale",
    image: "/placeholder.svg?height=300&width=400&text=Property+2",
  },
  {
    id: "3",
    title: "Investment Property",
    address: "789 Pine Road, Tempe, AZ",
    price: 350000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "auction",
    image: "/placeholder.svg?height=300&width=400&text=Property+3",
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || property.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Marketplace</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Properties</option>
            <option value="sale">For Sale</option>
            <option value="auction">Auction</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function PropertyCard({ property }: { property: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={property.image || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              property.type === "auction" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
            }`}
          >
            {property.type === "auction" ? "Auction" : "For Sale"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.address}</p>
        <p className="text-2xl font-bold text-blue-600 mb-3">${property.price.toLocaleString()}</p>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{property.beds} beds</span>
          <span>{property.baths} baths</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}
