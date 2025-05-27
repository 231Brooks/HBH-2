"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// Basic client-side validation - not as comprehensive as server-side
const clientSideValidateCSS = (css: string): { valid: boolean; issues: string[] } => {
  const issues: string[] = []

  // Check for basic harmful patterns
  if (/@import\s+url\(/i.test(css)) {
    issues.push("CSS contains @import statements which are not allowed")
  }

  if (/expression\s*\(/i.test(css)) {
    issues.push("CSS contains expression() which is not allowed")
  }

  if (/behavior\s*:/i.test(css)) {
    issues.push("CSS contains behavior property which is not allowed")
  }

  if (/url\s*\(\s*["']?\s*(javascript|data|vbscript|file):/i.test(css)) {
    issues.push("CSS contains URLs with potentially harmful protocols")
  }

  // Check for HTML tags
  if (/<\/?[a-z]+[^>]*>/i.test(css)) {
    issues.push("CSS contains HTML tags which may indicate injection attempt")
  }

  // Check for excessive size
  if (css.length > 50000) {
    issues.push("CSS exceeds maximum size of 50KB")
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

interface CSSValidatorProps {
  initialValue?: string
  onSubmit: (css: string) => Promise<{ success: boolean; error?: string; css?: string }>
  context?: "theme" | "component" | "user"
  maxLength?: number
}

export function CSSValidator({ initialValue = "", onSubmit, context = "theme", maxLength = 50000 }: CSSValidatorProps) {
  const [css, setCss] = useState(initialValue)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; issues: string[] } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverResponse, setServerResponse] = useState<{ success: boolean; message: string } | null>(null)

  // Validate on change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (css) {
        const result = clientSideValidateCSS(css)
        setValidationResult(result)
      } else {
        setValidationResult(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [css])

  const handleSubmit = async () => {
    // Client-side validation first
    const clientValidation = clientSideValidateCSS(css)
    if (!clientValidation.valid) {
      setValidationResult(clientValidation)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSubmit(css)

      if (result.success) {
        setServerResponse({
          success: true,
          message: "CSS validated and processed successfully!",
        })
        // If server returned sanitized CSS, update the input
        if (result.css && result.css !== css) {
          setCss(result.css)
        }
      } else {
        setServerResponse({
          success: false,
          message: result.error || "Failed to process CSS",
        })
      }
    } catch (error) {
      setServerResponse({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CSS Editor ({context})</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={css}
          onChange={(e) => setCss(e.target.value)}
          placeholder="Enter your CSS here..."
          className="font-mono min-h-[300px]"
          maxLength={maxLength}
        />

        {validationResult && !validationResult.valid && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {validationResult.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validationResult && validationResult.valid && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">CSS looks valid</AlertTitle>
            <AlertDescription className="text-green-600">
              Basic client-side validation passed. Submit for full server-side validation.
            </AlertDescription>
          </Alert>
        )}

        {serverResponse && (
          <Alert
            className={`mt-4 ${serverResponse.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            {serverResponse.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertTitle className={serverResponse.success ? "text-green-700" : "text-red-700"}>
              {serverResponse.success ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription className={serverResponse.success ? "text-green-600" : "text-red-600"}>
              {serverResponse.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting || (validationResult && !validationResult.valid)}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Validate & Submit"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
