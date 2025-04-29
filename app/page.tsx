import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ActivityFeed from "@/components/activity-feed"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Homes Better Hands</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your complete real estate platform for managing properties, transactions, and services.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="/progress" className="text-blue-600 hover:underline">
                  View Transactions
                </a>
              </li>
              <li>
                <a href="/marketplace" className="text-blue-600 hover:underline">
                  Browse Properties
                </a>
              </li>
              <li>
                <a href="/services" className="text-blue-600 hover:underline">
                  Find Services
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Properties:</span>
                <span className="font-bold">245</span>
              </div>
              <div className="flex justify-between">
                <span>Service Providers:</span>
                <span className="font-bold">128</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Transactions:</span>
                <span className="font-bold">1,892</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
