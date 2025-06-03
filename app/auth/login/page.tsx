"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSupabase } from "@/contexts/supabase-context"

export default function LoginPage() {
  const router = useRouter()
  const { supabase, user, loading: authLoading } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!supabase) {
      setError("Authentication system is not available. Please try again later.")
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      // The useEffect above will handle redirect on successful login
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to sign in. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    if (!supabase) {
      setError("Authentication system is not available. Please try again later.")
      return
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        throw signInError
      }
    } catch (err: any) {
      console.error(`${provider} login error:`, err)
      setError(err.message || `Failed to sign in with ${provider}. Please try again.`)
    }
  }

  if (authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary underline hover:no-underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !supabase}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground uppercase">
                  <span className="bg-background px-2">or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={loading || !supabase}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={loading || !supabase}
                >
                  GitHub
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t pt-5">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary underline hover:no-underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
