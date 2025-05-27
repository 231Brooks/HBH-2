import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { FeeReportFilters } from "@/components/fee-management/fee-report-filters"
import { FeeReportTable } from "@/components/fee-management/fee-report-table"
import { FeeReportSummary } from "@/components/fee-management/fee-report-summary"
import { FeeReportChart } from "@/components/fee-management/fee-report-chart"

export const dynamic = "force-dynamic"

export default function AdminFeesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
      <p className="text-muted-foreground mb-6">Track and analyze platform fees and revenue</p>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Fees</TabsTrigger>
          <TabsTrigger value="service">Service Fees</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Fees</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Fee Report</CardTitle>
                  <CardDescription>Comprehensive view of all platform fees</CardDescription>
                </div>
                <Suspense fallback={<div>Loading date picker...</div>}>
                  <DateRangePicker />
                </Suspense>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading filters...</div>}>
                <FeeReportFilters />
              </Suspense>

              <div className="mt-6">
                <Suspense fallback={<div>Loading summary...</div>}>
                  <FeeReportSummary />
                </Suspense>
              </div>

              <div className="mt-6">
                <Suspense fallback={<div>Loading fee report...</div>}>
                  <FeeReportTable />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Service Fee Report</CardTitle>
                  <CardDescription>5% platform fee on all service orders</CardDescription>
                </div>
                <Suspense fallback={<div>Loading date picker...</div>}>
                  <DateRangePicker />
                </Suspense>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading service fee report...</div>}>
                <FeeReportTable feeType="SERVICE_FEE" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Transaction Fee Report</CardTitle>
                  <CardDescription>$100 fee on buying/selling transactions</CardDescription>
                </div>
                <Suspense fallback={<div>Loading date picker...</div>}>
                  <DateRangePicker />
                </Suspense>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading transaction fee report...</div>}>
                <FeeReportTable feeType="TRANSACTION_FEE" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Fee Analytics</CardTitle>
                  <CardDescription>Visual analysis of platform revenue</CardDescription>
                </div>
                <Suspense fallback={<div>Loading date picker...</div>}>
                  <DateRangePicker />
                </Suspense>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading fee analytics...</div>}>
                <FeeReportChart />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
