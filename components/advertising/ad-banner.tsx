"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, Star } from "lucide-react"
import { AdLocation } from "@prisma/client"
import { getAdsByLocation, recordAdImpression, recordAdClick } from "@/app/actions/advertising-actions"

interface AdData {
  id: string
  placement: {
    advertisement: {
      id: string
      title: string
      description?: string
      imageUrl?: string
      linkUrl?: string
      advertiser: {
        id: string
        name: string
      }
      service?: {
        id: string
        name: string
        category: string
      }
    }
  }
}

interface AdBannerProps {
  location: AdLocation
  className?: string
  maxAds?: number
  showCloseButton?: boolean
}

export function AdBanner({ location, className = "", maxAds = 5, showCloseButton = true }: AdBannerProps) {
  const [ads, setAds] = useState<AdData[]>([])
  const [loading, setLoading] = useState(true)
  const [hiddenAds, setHiddenAds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadAds()
  }, [location])

  const loadAds = async () => {
    try {
      const result = await getAdsByLocation(location)
      if (result.success) {
        setAds(result.ads || [])
        // Record impressions for all loaded ads
        result.ads?.forEach(ad => {
          recordAdImpression(ad.placement.advertisement.id, location)
        })
      }
    } catch (error) {
      console.error("Failed to load ads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdClick = async (ad: AdData) => {
    // Record click
    await recordAdClick(ad.placement.advertisement.id, location)
    
    // Open link if provided
    if (ad.placement.advertisement.linkUrl) {
      window.open(ad.placement.advertisement.linkUrl, '_blank')
    }
  }

  const handleHideAd = (adId: string) => {
    setHiddenAds(prev => new Set([...prev, adId]))
  }

  const visibleAds = ads.filter(ad => !hiddenAds.has(ad.placement.advertisement.id)).slice(0, maxAds)

  if (loading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg flex-1"></div>
        ))}
      </div>
    )
  }

  if (visibleAds.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Sponsored</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {visibleAds.map((ad) => (
          <AdCard
            key={ad.placement.advertisement.id}
            ad={ad}
            onAdClick={handleAdClick}
            onHideAd={showCloseButton ? handleHideAd : undefined}
          />
        ))}
      </div>
    </div>
  )
}

interface AdCardProps {
  ad: AdData
  onAdClick: (ad: AdData) => void
  onHideAd?: (adId: string) => void
}

function AdCard({ ad, onAdClick, onHideAd }: AdCardProps) {
  const advertisement = ad.placement.advertisement

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {onHideAd && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation()
            onHideAd(advertisement.id)
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      <CardContent className="p-3" onClick={() => onAdClick(ad)}>
        {advertisement.imageUrl && (
          <div className="relative h-16 mb-2 rounded overflow-hidden">
            <Image
              src={advertisement.imageUrl}
              alt={advertisement.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium line-clamp-1">{advertisement.title}</h4>
          
          {advertisement.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {advertisement.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              by {advertisement.advertiser.name}
            </span>
            
            {advertisement.service && (
              <Badge variant="outline" className="text-xs">
                {advertisement.service.category.replace('_', ' ')}
              </Badge>
            )}
          </div>
          
          {advertisement.linkUrl && (
            <div className="flex items-center text-xs text-primary">
              <ExternalLink className="h-3 w-3 mr-1" />
              Learn More
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized components for different locations
export function BottomGlobalAds({ className }: { className?: string }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2 ${className}`}>
      <AdBanner location="BOTTOM_GLOBAL" maxAds={5} />
    </div>
  )
}

export function FrontPageAds({ className }: { className?: string }) {
  return (
    <div className={className}>
      <AdBanner location="FRONTPAGE" maxAds={3} />
    </div>
  )
}

export function ServicesAds({ className }: { className?: string }) {
  return (
    <div className={className}>
      <AdBanner location="SERVICES" maxAds={4} />
    </div>
  )
}

export function MarketplaceAds({ className }: { className?: string }) {
  return (
    <div className={className}>
      <AdBanner location="MARKETPLACE" maxAds={4} />
    </div>
  )
}

// Inline ad component for inserting between content
export function InlineAd({ location, className }: { location: AdLocation; className?: string }) {
  const [ad, setAd] = useState<AdData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAd()
  }, [location])

  const loadAd = async () => {
    try {
      const result = await getAdsByLocation(location)
      if (result.success && result.ads && result.ads.length > 0) {
        const randomAd = result.ads[Math.floor(Math.random() * result.ads.length)]
        setAd(randomAd)
        // Record impression
        recordAdImpression(randomAd.placement.advertisement.id, location)
      }
    } catch (error) {
      console.error("Failed to load inline ad:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdClick = async () => {
    if (!ad) return
    
    // Record click
    await recordAdClick(ad.placement.advertisement.id, location)
    
    // Open link if provided
    if (ad.placement.advertisement.linkUrl) {
      window.open(ad.placement.advertisement.linkUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className={`h-32 bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
    )
  }

  if (!ad) {
    return null
  }

  const advertisement = ad.placement.advertisement

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardContent className="p-4" onClick={handleAdClick}>
        <div className="flex items-center gap-3">
          {advertisement.imageUrl && (
            <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
              <Image
                src={advertisement.imageUrl}
                alt={advertisement.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{advertisement.title}</h4>
              <Badge variant="outline" className="text-xs">Sponsored</Badge>
            </div>
            
            {advertisement.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {advertisement.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>by {advertisement.advertiser.name}</span>
              {advertisement.service && (
                <span>{advertisement.service.category.replace('_', ' ')}</span>
              )}
            </div>
          </div>
          
          {advertisement.linkUrl && (
            <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
