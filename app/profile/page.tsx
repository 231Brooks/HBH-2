import type { Metadata } from "next"
import ProfilePageClient from "./ProfilePageClient"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"

export function generateMetadata(): Metadata {
  return baseGenerateMetadata({
    title: "Your Profile",
    description: "Manage your profile and account settings",
    path: "/profile",
    canonicalPath: "/profile", // Explicitly set canonical URL
    noIndex: true, // Profile pages should typically not be indexed
  })
}

export default function ProfilePage() {
  return <ProfilePageClient />
}
