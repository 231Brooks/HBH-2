"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatarWithPresence } from "./user-avatar-with-presence"
import { useGetPresence } from "@/lib/presence"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"

type User = {
  id: string
  name: string
  avatar_url?: string
  email?: string
}

export function UsersListWithPresence() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { isUserOnline } = useGetPresence()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("users").select("*")

        if (error) {
          throw error
        }

        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Sort users by online status
  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = isUserOnline(a.id)
    const bOnline = isUserOnline(b.id)

    if (aOnline && !bOnline) return -1
    if (!aOnline && bOnline) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <UserAvatarWithPresence userId={user.id} userName={user.name} userAvatar={user.avatar_url} />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{isUserOnline(user.id) ? "Online" : "Offline"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
