-- Create test_messages table for real-time testing
CREATE TABLE IF NOT EXISTS public.test_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.test_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (for testing)
CREATE POLICY "Allow all operations for test_messages" 
  ON public.test_messages 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_messages;
