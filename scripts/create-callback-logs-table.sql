-- Create callback logs table
CREATE TABLE IF NOT EXISTS callback_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS callback_logs_created_at_idx ON callback_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS callback_logs_endpoint_idx ON callback_logs (endpoint);
CREATE INDEX IF NOT EXISTS callback_logs_status_code_idx ON callback_logs (status_code);
