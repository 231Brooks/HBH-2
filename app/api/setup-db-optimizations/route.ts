import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import { setupDatabaseMonitoring } from "@/lib/db-monitoring"
import { setupBackupSystem } from "@/lib/db-backup"

const ADD_INDEXES_SQL = `
-- Property indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON "Property"(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON "Property"(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON "Property"(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON "Property"(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_beds_baths ON "Property"(beds, baths);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON "Property"("createdAt");

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_status ON "Transaction"(status);
CREATE INDEX IF NOT EXISTS idx_transactions_property ON "Transaction"("propertyId");
CREATE INDEX IF NOT EXISTS idx_transactions_creator ON "Transaction"("creatorId");
CREATE INDEX IF NOT EXISTS idx_transactions_closing_date ON "Transaction"("closingDate");

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON "Message"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_messages_sender ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS idx_messages_read ON "Message"(read);
`

const EFFICIENT_QUERIES_SQL = `
-- Efficient property search function
CREATE OR REPLACE FUNCTION search_properties(
  p_min_price DECIMAL = NULL,
  p_max_price DECIMAL = NULL,
  p_beds INT = NULL,
  p_baths FLOAT = NULL,
  p_property_type TEXT = NULL,
  p_city TEXT = NULL,
  p_state TEXT = NULL,
  p_limit INT = 20,
  p_offset INT = 0
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  price DECIMAL,
  beds INT,
  baths FLOAT,
  sqft INT,
  address TEXT,
  city TEXT,
  state TEXT,
  type TEXT,
  status TEXT,
  created_at TIMESTAMP,
  image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.beds,
    p.baths,
    p.sqft,
    p.address,
    p.city,
    p.state,
    p.type::TEXT,
    p.status::TEXT,
    p."createdAt",
    (SELECT url FROM "PropertyImage" WHERE "propertyId" = p.id AND "isPrimary" = true LIMIT 1) as image_url
  FROM "Property" p
  WHERE
    (p_min_price IS NULL OR p.price >= p_min_price) AND
    (p_max_price IS NULL OR p.price <= p_max_price) AND
    (p_beds IS NULL OR p.beds >= p_beds) AND
    (p_baths IS NULL OR p.baths >= p_baths) AND
    (p_property_type IS NULL OR p.type::TEXT = p_property_type) AND
    (p_city IS NULL OR p.city ILIKE '%' || p_city || '%') AND
    (p_state IS NULL OR p.state = p_state)
  ORDER BY p."createdAt" DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
`

export async function POST(request: Request) {
  try {
    // Verify API key for security
    const headersList = headers()
    const apiKey = headersList.get("x-api-key")

    // Use the non-public version of the API key
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Add indexes
    const { error: indexError } = await supabase.rpc("exec_sql", { sql: ADD_INDEXES_SQL })
    if (indexError) throw indexError

    // 2. Add efficient query functions
    const { error: queryError } = await supabase.rpc("exec_sql", { sql: EFFICIENT_QUERIES_SQL })
    if (queryError) throw queryError

    // 3. Setup database monitoring
    const { success: monitoringSuccess, error: monitoringError } = await setupDatabaseMonitoring()
    if (!monitoringSuccess) throw new Error(monitoringError)

    // 4. Setup backup system
    const { success: backupSuccess, error: backupError } = await setupBackupSystem()
    if (!backupSuccess) throw new Error(backupError)

    return NextResponse.json({
      success: true,
      message: "Database optimizations have been successfully applied",
    })
  } catch (error: any) {
    console.error("Failed to apply database optimizations:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
