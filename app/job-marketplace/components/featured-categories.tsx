import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Home, FileText, Camera, PenToolIcon as Tool, Briefcase, PiggyBank, Paintbrush, Truck } from "lucide-react"

export default function FeaturedCategories() {
  const categories = [
    { name: "Title Services", icon: <FileText className="h-6 w-6" />, count: 245 },
    { name: "Home Inspection", icon: <Home className="h-6 w-6" />, count: 189 },
    { name: "Photography", icon: <Camera className="h-6 w-6" />, count: 156 },
    { name: "Contractors", icon: <Tool className="h-6 w-6" />, count: 312 },
    { name: "Legal Services", icon: <Briefcase className="h-6 w-6" />, count: 98 },
    { name: "Mortgage", icon: <PiggyBank className="h-6 w-6" />, count: 124 },
    { name: "Interior Design", icon: <Paintbrush className="h-6 w-6" />, count: 87 },
    { name: "Moving Services", icon: <Truck className="h-6 w-6" />, count: 143 },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => (
          <Link href="#" key={index}>
            <Card className="h-full transition-all hover:shadow-md hover:border-slate-300">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="p-3 rounded-full bg-slate-100 mb-3">{category.icon}</div>
                <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-slate-500">{category.count} professionals</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
