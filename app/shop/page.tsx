import Link from "next/link"
import { Filter, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Shop</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              My Orders
            </Button>
            <Button size="sm">Cart (3)</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="services" className="mr-2" defaultChecked />
                    <label htmlFor="services" className="text-sm font-medium">
                      Services
                    </label>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center">
                      <input type="checkbox" id="design-services" className="mr-2" />
                      <label htmlFor="design-services" className="text-sm">
                        Design Services
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="development" className="mr-2" />
                      <label htmlFor="development" className="text-sm">
                        Development
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="marketing" className="mr-2" />
                      <label htmlFor="marketing" className="text-sm">
                        Marketing
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="freelance-jobs" className="mr-2" />
                      <label htmlFor="freelance-jobs" className="text-sm">
                        Remote Freelance Jobs
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="products" className="mr-2" defaultChecked />
                    <label htmlFor="products" className="text-sm font-medium">
                      Products
                    </label>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center">
                      <input type="checkbox" id="apparel" className="mr-2" />
                      <label htmlFor="apparel" className="text-sm">
                        T-Shirts & Apparel
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="mugs" className="mr-2" />
                      <label htmlFor="mugs" className="text-sm">
                        Mugs & Drinkware
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="wall-art" className="mr-2" />
                      <label htmlFor="wall-art" className="text-sm">
                        Wall Art & Posters
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="accessories" className="mr-2" />
                      <label htmlFor="accessories" className="text-sm">
                        Accessories
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Price Range</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-1" className="mr-2" />
                    <label htmlFor="price-1" className="text-sm">
                      Under $25
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-2" className="mr-2" />
                    <label htmlFor="price-2" className="text-sm">
                      $25 - $50
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-3" className="mr-2" />
                    <label htmlFor="price-3" className="text-sm">
                      $50 - $100
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-4" className="mr-2" />
                    <label htmlFor="price-4" className="text-sm">
                      Over $100
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Ratings</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-4" className="mr-2" />
                    <label htmlFor="rating-4" className="text-sm">
                      4 Stars & Up
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-3" className="mr-2" />
                    <label htmlFor="rating-3" className="text-sm">
                      3 Stars & Up
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="rating-2" className="mr-2" />
                    <label htmlFor="rating-2" className="text-sm">
                      2 Stars & Up
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products & services..."
                      className="pl-8 w-full md:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
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
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="freelance">Remote Jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Services</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                    <ServiceCard
                      id="1"
                      name="Website Design"
                      price={299.99}
                      category="Design Services"
                      rating={4.8}
                      reviews={36}
                      description="Professional website design services for your business or personal site."
                    />
                    <ServiceCard
                      id="2"
                      name="Logo Creation"
                      price={149.99}
                      category="Design Services"
                      rating={4.9}
                      reviews={42}
                      description="Custom logo design to establish your brand identity."
                    />
                    <ServiceCard
                      id="3"
                      name="Social Media Management"
                      price={199.99}
                      category="Marketing"
                      rating={4.7}
                      reviews={28}
                      description="Complete social media management for your business."
                    />
                    <ServiceCard
                      id="4"
                      name="Content Writing"
                      price={99.99}
                      category="Marketing"
                      rating={4.6}
                      reviews={31}
                      description="Professional content writing for blogs, websites, and marketing materials."
                    />
                  </div>

                  <h2 className="text-xl font-semibold mb-4">Products</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <ProductCard
                      id="1"
                      name="Minimalist Logo T-Shirt"
                      price={29.99}
                      category="T-Shirts & Apparel"
                      rating={4.5}
                      reviews={24}
                    />
                    <ProductCard
                      id="2"
                      name="Custom Coffee Mug"
                      price={19.99}
                      category="Mugs & Drinkware"
                      rating={4.8}
                      reviews={36}
                    />
                    <ProductCard
                      id="3"
                      name="Geometric Wall Art Print"
                      price={39.99}
                      category="Wall Art & Posters"
                      rating={4.7}
                      reviews={42}
                    />
                    <ProductCard
                      id="4"
                      name="Eco-Friendly Water Bottle"
                      price={24.99}
                      category="Accessories"
                      rating={4.3}
                      reviews={31}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="services" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <ServiceCard
                      id="1"
                      name="Website Design"
                      price={299.99}
                      category="Design Services"
                      rating={4.8}
                      reviews={36}
                      description="Professional website design services for your business or personal site."
                    />
                    <ServiceCard
                      id="2"
                      name="Logo Creation"
                      price={149.99}
                      category="Design Services"
                      rating={4.9}
                      reviews={42}
                      description="Custom logo design to establish your brand identity."
                    />
                    <ServiceCard
                      id="3"
                      name="Social Media Management"
                      price={199.99}
                      category="Marketing"
                      rating={4.7}
                      reviews={28}
                      description="Complete social media management for your business."
                    />
                    <ServiceCard
                      id="4"
                      name="Content Writing"
                      price={99.99}
                      category="Marketing"
                      rating={4.6}
                      reviews={31}
                      description="Professional content writing for blogs, websites, and marketing materials."
                    />
                    <ServiceCard
                      id="5"
                      name="App Development"
                      price={499.99}
                      category="Development"
                      rating={4.9}
                      reviews={19}
                      description="Custom mobile app development for iOS and Android platforms."
                    />
                    <ServiceCard
                      id="6"
                      name="SEO Optimization"
                      price={249.99}
                      category="Marketing"
                      rating={4.7}
                      reviews={23}
                      description="Search engine optimization to improve your website's visibility."
                    />
                  </div>
                </TabsContent>
                <TabsContent value="products" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <ProductCard
                      id="1"
                      name="Minimalist Logo T-Shirt"
                      price={29.99}
                      category="T-Shirts & Apparel"
                      rating={4.5}
                      reviews={24}
                    />
                    <ProductCard
                      id="2"
                      name="Custom Coffee Mug"
                      price={19.99}
                      category="Mugs & Drinkware"
                      rating={4.8}
                      reviews={36}
                    />
                    <ProductCard
                      id="3"
                      name="Geometric Wall Art Print"
                      price={39.99}
                      category="Wall Art & Posters"
                      rating={4.7}
                      reviews={42}
                    />
                    <ProductCard
                      id="4"
                      name="Eco-Friendly Water Bottle"
                      price={24.99}
                      category="Mugs & Drinkware"
                      rating={4.3}
                      reviews={31}
                    />
                    <ProductCard
                      id="5"
                      name="Laptop Sticker Pack"
                      price={12.99}
                      category="Accessories"
                      rating={4.4}
                      reviews={56}
                    />
                    <ProductCard
                      id="6"
                      name="Decorative Throw Pillow"
                      price={34.99}
                      category="Home & Living"
                      rating={4.6}
                      reviews={29}
                    />
                    <ProductCard
                      id="7"
                      name="Minimalist Watch"
                      price={79.99}
                      category="Accessories"
                      rating={4.9}
                      reviews={47}
                    />
                    <ProductCard
                      id="8"
                      name="Abstract Art Phone Case"
                      price={24.99}
                      category="Accessories"
                      rating={4.2}
                      reviews={18}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="freelance" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FreelanceJobCard
                      id="1"
                      title="Web Developer Needed"
                      rate="$30-50/hr"
                      duration="3 months"
                      category="Development"
                      skills={["React", "Node.js", "MongoDB"]}
                      description="Looking for an experienced web developer to build a community resource platform."
                    />
                    <FreelanceJobCard
                      id="2"
                      title="Graphic Designer for Branding"
                      rate="$25-40/hr"
                      duration="1 month"
                      category="Design Services"
                      skills={["Adobe Creative Suite", "Branding", "Typography"]}
                      description="Need a talented graphic designer to create branding materials for our resource center."
                    />
                    <FreelanceJobCard
                      id="3"
                      title="Content Writer for Blog"
                      rate="$20-35/hr"
                      duration="Ongoing"
                      category="Marketing"
                      skills={["Content Writing", "SEO", "Research"]}
                      description="Seeking a content writer to produce regular blog posts about community resources and events."
                    />
                    <FreelanceJobCard
                      id="4"
                      title="Social Media Manager"
                      rate="$25-40/hr"
                      duration="6 months"
                      category="Marketing"
                      skills={["Social Media", "Content Creation", "Analytics"]}
                      description="Looking for a social media manager to grow our online presence and engage with our community."
                    />
                    <FreelanceJobCard
                      id="5"
                      title="Mobile App Developer"
                      rate="$40-60/hr"
                      duration="4 months"
                      category="Development"
                      skills={["React Native", "iOS", "Android"]}
                      description="Need a mobile app developer to create a community resource finder app."
                    />
                    <FreelanceJobCard
                      id="6"
                      title="Video Editor for Promotional Content"
                      rate="$30-45/hr"
                      duration="2 months"
                      category="Design Services"
                      skills={["Video Editing", "After Effects", "Premiere Pro"]}
                      description="Seeking a video editor to create promotional content for our resource centers."
                    />
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

function ProductCard({ id, name, price, category, rating, reviews }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted flex items-center justify-center">
        <div className="text-4xl text-muted-foreground">{name.charAt(0)}</div>
        <Badge className="absolute top-2 right-2">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <Link href={`/shop/product/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg">{name}</h3>
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
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold">${price.toFixed(2)}</div>
        <Button size="sm">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

function ServiceCard({ id, name, price, category, rating, reviews, description }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted flex items-center justify-center">
        <div className="text-4xl text-muted-foreground">{name.charAt(0)}</div>
        <Badge className="absolute top-2 right-2">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <Link href={`/shop/service/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg">{name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold">Starting at ${price.toFixed(2)}</div>
        <Button size="sm">Book Now</Button>
      </CardFooter>
    </Card>
  )
}

function FreelanceJobCard({ id, title, rate, duration, category, skills, description }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Badge className="mb-3">{category}</Badge>
        <Link href={`/shop/freelance/${id}`} className="hover:underline">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Rate:</span>
              <span className="font-medium ml-1">{rate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium ml-1">{duration}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20 flex justify-end">
        <Button size="sm">Apply Now</Button>
      </CardFooter>
    </Card>
  )
}
