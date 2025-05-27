"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"

type User = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || "USER",
      })
    } else {
      setUser(null)
    }
  }, [session])

  const value = {
    user,
    isLoading: status === "loading",
    isAuthenticated: !!user,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
