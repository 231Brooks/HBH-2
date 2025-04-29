"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock successful login
      setUser({
        id: "user-1",
        name: "Demo User",
        email: email,
        image: "/placeholder.jpg",
      })
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
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Mock successful registration
      setUser({
        id: "user-" + Date.now(),
        name,
        email,
        image: "/placeholder.jpg",
      })
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
