"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/contexts/supabase-context"

export default function TestAuth() {
  const { supabase, user, loading, error } = useSupabase()
  const [testResult, setTestResult] = useState<string>("")

  const testConnection = async () => {
    if (!supabase) {
      setTestResult("❌ Supabase client not initialized")
      return
    }

    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setTestResult(`❌ Connection error: ${error.message}`)
        return
      }

      setTestResult("✅ Supabase connection working!")
    } catch (err) {
      setTestResult(`❌ Test failed: ${err}`)
    }
  }

  const testEmailSignUp = async () => {
    if (!supabase) {
      setTestResult("❌ Supabase client not initialized")
      return
    }

    try {
      const testEmail = `test+${Date.now()}@example.com`
      const testPassword = "testpassword123"

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        setTestResult(`❌ Sign up error: ${error.message}`)
        return
      }

      setTestResult(`✅ Sign up test successful! User: ${data.user?.email}`)
    } catch (err) {
      setTestResult(`❌ Sign up test failed: ${err}`)
    }
  }

  useEffect(() => {
    if (supabase) {
      testConnection()
    }
  }, [supabase])

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environment Status:</h3>
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
            <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Connection Status:</h3>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>Error: {error ? error.message : "None"}</p>
            <p>User: {user ? user.email : "Not signed in"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <p className="bg-gray-100 p-2 rounded">{testResult || "Click a test button"}</p>
          </div>

          <div className="space-y-2">
            <Button onClick={testConnection} className="w-full">
              Test Connection
            </Button>
            <Button onClick={testEmailSignUp} variant="outline" className="w-full">
              Test Email Sign Up
            </Button>
          </div>

          {user && (
            <Button
              onClick={async () => {
                if (supabase) {
                  await supabase.auth.signOut()
                  setTestResult("Signed out")
                }
              }}
              variant="destructive"
              className="w-full"
            >
              Sign Out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
