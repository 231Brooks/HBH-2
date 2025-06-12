import { ProtectedRoute } from "@/components/protected-route"
import CalendarClient from "./calendar-client"

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarClient />
    </ProtectedRoute>
  )
}
