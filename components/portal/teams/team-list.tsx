'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MapPin, TrendingUp } from "lucide-react"

const mockTeams = [
  {
    id: '1',
    name: 'Sales Team Atlanta',
    location: 'Atlanta, GA',
    type: 'Sales',
    memberCount: 8,
    leader: {
      name: 'John Smith',
      avatar: null
    },
    performance: 'Excellent',
    goals: 5
  },
  {
    id: '2',
    name: 'Marketing Team',
    location: 'Remote',
    type: 'Marketing',
    memberCount: 6,
    leader: {
      name: 'Sarah Johnson',
      avatar: null
    },
    performance: 'Good',
    goals: 3
  },
  {
    id: '3',
    name: 'Operations Miami',
    location: 'Miami, FL',
    type: 'Operations',
    memberCount: 12,
    leader: {
      name: 'Mike Davis',
      avatar: null
    },
    performance: 'Good',
    goals: 7
  }
]

export function TeamList() {
  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case 'Good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case 'Needs Improvement':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>
      default:
        return <Badge variant="secondary">{performance}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {mockTeams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{team.name}</CardTitle>
              {getPerformanceBadge(team.performance)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {team.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {team.memberCount} members
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Team Leader</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={team.leader.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {team.leader.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{team.leader.name}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Active Goals</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{team.goals} goals</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
