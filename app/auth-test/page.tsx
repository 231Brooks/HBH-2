"use client"

import { useSupabase } from "@/contexts/supabase-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOnly } from "@/components/client-only"

export default function AuthTestPage() {
  const { user, supabase, loading, isHydrated } = useSupabase()

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test (Hydration Safe)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Hydration Status:</h3>
            <p>Is Hydrated: {isHydrated ? "✅ Yes" : "❌ No"}</p>
            <p>Loading: {loading ? "Yes" : "No"}</p>
          </div>

          <ClientOnly
            fallback={
              <div className="p-4 bg-gray-100 rounded">
                <p>🔄 Waiting for client hydration...</p>
              </div>
            }
          >
            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-semibold mb-2">Client-Side Auth State:</h3>
              {loading ? (
                <p>Loading authentication...</p>
              ) : user ? (
                <div>
                  <p>✅ Signed in as: {user.email}</p>
                  <p>User ID: {user.id}</p>
                  <Button onClick={handleSignOut} className="mt-2">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div>
                  <p>❌ Not signed in</p>
                  <Button asChild className="mt-2">
                    <a href="/auth/login">Sign In</a>
                  </Button>
                </div>
              )}
            </div>
          </ClientOnly>

          <div>
            <h3 className="font-semibold mb-2">Server vs Client Rendering:</h3>
            <p>This page should render consistently on server and client without hydration errors.</p>
            <p>The auth state is only shown after client hydration to prevent mismatches.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
