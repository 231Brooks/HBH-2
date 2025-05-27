import { createClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

export default async function CallbacksMonitoringPage() {
  const session = await auth()
  if (!session?.user) {
    return redirect("/auth/login")
  }

  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch callback logs
  const { data: logs } = await supabase
    .from("callback_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Callback Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <SummaryCard
          title="Success Rate"
          value={`${calculateSuccessRate(logs || [])}%`}
          description="Last 24 hours"
          className="bg-green-50"
        />
        <SummaryCard
          title="Total Callbacks"
          value={logs?.length || 0}
          description="Last 50 calls"
          className="bg-blue-50"
        />
        <SummaryCard
          title="Failed Callbacks"
          value={countFailedCallbacks(logs || [])}
          description="Attention needed"
          className="bg-amber-50"
        />
      </div>

      {/* Detailed Logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Callback Logs</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed activity of system callbacks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Endpoint
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.endpoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status_code >= 200 && log.status_code < 300
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.status_code} {log.status_code >= 200 && log.status_code < 300 ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration_ms} ms</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No logs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, description, className }) {
  return (
    <div className={`p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

function calculateSuccessRate(logs) {
  if (logs.length === 0) return 100

  const successfulLogs = logs.filter((log) => log.status_code >= 200 && log.status_code < 300)

  return Math.round((successfulLogs.length / logs.length) * 100)
}

function countFailedCallbacks(logs) {
  return logs.filter((log) => !(log.status_code >= 200 && log.status_code < 300)).length
}
