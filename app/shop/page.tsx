"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-16 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-700">
              My Orders
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Cart (3)
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block space-y-6 bg-white p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="services" className="mr-2" defaultChecked />
                    <label htmlFor="services" className="text-sm font-medium text-gray-700">
                      Services
                    </label>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center">
                      <input type="checkbox" id="design-services" className="mr-2" />
                      <label htmlFor="design-services" className="text-sm text-gray-600">
                        Design Services
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="development" className="mr-2" />
                      <label htmlFor="development" className="text-sm text-gray-600">
                        Development
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="marketing" className="mr-2" />
                      <label htmlFor="marketing" className="text-sm text-gray-600">
                        Marketing
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="freelance-jobs" className="mr-2" />
                      <label htmlFor="freelance-jobs" className="text-sm text-gray-600">
                        Remote Freelance Jobs
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="products" className="mr-2" defaultChecked />
                    <label htmlFor="products" className="text-sm font-medium text-gray-700">
                      Products
                    </label>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center">
                      <input type="checkbox" id="apparel" className="mr-2" />
                      <label htmlFor="apparel" className="text-sm text-gray-600">
                        T-Shirts & Apparel
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="mugs" className="mr-2" />
                      <label htmlFor="mugs" className="text-sm text-gray-600">
                        Mugs & Drinkware
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="wall-art" className="mr-2" />
                      <label htmlFor="wall-art" className="text-sm text-gray-600">
                        Wall Art & Posters
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="accessories" className="mr-2" />
                      <label htmlFor="accessories" className="text-sm text-gray-600">
                        Accessories
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Price Range</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-1" className="mr-2" />
                    <label htmlFor="price-1" className="text-sm text-gray-600">
                      Under $25
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-2" className="mr-2" />
                    <label htmlFor="price-2" className="text-sm text-gray-600">
                      $25 - $50
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-3" className="mr-2" />
                    <label htmlFor="price-3" className="text-sm text-gray-600">
                      $50 - $100
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-4" className="mr-2" />
                    <label htmlFor="price-4" className="text-sm text-gray-600">
                      Over $100
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Ratings</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-4" className="mr-2" />
                    <label htmlFor="rating-4" className="text-sm text-gray-600">
                      4 Stars & Up
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-3" className="mr-2" />
                    <label htmlFor="rating-3" className="text-sm text-gray-600">
                      3 Stars & Up
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-2" className="mr-2" />
                    <label htmlFor="rating-2" className="text-sm text-gray-600">
                      2 Stars & Up
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search products & services..."
                      className="pl-8 w-full md:w-[300px] border-gray-200"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="md:hidden border-gray-200">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px] border-gray-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="freelance">Remote Jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Services</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {services.slice(0, 4).map((service) => (
                        <ServiceCard key={service.id} {...service} />
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Products</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="services" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {services.map((service) => (
                        <ServiceCard key={service.id} {...service} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="products" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="freelance" className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {freelanceJobs.map((job) => (
                        <FreelanceJobCard key={job.id} {...job} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Sample data
const services = [
  {
    id: "1",
    name: "Website Design",
    price: 299.99,
    category: "Design Services",
    rating: 4.8,
    reviews: 36,
    description: "Professional website design services for your business or personal site.",
  },
  {
    id: "2",
    name: "Logo Creation",
    price: 149.99,
    category: "Design Services",
    rating: 4.9,
    reviews: 42,
    description: "Custom logo design to establish your brand identity.",
  },
  {
    id: "3",
    name: "Social Media Management",
    price: 199.99,
    category: "Marketing",
    rating: 4.7,
    reviews: 28,
    description: "Complete social media management for your business.",
  },
  {
    id: "4",
    name: "Content Writing",
    price: 99.99,
    category: "Marketing",
    rating: 4.6,
    reviews: 31,
    description: "Professional content writing for blogs, websites, and marketing materials.",
  },
  {
    id: "5",
    name: "App Development",
    price: 499.99,
    category: "Development",
    rating: 4.9,
    reviews: 19,
    description: "Custom mobile app development for iOS and Android platforms.",
  },
  {
    id: "6",
    name: "SEO Optimization",
    price: 249.99,
    category: "Marketing",
    rating: 4.7,
    reviews: 23,
    description: "Search engine optimization to improve your website's visibility.",
  },
]

const products = [
  {
    id: "1",
    name: "Minimalist Logo T-Shirt",
    price: 29.99,
    category: "T-Shirts & Apparel",
    rating: 4.5,
    reviews: 24,
  },
  {
    id: "2",
    name: "Custom Coffee Mug",
    price: 19.99,
    category: "Mugs & Drinkware",
    rating: 4.8,
    reviews: 36,
  },
  {
    id: "3",
    name: "Geometric Wall Art Print",
    price: 39.99,
    category: "Wall Art & Posters",
    rating: 4.7,
    reviews: 42,
  },
  {
    id: "4",
    name: "Eco-Friendly Water Bottle",
    price: 24.99,
    category: "Mugs & Drinkware",
    rating: 4.3,
    reviews: 31,
  },
  {
    id: "5",
    name: "Laptop Sticker Pack",
    price: 12.99,
    category: "Accessories",
    rating: 4.4,
    reviews: 56,
  },
  {
    id: "6",
    name: "Decorative Throw Pillow",
    price: 34.99,
    category: "Home & Living",
    rating: 4.6,
    reviews: 29,
  },
  {
    id: "7",
    name: "Minimalist Watch",
    price: 79.99,
    category: "Accessories",
    rating: 4.9,
    reviews: 47,
  },
  {
    id: "8",
    name: "Abstract Art Phone Case",
    price: 24.99,
    category: "Accessories",
    rating: 4.2,
    reviews: 18,
  },
]

const freelanceJobs = [
  {
    id: "1",
    title: "Web Developer Needed",
    rate: "$30-50/hr",
    duration: "3 months",
    category: "Development",
    skills: ["React", "Node.js", "MongoDB"],
    description: "Looking for an experienced web developer to build a community resource platform.",
  },
  {
    id: "2",
    title: "Graphic Designer for Branding",
    rate: "$25-40/hr",
    duration: "1 month",
    category: "Design Services",
    skills: ["Adobe Creative Suite", "Branding", "Typography"],
    description: "Need a talented graphic designer to create branding materials for our resource center.",
  },
  {
    id: "3",
    title: "Content Writer for Blog",
    rate: "$20-35/hr",
    duration: "Ongoing",
    category: "Marketing",
    skills: ["Content Writing", "SEO", "Research"],
    description: "Seeking a content writer to produce regular blog posts about community resources and events.",
  },
  {
    id: "4",
    title: "Social Media Manager",
    rate: "$25-40/hr",
    duration: "6 months",
    category: "Marketing",
    skills: ["Social Media", "Content Creation", "Analytics"],
    description: "Looking for a social media manager to grow our online presence and engage with our community.",
  },
  {
    id: "5",
    title: "Mobile App Developer",
    rate: "$40-60/hr",
    duration: "4 months",
    category: "Development",
    skills: ["React Native", "iOS", "Android"],
    description: "Need a mobile app developer to create a community resource finder app.",
  },
  {
    id: "6",
    title: "Video Editor for Promotional Content",
    rate: "$30-45/hr",
    duration: "2 months",
    category: "Design Services",
    skills: ["Video Editing", "After Effects", "Premiere Pro"],
    description: "Seeking a video editor to create promotional content for our resource centers.",
  },
]

function ProductCard({ id, name, price, category, rating, reviews }) {
  return (
    <Card className="overflow-hidden border-gray-200">
      <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
        <div className="text-4xl text-gray-400">{name.charAt(0)}</div>
        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <Link href={`/shop/product/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold text-gray-900">${price.toFixed(2)}</div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

function ServiceCard({ id, name, price, category, rating, reviews, description }) {
  return (
    <Card className="overflow-hidden border-gray-200">
      <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
        <div className="text-4xl text-gray-400">{name.charAt(0)}</div>
        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <Link href={`/shop/service/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold text-gray-900">Starting at ${price.toFixed(2)}</div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}

function FreelanceJobCard({ id, title, rate, duration, category, skills, description }) {
  return (
    <Card className="overflow-hidden border-gray-200">
      <CardContent className="p-6">
        <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>
        <Link href={`/shop/freelance/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="border-gray-200 text-gray-700">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-500">Rate:</span>
              <span className="font-medium ml-1 text-gray-900">{rate}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium ml-1 text-gray-900">{duration}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 flex justify-end border-t border-gray-200">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  )
}
