export default function TestEnvPage() {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Environment Variable Test</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">NEXT_PUBLIC_VERCEL_URL</h2>
          <p className="text-sm text-gray-600">{vercelUrl ? `✅ Set: ${vercelUrl}` : "❌ Not set"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">NEXTAUTH_URL</h2>
          <p className="text-sm text-gray-600">{nextAuthUrl ? `✅ Set: ${nextAuthUrl}` : "❌ Not set"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Current URL Info</h2>
          <p className="text-sm text-gray-600">Environment: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}
