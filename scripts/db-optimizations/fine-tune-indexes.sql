-- Fine-tune indexes based on query patterns

-- 1. Add composite index for common property search patterns
CREATE INDEX IF NOT EXISTS idx_properties_price_beds_baths ON "Property"(price, beds, baths);

-- 2. Add composite index for location-based searches with price
CREATE INDEX IF NOT EXISTS idx_properties_location_price ON "Property"(city, state, price);

-- 3. Add index for full-text search on property title and description
CREATE INDEX IF NOT EXISTS idx_properties_text_search ON "Property" USING gin(to_tsvector('english', title || ' ' || description));

-- 4. Add index for date range queries on transactions
CREATE INDEX IF NOT EXISTS idx_transactions_date_range ON "Transaction"(createdAt, updatedAt);

-- 5. Add index for user activity tracking
CREATE INDEX IF NOT EXISTS idx_user_last_active ON "User"(lastActive);

-- 6. Add index for message search
CREATE INDEX IF NOT EXISTS idx_messages_content ON "Message" USING gin(to_tsvector('english', content));

-- 7. Add partial index for active listings only
CREATE INDEX IF NOT EXISTS idx_active_properties ON "Property"(createdAt) 
WHERE status = 'ACTIVE';

-- 8. Add partial index for featured properties
CREATE INDEX IF NOT EXISTS idx_featured_properties ON "Property"(createdAt)
WHERE featured = true;

-- 9. Add index for price range queries with sorting
CREATE INDEX IF NOT EXISTS idx_properties_price_created ON "Property"(price, createdAt DESC);

-- 10. Add index for geospatial queries (if PostGIS is available)
-- Uncomment if PostGIS is installed
-- CREATE INDEX IF NOT EXISTS idx_properties_location_geo ON "Property" USING GIST(coordinates);

-- 11. Drop unused or low-impact indexes to reduce overhead
-- Only uncomment after confirming these are truly unused
-- DROP INDEX IF EXISTS idx_properties_location;
-- DROP INDEX IF EXISTS idx_services_verified;
