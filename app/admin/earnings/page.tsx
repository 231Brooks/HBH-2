import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdminFeeReport } from "@/app/actions/service-actions"
import { formatCurrency, formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default function AdminEarningsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Platform Earnings</h1>
      <p className="text-muted-foreground mb-6">Track and analyze platform fees and revenue</p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="service-fees">Service Fees</TabsTrigger>
          <TabsTrigger value="transaction-fees">Transaction Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Suspense fallback={<div>Loading earnings data...</div>}>
              <EarningsSummary />
            </Suspense>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Fees</CardTitle>
              <CardDescription>Latest platform fees collected</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading recent fees...</div>}>
                <RecentFees />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-fees">
          <Card>
            <CardHeader>
              <CardTitle>Service Fee Details</CardTitle>
              <CardDescription>5% platform fee on all service orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading service fees...</div>}>
                <ServiceFees />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction-fees">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Fee Details</CardTitle>
              <CardDescription>$100 fee on buying/selling transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading transaction fees...</div>}>
                <TransactionFees />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function EarningsSummary() {
  const { summary } = await getAdminFeeReport({})

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.total)}</div>
          <p className="text-xs text-muted-foreground">All time platform fees</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.paid)}</div>
          <p className="text-xs text-muted-foreground">Fees with PAID status</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.pending)}</div>
          <p className="text-xs text-muted-foreground">Fees awaiting payment</p>
        </CardContent>
      </Card>
    </>
  )
}

async function RecentFees() {
  const { fees } = await getAdminFeeReport({ limit: 10 })

  if (fees.length === 0) {
    return <div className="text-muted-foreground">No fees collected yet</div>
  }

  return (
    <div className="space-y-4">
      {fees.map((fee) => (
        <div key={fee.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
          <div>
            <div className="font-medium">
              {fee.type === "SERVICE_FEE"
                ? `Service Fee: ${fee.serviceOrder?.service.name}`
                : `Transaction Fee: ${fee.transaction?.property.address}`}
            </div>
            <div className="text-sm text-muted-foreground">{formatDate(fee.createdAt)}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{formatCurrency(fee.amount)}</div>
            <div
              className={`text-xs ${
                fee.status === "PAID" ? "text-green-600" : fee.status === "PENDING" ? "text-amber-600" : "text-red-600"
              }`}
            >
              {fee.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function ServiceFees() {
  const { fees } = await getAdminFeeReport({ type: "SERVICE_FEE", limit: 20 })

  if (fees.length === 0) {
    return <div className="text-muted-foreground">No service fees collected yet</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Service</th>
            <th className="text-left py-2">Client</th>
            <th className="text-left py-2">Provider</th>
            <th className="text-right py-2">Amount</th>
            <th className="text-right py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id} className="border-b last:border-0">
              <td className="py-2">{formatDate(fee.createdAt)}</td>
              <td className="py-2">{fee.serviceOrder?.service.name || "N/A"}</td>
              <td className="py-2">{fee.serviceOrder?.client.name || "N/A"}</td>
              <td className="py-2">{fee.serviceOrder?.provider.name || "N/A"}</td>
              <td className="py-2 text-right">{formatCurrency(fee.amount)}</td>
              <td className="py-2 text-right">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    fee.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : fee.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {fee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function TransactionFees() {
  const { fees } = await getAdminFeeReport({ type: "TRANSACTION_FEE", limit: 20 })

  if (fees.length === 0) {
    return <div className="text-muted-foreground">No transaction fees collected yet</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Property</th>
            <th className="text-left py-2">Transaction Type</th>
            <th className="text-right py-2">Amount</th>
            <th className="text-right py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id} className="border-b last:border-0">
              <td className="py-2">{formatDate(fee.createdAt)}</td>
              <td className="py-2">
                {fee.transaction?.property.address}, {fee.transaction?.property.city}
              </td>
              <td className="py-2">{fee.transaction?.type || "N/A"}</td>
              <td className="py-2 text-right">{formatCurrency(fee.amount)}</td>
              <td className="py-2 text-right">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    fee.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : fee.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {fee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
