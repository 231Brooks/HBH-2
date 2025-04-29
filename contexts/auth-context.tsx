"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate login
      const user = { id: "1", name: "Test User", email }
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      // Simulate logout
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate signup
      const user = { id: "1", name, email }
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
