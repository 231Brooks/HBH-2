"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Plus, Minus, PieChart, BarChart, LineChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simple chart component that doesn't rely on external resources
function SimpleChart({ type = "line", className = "h-[300px]" }: { type?: string; className?: string }) {
  return (
    <div className={`w-full bg-gray-50 rounded-lg flex flex-col items-center justify-center ${className}`}>
      <div className="mb-2">
        {type === "line" && <LineChart className="h-8 w-8 text-blue-500" />}
        {type === "bar" && <BarChart className="h-8 w-8 text-blue-500" />}
        {type === "pie" && <PieChart className="h-8 w-8 text-blue-500" />}
      </div>
      <p className="text-gray-400 text-sm">Chart visualization will appear here</p>
    </div>
  )
}

export default function InvestmentsPage() {
  const [timeframe, setTimeframe] = useState("1m")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Export Data
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Investment
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Portfolio Overview</h2>
              <p className="text-sm text-gray-500">Track and manage your investment portfolio</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="1m" value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px] bg-white border-gray-200">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Portfolio Value</CardTitle>
                <PieChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$124,568.78</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-500 flex items-center">
                    +12.5% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Monthly Return</CardTitle>
                <LineChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">+$2,458.63</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-500 flex items-center">
                    +8.2% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  from previous month
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">YTD Return</CardTitle>
                <BarChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">+$15,789.42</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-500 flex items-center">
                    +14.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  year to date
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Assets</CardTitle>
                <PieChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-500">
                  <span className="text-green-500 flex items-center">
                    +2 <Plus className="h-4 w-4 ml-1" />
                  </span>{" "}
                  new assets this month
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="portfolio" className="space-y-4">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio" className="space-y-4">
              <Card className="border border-gray-100 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">Investment Assets</CardTitle>
                  <CardDescription className="text-gray-500">
                    Your current investment holdings and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-100 overflow-hidden">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead>
                            <tr className="border-b transition-colors hover:bg-gray-50">
                              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Asset</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Type</th>
                              <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Value</th>
                              <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Return</th>
                              <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle font-medium">AAPL</td>
                              <td className="p-4 align-middle text-gray-600">Stock</td>
                              <td className="p-4 align-middle text-right font-medium">$24,567.89</td>
                              <td className="p-4 align-middle text-right">+$1,234.56</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +5.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle font-medium">MSFT</td>
                              <td className="p-4 align-middle text-gray-600">Stock</td>
                              <td className="p-4 align-middle text-right font-medium">$18,765.43</td>
                              <td className="p-4 align-middle text-right">+$876.54</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +4.9% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle font-medium">AMZN</td>
                              <td className="p-4 align-middle text-gray-600">Stock</td>
                              <td className="p-4 align-middle text-right font-medium">$15,432.10</td>
                              <td className="p-4 align-middle text-right">-$321.45</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-red-500 flex items-center justify-end">
                                  -2.1% <ArrowDownRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle font-medium">VTI</td>
                              <td className="p-4 align-middle text-gray-600">ETF</td>
                              <td className="p-4 align-middle text-right font-medium">$32,456.78</td>
                              <td className="p-4 align-middle text-right">+$1,543.21</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +5.0% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="transition-colors hover:bg-gray-50">
                              <td className="p-4 align-middle font-medium">BTC</td>
                              <td className="p-4 align-middle text-gray-600">Crypto</td>
                              <td className="p-4 align-middle text-right font-medium">$12,345.67</td>
                              <td className="p-4 align-middle text-right">+$3,456.78</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +38.9% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <Card className="border border-gray-100 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">Performance Chart</CardTitle>
                  <CardDescription className="text-gray-500">
                    Track your investment performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart type="line" className="h-[400px]" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions" className="space-y-4">
              <Card className="border border-gray-100 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-500">Your recent investment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-gray-100 overflow-hidden">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-gray-50">
                            <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Asset</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Type</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Amount</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle">Apr 20, 2025</td>
                            <td className="p-4 align-middle font-medium">AAPL</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">5 shares</td>
                            <td className="p-4 align-middle text-right font-medium">$178.34</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle">Apr 18, 2025</td>
                            <td className="p-4 align-middle font-medium">MSFT</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">3 shares</td>
                            <td className="p-4 align-middle text-right font-medium">$412.67</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle">Apr 15, 2025</td>
                            <td className="p-4 align-middle font-medium">AMZN</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-red-500">
                                <Minus className="h-4 w-4" /> Sell
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">2 shares</td>
                            <td className="p-4 align-middle text-right font-medium">$178.92</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle">Apr 10, 2025</td>
                            <td className="p-4 align-middle font-medium">VTI</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">10 shares</td>
                            <td className="p-4 align-middle text-right font-medium">$245.32</td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle">Apr 5, 2025</td>
                            <td className="p-4 align-middle font-medium">BTC</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">0.25 BTC</td>
                            <td className="p-4 align-middle text-right font-medium">$62,345.67</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="allocation" className="space-y-4">
              <Card className="border border-gray-100 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-900">Asset Allocation</CardTitle>
                  <CardDescription className="text-gray-500">
                    View your portfolio allocation across different asset classes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart type="pie" className="h-[400px]" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
