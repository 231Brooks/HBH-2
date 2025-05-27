"use client"

import { useSupabase } from "@/contexts/supabase-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SupabaseAuthStatus() {
  const { supabase, user, loading, error } = useSupabase()
  const [authError, setAuthError] = useState<string | null>(null)

  const handleSignIn = async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setAuthError(error.message)
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setAuthError("Failed to sign in")
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Sign out error:", err)
      setAuthError("Failed to sign out")
    }
  }

  if (loading) {
    return <div>Loading auth status...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Supabase Auth Status</h2>

      {user ? (
        <div>
          <p className="mb-2">Signed in as: {user.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <p className="mb-2">Not signed in</p>
          <Button onClick={handleSignIn}>Sign In with GitHub</Button>
        </div>
      )}

      {authError && <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{authError}</div>}
    </div>
  )
}
