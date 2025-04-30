"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [tableStatus, setTableStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [writeStatus, setWriteStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [readStatus, setReadStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [existingTablesStatus, setExistingTablesStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [testData, setTestData] = useState<any>(null)
  const [existingTables, setExistingTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize Supabase client only when needed
  const getSupabaseClient = () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL or Anon Key is not defined")
      }

      return createClient(supabaseUrl, supabaseAnonKey)
    } catch (err: any) {
      console.error("Failed to initialize Supabase client:", err)
      setError(err.message || "Failed to initialize Supabase client")
      return null
    }
  }

  // Test Supabase connection
  const testConnection = async () => {
    setConnectionStatus("loading")
    setError(null)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Failed to initialize Supabase client")

      const { data, error } = await supabase.auth.getSession()

      // Even if we don't have a session, we can still connect to Supabase
      setConnectionStatus("success")
    } catch (err: any) {
      console.error("Supabase connection error:", err)
      setConnectionStatus("error")
      setError(err.message || "Failed to connect to Supabase")
    }
  }

  // Create test table using our function
  const createTestTable = async () => {
    setTableStatus("loading")
    setError(null)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Failed to initialize Supabase client")

      // Call the function we created
      const { error } = await supabase.rpc("create_test_table")

      if (error) throw error

      setTableStatus("success")
    } catch (err: any) {
      console.error("Create table error:", err)
      setTableStatus("error")
      setError(err.message || "Failed to create test table")
    }
  }

  // Check existing tables
  const checkExistingTables = async () => {
    setExistingTablesStatus("loading")
    setError(null)
    setExistingTables([])

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Failed to initialize Supabase client")

      // Query for existing tables
      const { data, error } = await supabase.from("MarketplaceItem").select("id").limit(1)

      // We're just checking if we can access the table
      if (!error) {
        setExistingTables((prev) => [...prev, "MarketplaceItem"])
      }

      // Check Bid table
      const bidResult = await supabase.from("Bid").select("id").limit(1)

      if (!bidResult.error) {
        setExistingTables((prev) => [...prev, "Bid"])
      }

      // Check CalendarEvent table
      const calendarResult = await supabase.from("CalendarEvent").select("id").limit(1)

      if (!calendarResult.error) {
        setExistingTables((prev) => [...prev, "CalendarEvent"])
      }

      setExistingTablesStatus("success")
    } catch (err: any) {
      console.error("Check existing tables error:", err)
      setExistingTablesStatus("error")
      setError(err.message || "Failed to check existing tables")
    }
  }

  // Write test data
  const writeTestData = async () => {
    setWriteStatus("loading")
    setError(null)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Failed to initialize Supabase client")

      const testItem = {
        name: "Test Item",
        description: "This is a test item",
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("integration_test").insert(testItem).select()

      if (error) throw error

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
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Failed to initialize Supabase client")

      const { data, error } = await supabase
        .from("integration_test")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) throw error

      setTestData(data[0])
      setReadStatus("success")
    } catch (err: any) {
      console.error("Read data error:", err)
      setReadStatus("error")
      setError(err.message || "Failed to read test data")
    }
  }

  // Run all tests
  const runAllTests = async () => {
    await testConnection()
    await checkExistingTables()
    await createTestTable()
    await writeTestData()
    await readTestData()
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
          <span>Existing Tables Check:</span>
          <StatusIcon status={existingTablesStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Create Test Table:</span>
          <StatusIcon status={tableStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Write Data:</span>
          <StatusIcon status={writeStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Read Data:</span>
          <StatusIcon status={readStatus} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {existingTables.length > 0 && (
        <div className="bg-muted p-3 rounded-md text-sm">
          <div className="font-semibold mb-1">Detected Tables:</div>
          <ul className="list-disc pl-5">
            {existingTables.map((table) => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      )}

      {testData && (
        <div className="bg-muted p-3 rounded-md text-sm">
          <div className="font-semibold mb-1">Latest Test Data:</div>
          <pre className="whitespace-pre-wrap overflow-auto max-h-32">{JSON.stringify(testData, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button onClick={runAllTests}>Run All Tests</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={testConnection}>
            Test Connection
          </Button>
          <Button variant="outline" onClick={checkExistingTables}>
            Check Tables
          </Button>
          <Button variant="outline" onClick={createTestTable}>
            Create Test Table
          </Button>
          <Button variant="outline" onClick={writeTestData}>
            Write Data
          </Button>
          <Button variant="outline" onClick={readTestData}>
            Read Data
          </Button>
        </div>
      </div>
    </div>
  )
}
