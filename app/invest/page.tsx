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
import { InvestmentPerformanceChart } from "@/components/investment-performance-chart"

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
  ]

  // Combined investments for portfolio view
  const allInvestments = [...companyInvestments, ...resourceInvestments]

  const portfolioValue = "$3,500"
  const portfolioChange = "+4.2%"

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            <HeadphonesIcon className="h-4 w-4 mr-2" />
            Get Help
          </Button>
          <SharedHeader />
        </div>
      </div>

      {/* Performance Chart Section */}
      <Card className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Portfolio Performance</CardTitle>
              <CardDescription className="text-gray-500">Track your investment growth over time</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{portfolioValue}</div>
              <div
                className={`text-sm font-medium ${portfolioChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {portfolioChange} this month
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InvestmentPerformanceChart />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="marketplace"
            className={`rounded-md py-2 ${activeTab === "marketplace" ? "bg-white shadow-sm" : "bg-transparent"}`}
          >
            Investment Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className={`rounded-md py-2 ${activeTab === "portfolio" ? "bg-white shadow-sm" : "bg-transparent"}`}
          >
            Your Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-8 mt-6">
          <div className="flex items-center justify-center mb-6">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="company"
                onClick={() => setInvestmentType("company")}
                className={`rounded-md py-2 px-4 ${investmentType === "company" ? "bg-white shadow-sm" : "bg-transparent"}`}
              >
                <Building className="h-4 w-4 mr-2" />
                Company Investments
              </TabsTrigger>
              <TabsTrigger
                value="resource"
                onClick={() => setInvestmentType("resource")}
                className={`rounded-md py-2 px-4 ${investmentType === "resource" ? "bg-white shadow-sm" : "bg-transparent"}`}
              >
                <Landmark className="h-4 w-4 mr-2" />
                Resource Center Investments
              </TabsTrigger>
            </TabsList>
          </div>

          {investmentType === "company" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Company Investments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companyInvestments
                  .filter((inv) => !inv.purchased)
                  .map((investment) => (
                    <Card key={investment.id} className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">{investment.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <CardDescription className="text-gray-500">{investment.price}</CardDescription>
                          <Badge
                            variant={investment.change.startsWith("+") ? "default" : "destructive"}
                            className={`flex items-center gap-1 ${
                              investment.change.startsWith("+")
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
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
                        <p className="text-sm text-gray-600">{investment.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Expected performance level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm text-gray-600">Performance:</span>
                            <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                              {investment.performance}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Investment risk level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm text-gray-600">Risk:</span>
                            <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                              {investment.risk}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Buy Investment</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </>
          )}

          {investmentType === "resource" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Resource Center Investments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resourceInvestments
                  .filter((inv) => !inv.purchased)
                  .map((investment) => (
                    <Card key={investment.id} className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">{investment.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <CardDescription className="text-gray-500">{investment.price}</CardDescription>
                          <Badge
                            variant={investment.change.startsWith("+") ? "default" : "destructive"}
                            className={`flex items-center gap-1 ${
                              investment.change.startsWith("+")
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
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
                        <p className="text-sm text-gray-600">{investment.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Expected performance level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm text-gray-600">Performance:</span>
                            <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                              {investment.performance}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Investment risk level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm text-gray-600">Risk:</span>
                            <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                              {investment.risk}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Buy Investment</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <Card className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Your Investment Portfolio</CardTitle>
              <CardDescription className="text-gray-500">Manage your current investments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Company Investments</h3>
                </div>
                <div className="overflow-x-auto">
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
                              <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                                {investment.performance}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                                {investment.risk}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                                Sell
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="h-5 w-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Resource Center Investments</h3>
                </div>
                <div className="overflow-x-auto">
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
                              <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                                {investment.performance}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-transparent text-gray-700 border-gray-300">
                                {investment.risk}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                                Sell
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Investment Resources</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Learn more about investing with our educational resources and tools.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Investment Basics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Learn the fundamentals of investing and building a portfolio.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Link href="/shop">
                  <HeadphonesIcon className="h-4 w-4" />
                  Connect with Specialist
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Get insights on current market trends and analysis.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Link href="/shop">
                  <HeadphonesIcon className="h-4 w-4" />
                  Connect with Specialist
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Investment Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Discover different investment strategies for your goals.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
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
