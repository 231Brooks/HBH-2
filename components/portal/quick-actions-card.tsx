'use client'

import Link from 'next/link'
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Start Learning',
    description: 'Continue your courses',
    href: '/portal/learning',
    icon: AcademicCapIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'View Team',
    description: 'Check team performance',
    href: '/portal/teams',
    icon: UserGroupIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Investments',
    description: 'Manage your investments',
    href: '/portal/investments',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'View KPIs',
    description: 'Track your metrics',
    href: '/portal/kpis',
    icon: ChartBarIcon,
    color: 'bg-purple-500',
  },
]

export function QuickActionsCard() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <span className="absolute inset-0" />
                  {action.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
