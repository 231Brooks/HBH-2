import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Users, Clock, CheckCircle, AlertCircle, Building } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/types"

interface TransactionCardProps {
  transaction: Transaction
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const statusColors = {
    IN_PROGRESS: "bg-amber-500",
    PENDING_APPROVAL: "bg-blue-500",
    DOCUMENT_REVIEW: "bg-purple-500",
    CLOSING_SOON: "bg-green-500",
    COMPLETED: "bg-green-600",
    CANCELLED: "bg-red-500",
  }

  const statusColor = statusColors[transaction.status] || "bg-slate-500"

  const getPartyNames = () => {
    const parties = transaction.parties || []
    return parties.map((party) => `${party.user.name} (${party.role})`).join(", ")
  }

  const getNextMilestone = () => {
    const incompleteMilestones = (transaction.milestones || [])
      .filter((m) => m.status !== "COMPLETED")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    return incompleteMilestones[0]
  }

  const nextMilestone = getNextMilestone()

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg">
              {transaction.property.address}, {transaction.property.city}, {transaction.property.state}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColor} text-white`}>{transaction.status.replace(/_/g, " ")}</Badge>
              <span className="font-bold">{formatCurrency(transaction.price)}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{transaction.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${transaction.progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {transaction.closingDate ? `Closing: ${formatDate(transaction.closingDate)}` : "No closing date set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {transaction.titleCompany ? transaction.titleCompany.name : "No title company"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getPartyNames()}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            {nextMilestone ? (
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            )}
            <div>
              {nextMilestone ? (
                <>
                  <p>Next: {nextMilestone.title}</p>
                  <p className="text-muted-foreground">Due: {formatDate(nextMilestone.dueDate)}</p>
                </>
              ) : (
                <p>All milestones completed</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" /> View Documents
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" /> Contact Parties
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" /> View Timeline
            </Button>
          </div>
          <Button className="mt-4 w-full" asChild>
            <Link href={`/progress/${transaction.id}`}>Manage Transaction</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
