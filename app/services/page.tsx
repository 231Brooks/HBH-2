import ServicesClient from "./services-client"
import ProfessionalDashboard from "./professional-dashboard"
import { auth } from "@/lib/auth"
import { getUserPermissions } from "@/lib/user-roles"

export default async function ServicesPage() {
  const session = await auth()
  const userRole = session?.user?.role || 'USER'
  const permissions = getUserPermissions(userRole as any)

  // Show professional dashboard for professionals, regular services for others
  if (permissions.canAccessProfessionalDashboard) {
    return <ProfessionalDashboard />
  }

  return <ServicesClient />
}
