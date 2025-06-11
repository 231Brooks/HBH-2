export const dynamic = "force-dynamic"

export default function RealtimeChatPlaceholder() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Real-time Chat Demo</h1>
      <p className="text-muted-foreground mb-8">This demo is currently under maintenance. Please check back later.</p>

      <div className="p-8 border rounded-lg bg-muted/20">
        <h2 className="text-xl font-semibold mb-4">Features Coming Soon</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Real-time messaging with Supabase Realtime</li>
          <li>Message caching with Redis</li>
          <li>Typing indicators</li>
          <li>Read receipts</li>
          <li>User presence indicators</li>
        </ul>
      </div>
    </div>
  )
}
