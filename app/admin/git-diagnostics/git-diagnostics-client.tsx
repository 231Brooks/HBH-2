"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, GitBranch, GitCommit } from "lucide-react"

export default function GitDiagnosticsClient() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/git-diagnostics")

      if (!response.ok) {
        throw new Error(`Error fetching diagnostics: ${response.status}`)
      }

      const data = await response.json()
      setDiagnostics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error fetching diagnostics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-500">Running diagnostics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error running diagnostics</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!diagnostics) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>No diagnostic data available</AlertTitle>
        <AlertDescription>Unable to retrieve diagnostic information.</AlertDescription>
      </Alert>
    )
  }

  const { git, deployment, potentialIssues, summary } = diagnostics

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Diagnostic Summary</span>
            <Button size="sm" onClick={fetchDiagnostics} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </CardTitle>
          <CardDescription>Last updated: {new Date(diagnostics.timestamp).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {summary.gitIssues ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span>Git Configuration: {summary.gitIssues ? "Issues Detected" : "OK"}</span>
            </div>
            <div className="flex items-center gap-2">
              {summary.configIssues ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span>Project Configuration: {summary.configIssues ? "Issues Detected" : "OK"}</span>
            </div>
            <div className="flex items-center gap-2">
              {summary.buildIssues ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span>Build Output: {summary.buildIssues ? "Issues Detected" : "OK"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Potential Issues */}
      {potentialIssues && potentialIssues.length > 0 && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Potential Issues Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {potentialIssues.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Diagnostics */}
      <Tabs defaultValue="git">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="git">Git Configuration</TabsTrigger>
          <TabsTrigger value="deployment">Deployment Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="git" className="space-y-6">
          {/* Git Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Git Repository Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!git.status.isRepo ? (
                <Alert variant="destructive">
                  <AlertTitle>Not a Git Repository</AlertTitle>
                  <AlertDescription>
                    {git.status.error || "This directory is not a Git repository or Git is not installed."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Current Branch</p>
                      <p className="text-sm text-gray-500">{git.status.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Remote Status</p>
                      <p className="text-sm text-gray-500">
                        {git.status.remoteStatus.connected ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Connected to {git.status.remoteStatus.url}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            Not connected to a remote repository
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {git.status.lastCommit && (
                    <div>
                      <p className="text-sm font-medium">Last Commit</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <GitCommit className="h-4 w-4" />
                        <span className="font-mono">{git.status.lastCommit.hash.substring(0, 7)}</span>
                        <span>{git.status.lastCommit.message}</span>
                        <span className="text-xs">
                          by {git.status.lastCommit.author} on{" "}
                          {new Date(git.status.lastCommit.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium">Uncommitted Changes</p>
                    {git.status.uncommittedChanges.length === 0 ? (
                      <p className="text-sm text-gray-500">No uncommitted changes</p>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          {git.status.uncommittedChanges.length} uncommitted changes:
                        </p>
                        <ul className="text-sm text-gray-500 list-disc pl-5 max-h-40 overflow-y-auto">
                          {git.status.uncommittedChanges.map((change: string, index: number) => (
                            <li key={index} className="font-mono text-xs">
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Git Configuration</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">User Name:</span> {git.status.config?.user.name || "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">User Email:</span> {git.status.config?.user.email || "Not set"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Git Hooks */}
          <Card>
            <CardHeader>
              <CardTitle>Git Hooks</CardTitle>
            </CardHeader>
            <CardContent>
              {!git.hooks.hooksExist ? (
                <Alert>
                  <AlertTitle>Git Hooks Not Found</AlertTitle>
                  <AlertDescription>{git.hooks.errors?.[0] || "Git hooks directory not found."}</AlertDescription>
                </Alert>
              ) : (
                <div>
                  <p className="text-sm mb-2">Git hooks permissions:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(git.hooks.permissions).map(([hook, permission]) => (
                      <Badge key={hook} variant={permission === "executable" ? "default" : "outline"}>
                        {hook}: {permission}
                      </Badge>
                    ))}
                  </div>

                  {git.hooks.errors && git.hooks.errors.length > 0 && (
                    <Alert variant="warning" className="mt-4">
                      <AlertTitle>Hook Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {git.hooks.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Git LFS */}
          <Card>
            <CardHeader>
              <CardTitle>Git LFS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Installed:</span>
                  {git.lfs.installed ? <Badge variant="success">Yes</Badge> : <Badge variant="destructive">No</Badge>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Configured:</span>
                  {git.lfs.configured ? <Badge variant="success">Yes</Badge> : <Badge variant="destructive">No</Badge>}
                </div>

                {git.lfs.trackedExtensions && git.lfs.trackedExtensions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Tracked Extensions:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {git.lfs.trackedExtensions.map((ext: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {git.lfs.error && (
                  <Alert variant="warning">
                    <AlertDescription>{git.lfs.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Git Ignore */}
          <Card>
            <CardHeader>
              <CardTitle>.gitignore</CardTitle>
            </CardHeader>
            <CardContent>
              {!git.ignore.exists ? (
                <Alert variant="destructive">
                  <AlertTitle>.gitignore Not Found</AlertTitle>
                  <AlertDescription>No .gitignore file found in the repository.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">node_modules ignored:</span>
                      {git.ignore.nodeModulesIgnored ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Build output ignored:</span>
                      {git.ignore.buildOutputIgnored ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Env files ignored:</span>
                      {git.ignore.envFilesIgnored ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {git.ignore.suggestions && git.ignore.suggestions.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Suggestions</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {git.ignore.suggestions.map((suggestion: string, index: number) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion type="single" collapsible>
                    <AccordionItem value="gitignore-content">
                      <AccordionTrigger>View .gitignore content</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">{git.ignore.content}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          {/* Vercel Config */}
          <Card>
            <CardHeader>
              <CardTitle>Vercel Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {!deployment.vercelConfig.exists ? (
                <Alert>
                  <AlertTitle>vercel.json Not Found</AlertTitle>
                  <AlertDescription>
                    No vercel.json configuration file found. This is not required but can be useful for custom
                    configurations.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Configuration Valid:</span>
                    {deployment.vercelConfig.valid ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </div>

                  {deployment.vercelConfig.issues && deployment.vercelConfig.issues.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Configuration Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {deployment.vercelConfig.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion type="single" collapsible>
                    <AccordionItem value="vercel-config-content">
                      <AccordionTrigger>View vercel.json content</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                          {JSON.stringify(deployment.vercelConfig.content, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package.json */}
          <Card>
            <CardHeader>
              <CardTitle>package.json</CardTitle>
            </CardHeader>
            <CardContent>
              {!deployment.packageJson.exists ? (
                <Alert variant="destructive">
                  <AlertTitle>package.json Not Found</AlertTitle>
                  <AlertDescription>
                    No package.json file found. This is required for Node.js projects.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Scripts:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(deployment.packageJson.scripts || {}).map(([name, script]) => (
                        <div key={name} className="flex items-center gap-2">
                          <Badge variant="outline">{name}</Badge>
                          <span className="text-xs text-gray-500 font-mono truncate">{script}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {deployment.packageJson.issues && deployment.packageJson.issues.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Package.json Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {deployment.packageJson.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next.js Config */}
          <Card>
            <CardHeader>
              <CardTitle>Next.js Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {!deployment.nextConfig.exists ? (
                <Alert variant="warning">
                  <AlertTitle>Next.js Config Not Found</AlertTitle>
                  <AlertDescription>
                    No next.config.js or next.config.mjs file found. This might be fine for simple projects.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Configuration Valid:</span>
                    {deployment.nextConfig.valid ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </div>

                  {deployment.nextConfig.issues && deployment.nextConfig.issues.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Configuration Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {deployment.nextConfig.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion type="single" collapsible>
                    <AccordionItem value="next-config-content">
                      <AccordionTrigger>View Next.js config content</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                          {deployment.nextConfig.content}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Build Output */}
          <Card>
            <CardHeader>
              <CardTitle>Build Output</CardTitle>
            </CardHeader>
            <CardContent>
              {!deployment.buildOutput.exists ? (
                <Alert variant="warning">
                  <AlertTitle>Build Output Not Found</AlertTitle>
                  <AlertDescription>
                    No .next directory found. The project may not have been built yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Size:</p>
                      <p className="text-sm text-gray-500">
                        {(deployment.buildOutput.size! / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Files:</p>
                      <p className="text-sm text-gray-500">{deployment.buildOutput.files}</p>
                    </div>
                  </div>

                  {deployment.buildOutput.issues && deployment.buildOutput.issues.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Build Output Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {deployment.buildOutput.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Node Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Node Modules</CardTitle>
            </CardHeader>
            <CardContent>
              {!deployment.nodeModules.exists ? (
                <Alert variant="destructive">
                  <AlertTitle>Node Modules Not Found</AlertTitle>
                  <AlertDescription>
                    No node_modules directory found. Dependencies may not be installed.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Size:</p>
                    <p className="text-sm text-gray-500">
                      {(deployment.nodeModules.size! / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {deployment.nodeModules.issues && deployment.nodeModules.issues.length > 0 && (
                    <Alert variant="warning">
                      <AlertTitle>Node Modules Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5">
                          {deployment.nodeModules.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
