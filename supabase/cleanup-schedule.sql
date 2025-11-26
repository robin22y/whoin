-- WhoIn.uk - Automatic Data Cleanup Schedule
-- 
-- OPTION 1: Using pg_cron (if available on your Supabase plan)
-- 
-- Step 1: Enable pg_cron extension
-- Go to Supabase Dashboard → Database → Extensions
-- Search for "pg_cron" and click "Enable"
-- 
-- Step 2: After enabling, run the schedule command below:

-- Enable pg_cron extension first (run this if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup at 2 AM UTC (adjust timezone as needed)
-- This will delete guest data for events where event_date + 30 days has passed
SELECT cron.schedule(
  'cleanup-expired-guest-data',
  '0 2 * * *', -- Runs daily at 2:00 AM UTC
  $$SELECT cleanup_expired_guest_data();$$
);

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule (if needed):
-- SELECT cron.unschedule('cleanup-expired-guest-data');

-- 
-- OPTION 2: Manual Cleanup (if pg_cron is not available)
-- 
-- Run this manually in Supabase SQL Editor when needed:
-- SELECT cleanup_expired_guest_data();
-- 
-- You can also set up an external cron job (GitHub Actions, Vercel Cron, etc.)
-- that calls this function via Supabase API or Edge Function.
-- 
-- OPTION 3: Supabase Edge Function + External Cron
-- 
-- Create a Supabase Edge Function that calls:
-- supabase.rpc('cleanup_expired_guest_data')
-- Then schedule it via external service (Vercel Cron, GitHub Actions, etc.)

