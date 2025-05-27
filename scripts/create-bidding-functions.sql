-- Function to handle accepting a bid in a transaction
CREATE OR REPLACE FUNCTION accept_bid_transaction(p_bid_id UUID, p_property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Update the bid status
  UPDATE bids
  SET status = 'accepted', 
      accepted_at = NOW()
  WHERE id = p_bid_id;
  
  -- Update the property status
  UPDATE properties
  SET status = 'under_contract',
      sold_price = (SELECT amount FROM bids WHERE id = p_bid_id),
      sold_at = NOW(),
      buyer_id = (SELECT user_id FROM bids WHERE id = p_bid_id)
  WHERE id = p_property_id;
  
  -- Reject all other bids for this property
  UPDATE bids
  SET status = 'rejected',
      rejected_at = NOW()
  WHERE property_id = p_property_id
    AND id != p_bid_id
    AND status = 'pending';
  
  -- Create a transaction record
  INSERT INTO transactions (
    property_id,
    bid_id,
    buyer_id,
    seller_id,
    amount,
    status
  )
  SELECT 
    b.property_id,
    b.id,
    b.user_id,
    p.user_id,
    b.amount,
    'initiated'
  FROM bids b
  JOIN properties p ON b.property_id = p.id
  WHERE b.id = p_bid_id
  RETURNING jsonb_build_object(
    'transaction_id', id,
    'property_id', property_id,
    'bid_id', bid_id,
    'amount', amount,
    'status', status
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Function to get property bid history
CREATE OR REPLACE FUNCTION get_property_bid_history(p_property_id UUID)
RETURNS TABLE (
  bid_id UUID,
  user_id UUID,
  amount DECIMAL,
  status TEXT,
  created_at TIMESTAMPTZ,
  user_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.id as bid_id,
    b.user_id,
    b.amount,
    b.status,
    b.created_at,
    u.name as user_name
  FROM bids b
  LEFT JOIN users u ON b.user_id = u.id
  WHERE b.property_id = p_property_id
  ORDER BY b.created_at DESC;
$$;
