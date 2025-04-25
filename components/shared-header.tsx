"use client"

import { Calendar, MessageSquare, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function SharedHeader() {
  return (
    <div className="flex items-center gap-4 ml-auto">
      <Link href="/calendar">
        <Button variant="ghost" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
      </Link>

      <Link href="/messages">
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
        </Button>
      </Link>

      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">2</Badge>
        </Button>
      </Link>
    </div>
  )
}
