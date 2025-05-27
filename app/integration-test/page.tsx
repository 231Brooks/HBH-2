import { IntegrationTestWrapper } from "./client-wrapper"

export default function IntegrationTestPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Integration Test Dashboard</h1>
        <p className="text-muted-foreground mt-2">Verify that Supabase and Upstash Redis are properly connected</p>
      </div>

      <IntegrationTestWrapper />
    </div>
  )
}
