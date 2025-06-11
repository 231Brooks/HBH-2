import { Suspense } from "react"
import GitDiagnosticsClient from "./git-diagnostics-client"

export const metadata = {
  title: "Git & Deployment Diagnostics",
  description: "Diagnose issues with Git and deployment configuration",
}

export default function GitDiagnosticsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Git & Deployment Diagnostics</h1>
      <p className="text-gray-600 mb-8">
        This tool diagnoses issues with Git configuration, repository permissions, and deployment processes.
      </p>

      <Suspense fallback={<div className="text-center py-12">Loading diagnostics...</div>}>
        <GitDiagnosticsClient />
      </Suspense>
    </div>
  )
}
