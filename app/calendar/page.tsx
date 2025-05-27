import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"
import { getCanonicalPath } from "@/lib/canonical-utils"
import CalendarClientPage from "./CalendarClientPage"

interface CalendarPageProps {
  searchParams?: {
    month?: string
    year?: string
    view?: string
  }
}

export async function generateMetadata({ searchParams }: CalendarPageProps): Promise<Metadata> {
  // For calendar, we might want to include month/year in canonical URL but exclude view
  const canonicalPath = getCanonicalPath("/calendar", searchParams, ["view"])

  return baseGenerateMetadata({
    title: "Calendar",
    description: "Manage your real estate appointments and schedule",
    path: "/calendar",
    canonicalPath,
  })
}

export default function CalendarPage() {
  return <CalendarClientPage />
}
