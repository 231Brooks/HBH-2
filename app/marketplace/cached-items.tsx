"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { getCachedData, cacheData } from "@/lib/redis"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Create a singleton Supabase client for the browser
const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type MarketplaceItem = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  createdAt: string
}

export function CachedMarketplaceItems() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usingCache, setUsingCache] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async (useCache = true) => {
    setLoading(true)
    setError(null)

    try {
      // Try to get from cache first if useCache is true
      if (useCache) {
        const cachedItems = await getCachedData<MarketplaceItem[]>("marketplace_items")
        if (cachedItems) {
          setItems(cachedItems)
          setUsingCache(true)
          setLoading(false)
          return
        }
      }

      // If no cache or useCache is false, fetch from Supabase
      const { data, error } = await supabase
        .from("MarketplaceItem")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(10)

      if (error) throw error

      // Transform data to match our type
      const formattedItems = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.image || "/diverse-property-showcase.png",
        category: item.category,
        createdAt: item.createdAt,
      }))

      // Cache the results for 5 minutes
      await cacheData("marketplace_items", formattedItems, 300)

      setItems(formattedItems)
      setUsingCache(false)
    } catch (err: any) {
      console.error("Error fetching marketplace items:", err)
      setError(err.message || "Failed to fetch marketplace items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Marketplace Items</span>
          {usingCache && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Cached</span>}
        </CardTitle>
        <CardDescription>Demonstrating Supabase + Redis integration</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground py-4">No marketplace items found</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => fetchItems(false)}>
                Refresh from Database
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchItems(true)}>
                Use Cache if Available
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
