import { getAdminFeeReport } from "@/app/actions/service-actions"
import { formatCurrency } from "@/lib/utils"

export async function FeeReportSummary() {
  const { summary } = await getAdminFeeReport({})

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-medium text-muted-foreground">Total Fees</div>
        <div className="text-2xl font-bold mt-1">{formatCurrency(summary.total)}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-medium text-muted-foreground">Collected</div>
        <div className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(summary.paid)}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-medium text-muted-foreground">Pending</div>
        <div className="text-2xl font-bold mt-1 text-amber-600">{formatCurrency(summary.pending)}</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-medium text-muted-foreground">Collection Rate</div>
        <div className="text-2xl font-bold mt-1">
          {summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0}%
        </div>
      </div>
    </div>
  )
}
