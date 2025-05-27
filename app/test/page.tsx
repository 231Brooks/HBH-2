import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Real-Time Features Test</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pusher Test</CardTitle>
            <CardDescription>Test the Pusher integration with the new server-side configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This test verifies that Pusher is working correctly with our new implementation that keeps sensitive
              credentials on the server side.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/test/pusher">
              <Button>Run Pusher Test</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Realtime Test</CardTitle>
            <CardDescription>Test the Supabase realtime features</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This test verifies that Supabase realtime features are working correctly for database changes and
              broadcasts.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/api/test/setup-test-tables">
              <Button variant="outline">Setup Test Tables</Button>
            </Link>
            <Link href="/test/supabase-realtime">
              <Button>Run Supabase Test</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">How to Test</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>First, click "Setup Test Tables" to create the necessary database tables for testing</li>
          <li>Open the Pusher Test in one browser window</li>
          <li>Open the Supabase Realtime Test in another browser window</li>
          <li>Send messages in both tests to verify real-time updates are working</li>
          <li>Try opening multiple browser windows to see messages sync across all instances</li>
        </ol>
      </div>
    </div>
  )
}
