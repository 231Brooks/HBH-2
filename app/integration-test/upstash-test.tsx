"use client"

import { useState } from "react"
import { Redis } from "@upstash/redis"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function UpstashTest() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [writeStatus, setWriteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [readStatus, setReadStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [testData, setTestData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize Redis client
  const getRedisClient = () => {
    try {
      return Redis.fromEnv()
    } catch (err: any) {
      console.error("Redis client initialization error:", err)
      setError(err.message || "Failed to initialize Redis client")
      return null
    }
  }

  // Test Redis connection
  const testConnection = async () => {
    setConnectionStatus("loading")
    setError(null)

    try {
      const redis = getRedisClient()
      if (!redis) throw new Error("Failed to initialize Redis client")

      const ping = await redis.ping()
      if (ping !== "PONG") throw new Error("Invalid response from Redis server")

      setConnectionStatus("success")
    } catch (err: any) {
      console.error("Redis connection error:", err)
      setConnectionStatus("error")
      setError(err.message || "Failed to connect to Redis")
    }
  }

  // Write test data
  const writeTestData = async () => {
    setWriteStatus("loading")
    setError(null)

    try {
      const redis = getRedisClient()
      if (!redis) throw new Error("Failed to initialize Redis client")

      const testKey = "integration_test"
      const testValue = {
        message: "Hello from Upstash Redis!",
        timestamp: new Date().toISOString(),
      }

      await redis.set(testKey, JSON.stringify(testValue))

      setWriteStatus("success")
    } catch (err: any) {
      console.error("Write data error:", err)
      setWriteStatus("error")
      setError(err.message || "Failed to write test data")
    }
  }

  // Read test data
  const readTestData = async () => {
    setReadStatus("loading")
    setError(null)

    try {
      const redis = getRedisClient()
      if (!redis) throw new Error("Failed to initialize Redis client")

      const testKey = "integration_test"
      const data = await redis.get(testKey)

      if (!data) throw new Error("No data found")

      setTestData(typeof data === "string" ? JSON.parse(data) : data)
      setReadStatus("success")
    } catch (err: any) {
      console.error("Read data error:", err)
      setReadStatus("error")
      setError(err.message || "Failed to read test data")
    }
  }

  // Delete test data
  const deleteTestData = async () => {
    setDeleteStatus("loading")
    setError(null)

    try {
      const redis = getRedisClient()
      if (!redis) throw new Error("Failed to initialize Redis client")

      const testKey = "integration_test"
      await redis.del(testKey)

      setDeleteStatus("success")
      setTestData(null)
    } catch (err: any) {
      console.error("Delete data error:", err)
      setDeleteStatus("error")
      setError(err.message || "Failed to delete test data")
    }
  }

  // Run all tests
  const runAllTests = async () => {
    await testConnection()
    await writeTestData()
    await readTestData()
    // Don't delete automatically to show the data
  }

  const StatusIcon = ({ status }: { status: "idle" | "loading" | "success" | "error" }) => {
    if (status === "loading") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    if (status === "success") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "error") return <XCircle className="h-5 w-5 text-red-500" />
    return null
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Connection Status:</span>
          <StatusIcon status={connectionStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Write Data:</span>
          <StatusIcon status={writeStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Read Data:</span>
          <StatusIcon status={readStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Delete Data:</span>
          <StatusIcon status={deleteStatus} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {testData && (
        <div className="bg-muted p-3 rounded-md text-sm">
          <div className="font-semibold mb-1">Redis Test Data:</div>
          <pre className="whitespace-pre-wrap overflow-auto max-h-32">{JSON.stringify(testData, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button onClick={runAllTests}>Run All Tests</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={testConnection}>
            Test Connection
          </Button>
          <Button variant="outline" onClick={writeTestData}>
            Write Data
          </Button>
          <Button variant="outline" onClick={readTestData}>
            Read Data
          </Button>
          <Button variant="outline" onClick={deleteTestData}>
            Delete Data
          </Button>
        </div>
      </div>
    </div>
  )
}
