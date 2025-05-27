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

-- Efficient user search function with rating calculation
CREATE OR REPLACE FUNCTION search_professionals(
  p_role TEXT = 'PROFESSIONAL',
  p_min_rating FLOAT = NULL,
  p_location TEXT = NULL,
  p_service_category TEXT = NULL,
  p_verified_only BOOLEAN = false,
  p_limit INT = 20,
  p_offset INT = 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  image TEXT,
  location TEXT,
  role TEXT,
  rating FLOAT,
  review_count INT,
  verified BOOLEAN,
  service_categories TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.image,
    u.location,
    u.role::TEXT,
    u.rating,
    u."reviewCount",
    (u."emailVerified" AND u."identityVerified") as verified,
    array_agg(DISTINCT s.category::TEXT) as service_categories
  FROM "User" u
  LEFT JOIN "Service" s ON s."providerId" = u.id
  WHERE 
    u.role::TEXT = p_role AND
    (p_min_rating IS NULL OR u.rating >= p_min_rating) AND
    (p_location IS NULL OR u.location ILIKE '%' || p_location || '%') AND
    (p_service_category IS NULL OR s.category::TEXT = p_service_category) AND
    (NOT p_verified_only OR (u."emailVerified" AND u."identityVerified"))
  GROUP BY u.id
  ORDER BY u.rating DESC NULLS LAST, u."reviewCount" DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to efficiently get conversation with last message
CREATE OR REPLACE FUNCTION get_user_conversations(
  p_user_id TEXT,
  p_limit INT = 20,
  p_offset INT = 0
)
RETURNS TABLE (
  conversation_id TEXT,
  last_message_content TEXT,
  last_message_time TIMESTAMP,
  other_user_id TEXT,
  other_user_name TEXT,
  other_user_image TEXT,
  unread_count INT
) AS $$
BEGIN
  RETURN QUERY
  WITH last_messages AS (
    SELECT DISTINCT ON (m."conversationId")
      m."conversationId",
      m.content,
      m."createdAt",
      CASE WHEN m."senderId" = p_user_id THEN m."receiverId" ELSE m."senderId" END as other_user_id
    FROM "Message" m
    WHERE m."senderId" = p_user_id OR m."receiverId" = p_user_id
    ORDER BY m."conversationId", m."createdAt" DESC
  ),
  unread_counts AS (
    SELECT 
      m."conversationId",
      COUNT(*) as unread
    FROM "Message" m
    WHERE 
      m."receiverId" = p_user_id AND
      m.read = false
    GROUP BY m."conversationId"
  )
  SELECT 
    lm."conversationId",
    lm.content,
    lm."createdAt",
    lm.other_user_id,
    u.name,
    u.image,
    COALESCE(uc.unread, 0) as unread_count
  FROM last_messages lm
  JOIN "User" u ON u.id = lm.other_user_id
  LEFT JOIN unread_counts uc ON uc."conversationId" = lm."conversationId"
  ORDER BY lm."createdAt" DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get property stats efficiently
CREATE OR REPLACE FUNCTION get_property_stats()
RETURNS TABLE (
  total_properties INT,
  total_for_sale INT,
  total_pending INT,
  total_sold INT,
  avg_price DECIMAL,
  min_price DECIMAL,
  max_price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INT as total_properties,
    SUM(CASE WHEN status = 'FOR_SALE' THEN 1 ELSE 0 END)::INT as total_for_sale,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END)::INT as total_pending,
    SUM(CASE WHEN status = 'SOLD' THEN 1 ELSE 0 END)::INT as total_sold,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
  FROM "Property";
END;
$$ LANGUAGE plpgsql;
