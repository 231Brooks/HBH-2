"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Gavel, Building, Home, Clock, ArrowUpRight, MessageSquare, Heart } from "lucide-react"
import MarketplaceClient from "./marketplace-client"
import { Skeleton } from "@/components/ui/skeleton"
import { QuickContactButton } from "@/components/contact-dialog"

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceSkeleton />}>
      <MarketplaceClient />
    </Suspense>
  )
}

function MarketplaceSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-24 w-full mb-8" />

      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
      </div>
    </div>
  )
}


