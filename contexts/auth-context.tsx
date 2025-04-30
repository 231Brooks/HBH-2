"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

// Create a default context value to prevent errors during SSR
const defaultContextValue: AuthContextType = {
  user: null,
  loading: false,
  login: async () => false,
  logout: () => {},
  register: async () => false,
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)

    // Check for existing user session
    const checkSession = async () => {
      try {
        // Mock successful login for demo purposes
        // In a real app, you'd check for an existing session
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          } else {
            // For demo purposes, auto-login
            setUser({
              id: "user-1",
              name: "Demo User",
              email: "demo@example.com",
              image: "/placeholder.jpg",
            })
            localStorage.setItem(
              "user",
              JSON.stringify({
                id: "user-1",
                name: "Demo User",
                email: "demo@example.com",
                image: "/placeholder.jpg",
              }),
            )
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock successful login
      const newUser = {
        id: "user-1",
        name: "Demo User",
        email: email,
        image: "/placeholder.jpg",
      }
      setUser(newUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser))
      }
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Mock successful registration
      const newUser = {
        id: "user-" + Date.now(),
        name,
        email,
        image: "/placeholder.jpg",
      }
      setUser(newUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser))
      }
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  // Check if we're in a browser environment before using the context
  if (typeof window === "undefined") {
    return defaultContextValue
  }

  return context
}
