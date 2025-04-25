import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Plus, Minus, PieChart, BarChart, LineChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InvestmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Investments</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button size="sm">Add Investment</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Portfolio Overview</h2>
              <p className="text-sm text-muted-foreground">Track and manage your investment portfolio</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="1m">
                <SelectTrigger className="w-[120px]">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,568.78</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    +12.5% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+$2,458.63</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    +8.2% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  from previous month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+$15,789.42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    +14.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>{" "}
                  year to date
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    +2 <Plus className="h-4 w-4 ml-1" />
                  </span>{" "}
                  new assets this month
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="portfolio" className="space-y-4">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Assets</CardTitle>
                  <CardDescription>Your current investment holdings and their performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <th className="h-12 px-4 text-left align-middle font-medium">Asset</th>
                              <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                              <th className="h-12 px-4 text-right align-middle font-medium">Value</th>
                              <th className="h-12 px-4 text-right align-middle font-medium">Return</th>
                              <th className="h-12 px-4 text-right align-middle font-medium">Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">AAPL</td>
                              <td className="p-4 align-middle">Stock</td>
                              <td className="p-4 align-middle text-right">$24,567.89</td>
                              <td className="p-4 align-middle text-right">+$1,234.56</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +5.3% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">MSFT</td>
                              <td className="p-4 align-middle">Stock</td>
                              <td className="p-4 align-middle text-right">$18,765.43</td>
                              <td className="p-4 align-middle text-right">+$876.54</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +4.9% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">AMZN</td>
                              <td className="p-4 align-middle">Stock</td>
                              <td className="p-4 align-middle text-right">$15,432.10</td>
                              <td className="p-4 align-middle text-right">-$321.45</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-red-500 flex items-center justify-end">
                                  -2.1% <ArrowDownRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">VTI</td>
                              <td className="p-4 align-middle">ETF</td>
                              <td className="p-4 align-middle text-right">$32,456.78</td>
                              <td className="p-4 align-middle text-right">+$1,543.21</td>
                              <td className="p-4 align-middle text-right">
                                <span className="text-green-500 flex items-center justify-end">
                                  +5.0% <ArrowUpRight className="h-4 w-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                            <tr className="transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">BTC</td>
                              <td className="p-4 align-middle">Crypto</td>
                              <td className="p-4 align-middle text-right">$12,345.67</td>
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
              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                  <CardDescription>Track your investment performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Performance chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent investment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Asset</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">Apr 20, 2025</td>
                            <td className="p-4 align-middle">AAPL</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">5 shares</td>
                            <td className="p-4 align-middle text-right">$178.34</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">Apr 18, 2025</td>
                            <td className="p-4 align-middle">MSFT</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">3 shares</td>
                            <td className="p-4 align-middle text-right">$412.67</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">Apr 15, 2025</td>
                            <td className="p-4 align-middle">AMZN</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-red-500">
                                <Minus className="h-4 w-4" /> Sell
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">2 shares</td>
                            <td className="p-4 align-middle text-right">$178.92</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">Apr 10, 2025</td>
                            <td className="p-4 align-middle">VTI</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">10 shares</td>
                            <td className="p-4 align-middle text-right">$245.32</td>
                          </tr>
                          <tr className="transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">Apr 5, 2025</td>
                            <td className="p-4 align-middle">BTC</td>
                            <td className="p-4 align-middle">
                              <span className="flex items-center gap-1 text-green-500">
                                <Plus className="h-4 w-4" /> Buy
                              </span>
                            </td>
                            <td className="p-4 align-middle text-right">0.25 BTC</td>
                            <td className="p-4 align-middle text-right">$62,345.67</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="allocation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>View your portfolio allocation across different asset classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Asset allocation chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
