"use client"

import { CSSValidator } from "@/components/css-editor/css-validator"

export default function ThemeEditorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Custom Theme Editor</h1>
      <p className="mb-6 text-gray-600">
        Customize your experience by adding custom CSS. Your CSS will be validated and sanitized for security.
      </p>

      <CSSValidator
        initialValue={`/* Add your custom CSS here */
.my-custom-header {
  background-color: #f0f4f8;
  padding: 1rem;
  border-radius: 0.5rem;
}

.my-custom-button {
  background-color: #4a5568;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.my-custom-button:hover {
  background-color: #2d3748;
}
`}
        onSubmit={async (css) => {
          // Submit to the API
          const response = await fetch("/api/user-css", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ css, context: "theme" }),
          })

          const data = await response.json()
          return data
        }}
        context="theme"
        maxLength={100000}
      />
    </div>
  )
}
