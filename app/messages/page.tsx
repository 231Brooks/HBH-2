import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata-utils"
import MessagesClientPage from "./MessagesClientPage"

export function generateMetadata(): Metadata {
  return baseGenerateMetadata({
    title: "Messages",
    description: "Communicate with clients, agents, and service providers",
    path: "/messages",
    canonicalPath: "/messages", // Explicitly set canonical URL
  })
}

export default function MessagesPage() {
  return <MessagesClientPage />
}
