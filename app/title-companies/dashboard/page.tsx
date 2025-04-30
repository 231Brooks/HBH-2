import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Building, FileText, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function TitleCompanyDashboard() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const sql = neon(process.env.DATABASE_URL!)

  // Get title companies the user is associated with
  const titleCompanyUsers = await sql`
    SELECT tcu.*, tc.name, tc.logo
    FROM "TitleCompanyUser" tcu
    JOIN "TitleCompany" tc ON tcu."titleCompanyId" = tc.id
    WHERE tcu."userId" = ${session.user.id}
  `

  if (titleCompanyUsers.length === 0) {
    redirect("/title-companies/join")
  }

  // If user is associated with multiple title companies, let them select one
  if (titleCompanyUsers.length > 1) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Select Title Company</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {titleCompanyUsers.map((tcu) => (
            <Link key={tcu.id} href={`/title-companies/${tcu.titleCompanyId}/dashboard`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{tcu.name}</CardTitle>
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={tcu.logo || "/placeholder.svg"} alt={tcu.name} className="h-full w-full object-cover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Role: {tcu.role}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // If user is associated with only one title company, show its dashboard
  const titleCompanyUser = titleCompanyUsers[0]
  const titleCompanyId = titleCompanyUser.titleCompanyId

  // Get title company details
  const [titleCompany] = await sql`
    SELECT * FROM "TitleCompany"
    WHERE id = ${titleCompanyId}
  `

  // Get recent transactions
  const recentTransactions = await sql`
    SELECT t.*, p.address, p.city, p.state
    FROM "Transaction" t
    JOIN "Property" p ON t."propertyId" = p.id
    WHERE t."titleCompanyId" = ${titleCompanyId}
    ORDER BY t."updatedAt" DESC
    LIMIT 5
  `

  // Get pending documents
  const pendingDocuments = await sql`
    SELECT d.*, t.id as "transactionId", p.address
    FROM "Document" d
    JOIN "Transaction" t ON d."transactionId" = t.id
    JOIN "Property" p ON t."propertyId" = p.id
    WHERE t."titleCompanyId" = ${titleCompanyId}
    AND d.status = 'PENDING_REVIEW'
    ORDER BY d."createdAt" DESC
    LIMIT 5
  `

  // Get upcoming closings
  const upcomingClosings = await sql`
    SELECT t.*, p.address, p.city, p.state
    FROM "Transaction" t
    JOIN "Property" p ON t."propertyId" = p.id
    WHERE t."titleCompanyId" = ${titleCompanyId}
    AND t."closingDate" >= CURRENT_DATE
    AND t.status != 'COMPLETED'
    AND t.status != 'CANCELLED'
    ORDER BY t."closingDate" ASC
    LIMIT 5
  `

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg overflow-hidden">
            <img
              src={titleCompany.logo || "/placeholder.svg"}
              alt={titleCompany.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{titleCompany.name}</h1>
            <p className="text-muted-foreground">
              {titleCompany.city}, {titleCompany.state}
            </p>
          </div>
        </div>

        {titleCompanyUser.role === "ADMIN" && (
          <Button asChild>
            <Link href={`/title-companies/${titleCompanyId}/settings`}>Manage Title Company</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Transactions</CardTitle>
            <CardDescription>Current transactions in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recentTransactions.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Documents</CardTitle>
            <CardDescription>Documents awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingDocuments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Closings</CardTitle>
            <CardDescription>Scheduled in next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingClosings.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="documents">Pending Documents</TabsTrigger>
          <TabsTrigger value="closings">Upcoming Closings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {recentTransactions.length > 0 ? (
            <div className="divide-y">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="py-4">
                  <Link
                    href={`/progress/${transaction.id}`}
                    className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.address}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.city}, {transaction.state}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium">{formatCurrency(transaction.price)}</span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                            {transaction.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No recent transactions</div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href={`/title-companies/${titleCompanyId}/transactions`}>View All Transactions</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {pendingDocuments.length > 0 ? (
            <div className="divide-y">
              {pendingDocuments.map((document) => (
                <div key={document.id} className="py-4">
                  <Link
                    href={`/progress/${document.transactionId}/documents/${document.id}`}
                    className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{document.name}</h3>
                        <p className="text-sm text-muted-foreground">{document.address}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Needs Review</span>
                          <span className="text-xs text-muted-foreground">
                            Uploaded {formatDate(document.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No pending documents</div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href={`/title-companies/${titleCompanyId}/documents`}>View All Documents</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="closings" className="space-y-4">
          {upcomingClosings.length > 0 ? (
            <div className="divide-y">
              {upcomingClosings.map((closing) => (
                <div key={closing.id} className="py-4">
                  <Link
                    href={`/progress/${closing.id}`}
                    className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{closing.address}</h3>
                        <p className="text-sm text-muted-foreground">
                          {closing.city}, {closing.state}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium">{formatCurrency(closing.price)}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Closing {formatDate(closing.closingDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No upcoming closings</div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href={`/title-companies/${titleCompanyId}/closings`}>View All Closings</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
