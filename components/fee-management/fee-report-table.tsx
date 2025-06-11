import { getAdminFeeReport } from "@/app/actions/service-actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface FeeReportTableProps {
  feeType?: string
  status?: string
  limit?: number
}

export async function FeeReportTable({ feeType, status, limit = 50 }: FeeReportTableProps) {
  const { fees, total } = await getAdminFeeReport({
    type: feeType,
    status,
    limit,
  })

  if (fees.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No fees found matching the current filters</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {fees.length} of {total} fees
        </div>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Related Item</th>
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-b last:border-0">
                <td className="py-2 font-mono text-xs">{fee.id}</td>
                <td className="py-2">{formatDate(fee.createdAt)}</td>
                <td className="py-2">
                  {fee.type === "SERVICE_FEE"
                    ? "Service Fee"
                    : fee.type === "TRANSACTION_FEE"
                      ? "Transaction Fee"
                      : "Other"}
                </td>
                <td className="py-2">
                  {fee.serviceOrder
                    ? `${fee.serviceOrder.service.name} (Order)`
                    : fee.transaction
                      ? `${fee.transaction.property.address.substring(0, 20)}... (Transaction)`
                      : "N/A"}
                </td>
                <td className="py-2">{fee.description || "N/A"}</td>
                <td className="py-2 text-right">{formatCurrency(fee.amount)}</td>
                <td className="py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      fee.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : fee.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : fee.status === "REFUNDED"
                            ? "bg-blue-100 text-blue-800"
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
    </div>
  )
}
