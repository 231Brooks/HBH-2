import { ProtectedRoute } from "@/components/protected-route"
import { ErrorBoundary } from "@/components/error-boundary"
import CalendarClient from "./calendar-client"

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <CalendarClient />
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
