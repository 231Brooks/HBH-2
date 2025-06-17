'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UserGroupIcon, 
  MapPinIcon, 
  ChartBarIcon,
  FlagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

interface Team {
  id: string
  name: string
  description?: string
  location: string
  type: string
  leader: {
    id: string
    name: string
    image?: string
    email: string
  }
  _count: {
    members: number
    kpis: number
    goals: number
  }
}

const teamTypes = ['All', 'SALES', 'OPERATIONS', 'MARKETING', 'DEVELOPMENT', 'SUPPORT', 'MANAGEMENT']

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  useEffect(() => {
    loadTeams()
  }, [selectedType])

  const loadTeams = async () => {
    try {
      const params = new URLSearchParams({
        includeMembers: 'false',
        ...(selectedType !== 'All' && { type: selectedType }),
      })

      const response = await fetch(`/api/portal/teams?${params}`)
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Failed to load teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTeamType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'bg-green-100 text-green-800'
      case 'OPERATIONS': return 'bg-blue-100 text-blue-800'
      case 'MARKETING': return 'bg-purple-100 text-purple-800'
      case 'DEVELOPMENT': return 'bg-orange-100 text-orange-800'
      case 'SUPPORT': return 'bg-yellow-100 text-yellow-800'
      case 'MANAGEMENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {teamTypes.map(type => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Types' : formatTeamType(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teams List */}
      <div className="p-6">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamCard({ team }: { team: Team }) {
  const formatTeamType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'bg-green-100 text-green-800'
      case 'OPERATIONS': return 'bg-blue-100 text-blue-800'
      case 'MARKETING': return 'bg-purple-100 text-purple-800'
      case 'DEVELOPMENT': return 'bg-orange-100 text-orange-800'
      case 'SUPPORT': return 'bg-yellow-100 text-yellow-800'
      case 'MANAGEMENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(team.type)}`}>
              {formatTeamType(team.type)}
            </span>
          </div>
          
          {team.description && (
            <p className="mt-1 text-sm text-gray-600">{team.description}</p>
          )}

          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {team.location}
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              {team._count.members} members
            </div>
            <div className="flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              {team._count.kpis} KPIs
            </div>
            <div className="flex items-center">
              <FlagIcon className="h-4 w-4 mr-1" />
              {team._count.goals} goals
            </div>
          </div>

          <div className="mt-3 flex items-center">
            <img
              src={team.leader.image || '/placeholder-user.jpg'}
              alt={team.leader.name}
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">
              Led by {team.leader.name}
            </span>
          </div>
        </div>

        <div className="ml-6">
          <Link href={`/portal/teams/${team.id}`}>
            <Button>View Team</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
