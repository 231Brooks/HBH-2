import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSecurityLogs } from "@/lib/security-logger"
import SecurityDashboard from "./security-dashboard"

export default async function SecurityPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/profile/security")
  }

  const securityLogs = await getSecurityLogs(session.user.id)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Account Security</h1>
      <SecurityDashboard userId={session.user.id} initialLogs={securityLogs} />
    </div>
  )
}
