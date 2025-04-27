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
        <div className="p-4 md:p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
            <h3 className="font-semibold text-sm md:text-lg truncate">
              {transaction.property.address}, {transaction.property.city}, {transaction.property.state}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColor} text-white text-xs`}>{transaction.status.replace(/_/g, " ")}</Badge>
              <span className="font-bold text-sm md:text-base">{formatCurrency(transaction.price)}</span>
            </div>
          </div>

          <div className="mb-3 md:mb-4">
            <div className="flex justify-between text-xs md:text-sm mb-1">
              <span>Progress</span>
              <span>{transaction.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${transaction.progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs md:text-sm truncate">
                {transaction.closingDate ? `Closing: ${formatDate(transaction.closingDate)}` : "No closing date set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs md:text-sm truncate">
                {transaction.titleCompany ? transaction.titleCompany.name : "No title company"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs md:text-sm truncate">{getPartyNames()}</span>
          </div>

          <div className="flex items-start gap-2 text-xs md:text-sm">
            {nextMilestone ? (
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              {nextMilestone ? (
                <>
                  <p>Next: {nextMilestone.title}</p>
                  <p className="text-muted-foreground text-[10px] md:text-xs">
                    Due: {formatDate(nextMilestone.dueDate)}
                  </p>
                </>
              ) : (
                <p>All milestones completed</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 md:p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between">
          <div className="space-y-2 md:space-y-3">
            <Button variant="outline" className="w-full justify-start text-xs md:text-sm">
              <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" /> View Documents
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs md:text-sm">
              <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" /> Contact Parties
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs md:text-sm">
              <Clock className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" /> View Timeline
            </Button>
          </div>
          <Button className="mt-3 md:mt-4 w-full text-xs md:text-sm" asChild>
            <Link href={`/progress/${transaction.id}`}>Manage Transaction</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
