"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Building, Gavel } from "lucide-react"
import Link from "next/link"

export default function PropertyMap() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  // This is a placeholder component for the map
  // In a real implementation, you would use a library like Google Maps, Mapbox, or Leaflet
  return (
    <div className="relative w-full h-full bg-slate-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Interactive property map would be displayed here</p>
      </div>

      {/* Property markers - these would be positioned on the map */}
      <div className="absolute top-1/4 left-1/4">
        <PropertyMarker
          id={1}
          type="sale"
          price="$425,000"
          isSelected={selectedProperty === 1}
          onClick={() => setSelectedProperty(1)}
        />
      </div>
      <div className="absolute top-1/3 left-1/2">
        <PropertyMarker
          id={2}
          type="sale"
          price="$750,000"
          isSelected={selectedProperty === 2}
          onClick={() => setSelectedProperty(2)}
        />
      </div>
      <div className="absolute top-2/3 left-1/3">
        <PropertyMarker
          id={3}
          type="auction"
          price="$350,000"
          isSelected={selectedProperty === 3}
          onClick={() => setSelectedProperty(3)}
        />
      </div>
      <div className="absolute top-1/2 right-1/4">
        <PropertyMarker
          id={4}
          type="sale"
          price="$1,250,000"
          isSelected={selectedProperty === 4}
          onClick={() => setSelectedProperty(4)}
        />
      </div>

      {/* Property info card that appears when a marker is selected */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">
                  {selectedProperty === 1
                    ? "Modern Family Home"
                    : selectedProperty === 2
                      ? "Downtown Condo"
                      : selectedProperty === 3
                        ? "Investment Property"
                        : "Luxury Waterfront Home"}
                </h3>
                <Badge className={`${selectedProperty === 3 ? "bg-amber-500" : "bg-primary"} text-white`}>
                  {selectedProperty === 3 ? (
                    <>
                      <Gavel className="mr-1 h-3 w-3" /> Auction
                    </>
                  ) : (
                    "For Sale"
                  )}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {selectedProperty === 1
                    ? "123 Main Street, Phoenix, AZ"
                    : selectedProperty === 2
                      ? "456 Oak Avenue, Scottsdale, AZ"
                      : selectedProperty === 3
                        ? "789 Pine Road, Tempe, AZ"
                        : "101 River Lane, Mesa, AZ"}
                </span>
              </div>
              <div className="flex gap-4 mb-3">
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">
                    {selectedProperty === 1 ? "4" : selectedProperty === 2 ? "2" : selectedProperty === 3 ? "3" : "5"}{" "}
                    Beds
                  </span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">
                    {selectedProperty === 1 ? "3" : selectedProperty === 2 ? "2" : selectedProperty === 3 ? "2" : "4.5"}{" "}
                    Baths
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold text-primary">
                  {selectedProperty === 1
                    ? "$425,000"
                    : selectedProperty === 2
                      ? "$750,000"
                      : selectedProperty === 3
                        ? "Starting Bid: $350,000"
                        : "$1,250,000"}
                </p>
                <Button size="sm" asChild>
                  <Link href={`/marketplace/${selectedProperty}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map controls would go here */}
      <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            +
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            -
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PropertyMarkerProps {
  id: number
  type: "sale" | "auction"
  price: string
  isSelected: boolean
  onClick: () => void
}

function PropertyMarker({ id, type, price, isSelected, onClick }: PropertyMarkerProps) {
  return (
    <div
      className={`cursor-pointer transform transition-transform ${isSelected ? "scale-125" : "hover:scale-110"}`}
      onClick={onClick}
    >
      <div
        className={`flex items-center justify-center rounded-full h-10 w-10 ${
          type === "auction" ? "bg-amber-500" : "bg-primary"
        } text-white shadow-md`}
      >
        {type === "auction" ? <Gavel className="h-5 w-5" /> : <Home className="h-5 w-5" />}
      </div>
      {isSelected && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-sm text-xs font-medium whitespace-nowrap">
          {price}
        </div>
      )}
    </div>
  )
}
