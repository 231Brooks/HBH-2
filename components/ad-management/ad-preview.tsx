"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface AdPreviewProps {
  ad: {
    slotId: string
    content: string
    imageUrl: string
    linkUrl: string
  }
}

export function AdPreview({ ad }: AdPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState("")

  useEffect(() => {
    // Process the content to replace placeholders
    let processedContent = ad.content

    if (ad.imageUrl) {
      processedContent = processedContent.replace(/\{imageUrl\}/g, ad.imageUrl)
    }

    if (ad.linkUrl) {
      processedContent = processedContent.replace(/\{linkUrl\}/g, ad.linkUrl)
    }

    setPreviewHtml(processedContent)
  }, [ad])

  // Determine preview dimensions based on slot
  const getDimensions = () => {
    if (ad.slotId.startsWith("header")) {
      return { width: "100%", height: "90px" }
    } else if (ad.slotId.startsWith("sidebar")) {
      return { width: "300px", height: "250px" }
    } else if (ad.slotId.startsWith("in-feed")) {
      return { width: "100%", height: "120px" }
    } else if (ad.slotId.startsWith("footer")) {
      return { width: "100%", height: "100px" }
    }
    return { width: "100%", height: "250px" }
  }

  const { width, height } = getDimensions()

  // If no content, show a default preview
  if (!previewHtml && !ad.imageUrl) {
    return (
      <Card className="flex items-center justify-center bg-slate-50 border-dashed" style={{ width, height }}>
        <div className="text-center text-slate-400 p-4">
          <p>Ad Preview</p>
          <p className="text-xs">{ad.slotId}</p>
        </div>
      </Card>
    )
  }

  // If only image URL is provided, show the image
  if (!previewHtml && ad.imageUrl) {
    return (
      <Card className="overflow-hidden" style={{ width, height }}>
        {ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img src={ad.imageUrl || "/placeholder.svg"} alt="Ad Preview" className="w-full h-full object-cover" />
          </a>
        ) : (
          <img src={ad.imageUrl || "/placeholder.svg"} alt="Ad Preview" className="w-full h-full object-cover" />
        )}
      </Card>
    )
  }

  // Otherwise, render the HTML content
  return (
    <Card className="overflow-hidden" style={{ width, height }}>
      <div dangerouslySetInnerHTML={{ __html: previewHtml }} className="w-full h-full" />
    </Card>
  )
}
