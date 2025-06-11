import { type NextRequest, NextResponse } from "next/server"
import { sanitizeCSS, validateCSS } from "@/lib/css-sanitizer"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { css, context = "theme" } = body

    // Validate input
    if (!css || typeof css !== "string") {
      return NextResponse.json({ success: false, error: "Invalid CSS input" }, { status: 400 })
    }

    // Set options based on context
    const options = {
      maxSize: context === "theme" ? 50000 : 25000, // 50KB for themes, 25KB for others
      allowImports: false,
      allowFontFace: context === "theme",
      allowKeyframes: true,
      allowCustomProperties: true,
      allowedDomains: process.env.ALLOWED_CSS_DOMAINS
        ? process.env.ALLOWED_CSS_DOMAINS.split(",").map((d) => d.trim())
        : [],
      strictValidation: context === "property" || context === "component",
    }

    // Validate CSS
    const validation = validateCSS(css, options)

    // If validation fails and we're in strict mode, reject
    if (!validation.isValid && options.strictValidation) {
      return NextResponse.json(
        {
          success: false,
          error: "CSS validation failed",
          details: validation.reasons,
        },
        { status: 400 },
      )
    }

    // Sanitize CSS
    const sanitized = sanitizeCSS(css, options)

    // Return the sanitized CSS
    return NextResponse.json({
      success: true,
      css: sanitized,
      sanitized: css !== sanitized,
      originalSize: css.length,
      sanitizedSize: sanitized.length,
      removedPatterns: validation.reasons,
    })
  } catch (error) {
    console.error("Error processing CSS:", error)
    return NextResponse.json({ success: false, error: "Failed to process CSS" }, { status: 500 })
  }
}
