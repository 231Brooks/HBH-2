"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
  // Only run on client side
  if (typeof window !== "undefined" && typeof window.L !== "undefined") {
    delete window.L.Icon.Default.prototype._getIconUrl

    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }
}

interface Property {
  id: string
  title: string
  price: number
  latitude: number
  longitude: number
  address?: string
}

interface PropertyMapProps {
  properties: Property[]
  height?: string
  center?: [number, number]
  zoom?: number
}

const PropertyMap = ({
  properties = [],
  height = "500px",
  center = [33.4484, -112.074], // Phoenix, AZ coordinates
  zoom = 10,
}: PropertyMapProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Fix Leaflet icon issue
    import("leaflet").then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    })
  }, [])

  if (!isMounted) {
    return (
      <Card>
        <CardContent className="p-4">
          <div style={{ height, width: "100%" }} className="bg-gray-100 animate-pulse flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div style={{ height, width: "100%" }}>
          {typeof window !== "undefined" && (
            <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {properties.map((property) => (
                <Marker key={property.id} position={[property.latitude, property.longitude]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm">{property.address}</p>
                      <p className="font-medium mt-1">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyMap
