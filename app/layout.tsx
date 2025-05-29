import type React from "react"

export const metadata = {
  title: "Real Estate Platform",
  description: "A minimal real estate platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: "20px", fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  )
}


import './globals.css'