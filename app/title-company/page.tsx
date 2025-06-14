import { auth } from "@/lib/auth"
import { getUserPermissions } from "@/lib/user-roles"
import TitleCompanyDashboard from "@/components/title-company-dashboard"
import { ProtectedRoute } from "@/components/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default async function TitleCompanyPage() {
  const session = await auth()
  const userRole = session?.user?.role || 'USER'
  const permissions = getUserPermissions(userRole as any)

  // Check if user has title company permissions
  if (!permissions.canAccessTitleCompany && userRole !== 'TITLE_COMPANY') {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <Alert className="border-destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You need title company permissions to access this page. Please contact your administrator.
            </AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <TitleCompanyDashboard />
    </ProtectedRoute>
  )
}
