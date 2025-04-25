"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"
import {
  ArrowUpRight,
  ArrowDownRight,
  Info,
  TrendingUp,
  TrendingDown,
  Building,
  Landmark,
  BookOpen,
  HeadphonesIcon,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function InvestPage() {
  const [activeTab, setActiveTab] = useState("marketplace")
  const [investmentType, setInvestmentType] = useState("company")

  // Mock company investment data
  const companyInvestments = [
    {
      id: 1,
      name: "5Sense Tech Fund",
      price: "$120.50",
      change: "+5.2%",
      description: "A diversified fund focusing on emerging technology companies.",
      performance: "High",
      risk: "Medium",
      purchased: false,
      type: "company",
    },
    {
      id: 2,
      name: "5Sense Green Energy",
      price: "$85.75",
      change: "+2.8%",
      description: "Investment in sustainable and renewable energy solutions.",
      performance: "Medium",
      risk: "Low",
      purchased: true,
      type: "company",
    },
    {
      id: 3,
      name: "5Sense Real Estate",
      price: "$210.25",
      change: "-1.2%",
      description: "Commercial and residential real estate investment trust.",
      performance: "Medium",
      risk: "Medium",
      purchased: true,
      type: "company",
    },
  ]

  // Mock resource center investment data
  const resourceInvestments = [
    {
      id: 4,
      name: "Natural Resources Fund",
      price: "$95.30",
      change: "+3.5%",
      description: "Fund focused on natural resources and commodities.",
      performance: "High",
      risk: "Medium",
      purchased: false,
      type: "resource",
    },
    {
      id: 5,
      name: "Global Resources ETF",
      price: "$150.80",
      change: "-0.8%",
      description: "Diversified exposure to global resource markets and commodities.",
      performance: "Medium",
      risk: "High",
      purchased: false,
      type: "resource",
    },
    {
      id: 6,
      name: "Renewable Resources",
      price: "$78.45",
      change: "+4.2%",
      description: "Focused on sustainable and renewable resource development.",
      performance: "High",
      risk: "Medium",
      purchased: true,
      type: "resource",
    },
    {
      id: 7,
      name: "Agricultural Resources",
      price: "$112.35",
      change: "+2.1%",
      description: "Investment in agricultural land and production resources.",
      performance: "Medium",
      risk: "Medium",
      purchased: false,
      type: "resource",
    },
    {
      id: 8,
      name: "Water Resources Fund",
      price: "$65.90",
      change: "+5.7%",
      description: "Focused on water infrastructure and conservation technologies.",
      performance: "High",
      risk: "Low",
      purchased: false,
      type: "resource",
    },
    {
      id: 9,
      name: "Mineral Resources Trust",
      price: "$187.25",
      change: "-1.5%",
      description: "Investment in mineral extraction and processing operations.",
      performance: "Medium",
      risk: "High",
      purchased: false,
      type: "resource",
    },
  ]

  // Combined investments for portfolio view
  const allInvestments = [...companyInvestments, ...resourceInvestments]

  const portfolioValue = "$3,500"
  const portfolioChange = "+4.2%"

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investments</h1>
        <SharedHeader />
      </div>

      {/* Performance Chart Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Track your investment growth over time</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{portfolioValue}</div>
              <div
                className={`text-sm font-medium ${portfolioChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {portfolioChange} this month
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Replace the chart component with a simple placeholder */}
          <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Investment performance chart</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="marketplace">Investment Marketplace</TabsTrigger>
          <TabsTrigger value="portfolio">Your Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6 mt-6">
          <div className="flex items-center justify-center mb-6">
            <TabsList>
              <TabsTrigger
                value="company"
                onClick={() => setInvestmentType("company")}
                className={investmentType === "company" ? "bg-primary text-primary-foreground" : ""}
              >
                <Building className="h-4 w-4 mr-2" />
                Company Investments
              </TabsTrigger>
              <TabsTrigger
                value="resource"
                onClick={() => setInvestmentType("resource")}
                className={investmentType === "resource" ? "bg-primary text-primary-foreground" : ""}
              >
                <Landmark className="h-4 w-4 mr-2" />
                Resource Center Investments
              </TabsTrigger>
            </TabsList>
          </div>

          {investmentType === "company" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Company Investments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companyInvestments
                  .filter((inv) => !inv.purchased)
                  .map((investment) => (
                    <Card key={investment.id}>
                      <CardHeader>
                        <CardTitle>{investment.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <CardDescription>{investment.price}</CardDescription>
                          <Badge
                            variant={investment.change.startsWith("+") ? "default" : "destructive"}
                            className="flex items-center gap-1"
                          >
                            {investment.change.startsWith("+") ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {investment.change}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{investment.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Expected performance level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm">Performance:</span>
                            <Badge variant="outline">{investment.performance}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Investment risk level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm">Risk:</span>
                            <Badge variant="outline">{investment.risk}</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Buy Investment</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </>
          )}

          {investmentType === "resource" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Resource Center Investments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resourceInvestments
                  .filter((inv) => !inv.purchased)
                  .map((investment) => (
                    <Card key={investment.id}>
                      <CardHeader>
                        <CardTitle>{investment.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <CardDescription>{investment.price}</CardDescription>
                          <Badge
                            variant={investment.change.startsWith("+") ? "default" : "destructive"}
                            className="flex items-center gap-1"
                          >
                            {investment.change.startsWith("+") ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {investment.change}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{investment.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Expected performance level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm">Performance:</span>
                            <Badge variant="outline">{investment.performance}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Investment risk level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm">Risk:</span>
                            <Badge variant="outline">{investment.risk}</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Buy Investment</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Investment Portfolio</CardTitle>
              <CardDescription>Manage your current investments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Company Investments</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyInvestments
                      .filter((inv) => inv.purchased)
                      .map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell className="font-medium">{investment.name}</TableCell>
                          <TableCell>{investment.price}</TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-1 ${investment.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {investment.change.startsWith("+") ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {investment.change}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{investment.performance}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{investment.risk}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Sell
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Resource Center Investments</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resourceInvestments
                      .filter((inv) => inv.purchased)
                      .map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell className="font-medium">{investment.name}</TableCell>
                          <TableCell>{investment.price}</TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-1 ${investment.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {investment.change.startsWith("+") ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {investment.change}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{investment.performance}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{investment.risk}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Sell
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Investment Resources</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Learn more about investing with our educational resources and tools.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investment Basics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Learn the fundamentals of investing and building a portfolio.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full flex items-center gap-2">
                <Link href="/shop">
                  <HeadphonesIcon className="h-4 w-4" />
                  Connect with Specialist
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Get insights on current market trends and analysis.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full flex items-center gap-2">
                <Link href="/shop">
                  <HeadphonesIcon className="h-4 w-4" />
                  Connect with Specialist
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investment Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Discover different investment strategies for your goals.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full flex items-center gap-2">
                <Link href="/shop">
                  <HeadphonesIcon className="h-4 w-4" />
                  Connect with Specialist
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
