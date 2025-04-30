import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Clock, CheckCircle, AlertCircle, Users, Search, Plus, Filter, ArrowUpRight } from "lucide-react"

export default function ProgressPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Transaction Progress</h1>
          <p className="text-muted-foreground">Track and manage your real estate transactions with title companies</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search transactions..." className="pl-10 w-full sm:w-[300px]" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <select className="border rounded-md px-3 py-1 text-sm bg-white">
                <option>All Statuses</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active (4)</TabsTrigger>
              <TabsTrigger value="completed">Completed (2)</TabsTrigger>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <TransactionCard
                address="123 Main Street, Phoenix, AZ 85001"
                price="$425,000"
                status="In Progress"
                statusColor="bg-amber-500"
                progress={65}
                dueDate="Jul 15, 2023"
                titleCompany="Desert Title Company"
                parties={["John Smith (Buyer)", "Sarah Johnson (Seller)"]}
                lastUpdate="Document uploaded: Purchase Agreement"
                lastUpdateTime="2 hours ago"
              />

              <TransactionCard
                address="456 Oak Avenue, Scottsdale, AZ 85251"
                price="$750,000"
                status="Pending Approval"
                statusColor="bg-blue-500"
                progress={40}
                dueDate="Aug 3, 2023"
                titleCompany="Arizona Reliable Title"
                parties={["Michael Brown (Buyer)", "Jennifer Davis (Seller)"]}
                lastUpdate="Waiting for: Inspection Report"
                lastUpdateTime="1 day ago"
              />

              <TransactionCard
                address="789 Pine Road, Tempe, AZ 85281"
                price="$350,000"
                status="Document Review"
                statusColor="bg-purple-500"
                progress={25}
                dueDate="Aug 22, 2023"
                titleCompany="Secure Title Services"
                parties={["Robert Wilson (Buyer)", "Lisa Martinez (Seller)"]}
                lastUpdate="Signature requested: Disclosure Form"
                lastUpdateTime="3 days ago"
              />

              <TransactionCard
                address="101 River Lane, Mesa, AZ 85201"
                price="$525,000"
                status="Closing Soon"
                statusColor="bg-green-500"
                progress={85}
                dueDate="Jul 5, 2023"
                titleCompany="First American Title"
                parties={["David Thompson (Buyer)", "Amanda Garcia (Seller)"]}
                lastUpdate="Scheduled: Closing appointment"
                lastUpdateTime="12 hours ago"
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <TransactionCard
                address="222 Valley View, Chandler, AZ 85224"
                price="$475,000"
                status="Completed"
                statusColor="bg-green-600"
                progress={100}
                dueDate="Jun 10, 2023"
                titleCompany="Southwest Title Company"
                parties={["James Wilson (Buyer)", "Patricia Moore (Seller)"]}
                lastUpdate="Transaction completed successfully"
                lastUpdateTime="2 weeks ago"
              />

              <TransactionCard
                address="333 Mountain Drive, Gilbert, AZ 85233"
                price="$620,000"
                status="Completed"
                statusColor="bg-green-600"
                progress={100}
                dueDate="May 28, 2023"
                titleCompany="Fidelity National Title"
                parties={["Thomas Anderson (Buyer)", "Elizabeth Taylor (Seller)"]}
                lastUpdate="Transaction completed successfully"
                lastUpdateTime="1 month ago"
              />
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <p className="text-muted-foreground">Showing all 6 transactions</p>
              {/* Would include all transactions here */}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Title Companies</CardTitle>
              <CardDescription>Your connected title partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Building className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">Desert Title Company</p>
                    <p className="text-sm text-muted-foreground">3 active transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Building className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">First American Title</p>
                    <p className="text-sm text-muted-foreground">1 active transaction</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Building className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fidelity National Title</p>
                    <p className="text-sm text-muted-foreground">2 completed transactions</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Title Company
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Latest transaction documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Purchase_Agreement_123Main.pdf</p>
                    <p className="text-sm text-muted-foreground">Uploaded 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Inspection_Report_456Oak.pdf</p>
                    <p className="text-sm text-muted-foreground">Uploaded 1 day ago</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Disclosure_Form_789Pine.pdf</p>
                    <p className="text-sm text-muted-foreground">Uploaded 3 days ago</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  View All Documents
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important dates to remember</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Closing: 101 River Lane</p>
                    <p className="text-sm text-muted-foreground">Jul 5, 2023 (3 days left)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Inspection: 123 Main Street</p>
                    <p className="text-sm text-muted-foreground">Jul 8, 2023 (6 days left)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Financing: 456 Oak Avenue</p>
                    <p className="text-sm text-muted-foreground">Jul 20, 2023 (18 days left)</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

interface TransactionCardProps {
  address: string
  price: string
  status: string
  statusColor: string
  progress: number
  dueDate: string
  titleCompany: string
  parties: string[]
  lastUpdate: string
  lastUpdateTime: string
}

function TransactionCard({
  address,
  price,
  status,
  statusColor,
  progress,
  dueDate,
  titleCompany,
  parties,
  lastUpdate,
  lastUpdateTime,
}: TransactionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-semibold text-lg">{address}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColor} text-white`}>{status}</Badge>
              <span className="font-bold">{price}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Due: {dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{titleCompany}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{parties.join(", ")}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            {progress < 100 ? (
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            )}
            <div>
              <p>{lastUpdate}</p>
              <p className="text-muted-foreground">{lastUpdateTime}</p>
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
          <Button className="mt-4 w-full">Manage Transaction</Button>
        </div>
      </div>
    </Card>
  )
}
