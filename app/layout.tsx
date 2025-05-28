import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Real Estate Platform",
  description: "A real estate platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
