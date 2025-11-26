-- WhoIn.uk RSVP Lite Database Schema
-- Region: eu-west-2 (London) for GDPR compliance

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  bank_details TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  price_per_adult DECIMAL(10, 2) DEFAULT 0,
  management_key TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add management_key column if table already exists (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'management_key'
  ) THEN
    ALTER TABLE events ADD COLUMN management_key TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');
  END IF;
END $$;

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  adult_count INTEGER DEFAULT 0,
  kid_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event stats table (anonymized data)
CREATE TABLE IF NOT EXISTS event_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  total_guests INTEGER DEFAULT 0,
  total_adults INTEGER DEFAULT 0,
  total_kids INTEGER DEFAULT 0,
  paid_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_stats_event_id ON event_stats(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events (drop if exists, then create)
DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own events" ON events;
CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for guests (public read for event, but only event owner can manage)
DROP POLICY IF EXISTS "Anyone can view guests for an event" ON guests;
CREATE POLICY "Anyone can view guests for an event"
  ON guests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert guests" ON guests;
CREATE POLICY "Anyone can insert guests"
  ON guests FOR INSERT
  WITH CHECK (true);

-- RLS Policies for event_stats (public read)
DROP POLICY IF EXISTS "Anyone can view event stats" ON event_stats;
CREATE POLICY "Anyone can view event stats"
  ON event_stats FOR SELECT
  USING (true);

-- Function to update event_stats when guests are added/updated
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_stats (event_id, total_guests, total_adults, total_kids, paid_count)
  SELECT 
    event_id,
    COUNT(*) as total_guests,
    SUM(adult_count) as total_adults,
    SUM(kid_count) as total_kids,
    COUNT(*) FILTER (WHERE is_paid = true) as paid_count
  FROM guests
  WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
  GROUP BY event_id
  ON CONFLICT (event_id) DO UPDATE SET
    total_guests = EXCLUDED.total_guests,
    total_adults = EXCLUDED.total_adults,
    total_kids = EXCLUDED.total_kids,
    paid_count = EXCLUDED.paid_count,
    created_at = NOW();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats when guests change
DROP TRIGGER IF EXISTS trigger_update_event_stats ON guests;
CREATE TRIGGER trigger_update_event_stats
  AFTER INSERT OR UPDATE OR DELETE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_event_stats();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to delete guest data 30 days after event date (GDPR Data Retention)
-- Note: event_stats are preserved (anonymized data) - only guest personal data is deleted
CREATE OR REPLACE FUNCTION cleanup_expired_guest_data()
RETURNS TABLE(deleted_guests INTEGER) AS $$
DECLARE
  v_deleted_guests INTEGER := 0;
BEGIN
  -- Delete guests for events where event_date + 30 days has passed
  -- event_stats are NOT deleted - they contain anonymized data and are preserved
  WITH expired_events AS (
    SELECT id 
    FROM events 
    WHERE date + INTERVAL '30 days' < NOW()
  )
  DELETE FROM guests
  WHERE event_id IN (SELECT id FROM expired_events);
  
  -- Count deleted guests
  GET DIAGNOSTICS v_deleted_guests = ROW_COUNT;
  
  RETURN QUERY SELECT v_deleted_guests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index to optimize the cleanup query
CREATE INDEX IF NOT EXISTS idx_events_date_cleanup ON events(date) WHERE date + INTERVAL '30 days' < NOW();

