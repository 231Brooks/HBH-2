import { Metadata } from 'next'
import { PortalSidebar } from '@/components/portal/portal-sidebar'
import { PortalHeader } from '@/components/portal/portal-header'
import { PortalAuthGuard } from '@/components/portal/portal-auth-guard'

export const metadata: Metadata = {
  title: 'HBH Portal - Internal Platform',
  description: 'Internal platform for team management, learning, and investments',
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <PortalSidebar />
        <div className="lg:pl-64">
          <PortalHeader />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PortalAuthGuard>
  )
}
