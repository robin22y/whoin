-- Storage Bucket Setup for Banner Images
-- 
-- IMPORTANT: Storage policies must be set up via the Supabase Dashboard UI
-- This script only verifies the bucket exists and provides setup instructions
--
-- STEP 1: Create the storage bucket in Supabase Dashboard:
--   1. Go to Supabase Dashboard → Storage
--   2. Click "New bucket"
--   3. Name: "banners"
--   4. Public bucket: YES (checked)
--   5. File size limit: 10MB (optional)
--   6. Allowed MIME types: image/* (optional)
--   7. Click "Create bucket"
--
-- STEP 2: Set up Storage Policies via Dashboard:
--   1. Go to Storage → Policies (or click on "banners" bucket → Policies tab)
--   2. Click "New Policy"
--   3. Create these 4 policies (see STORAGE-SETUP.md for detailed instructions):
--
--      Policy 1: "Authenticated users can upload"
--        - Policy name: "Authenticated users can upload to banners"
--        - Allowed operation: INSERT
--        - Target roles: authenticated
--        - USING expression: bucket_id = 'banners'
--        - WITH CHECK expression: bucket_id = 'banners'
--
--      Policy 2: "Authenticated users can update"
--        - Policy name: "Authenticated users can update banners"
--        - Allowed operation: UPDATE
--        - Target roles: authenticated
--        - USING expression: bucket_id = 'banners'
--
--      Policy 3: "Authenticated users can delete"
--        - Policy name: "Authenticated users can delete banners"
--        - Allowed operation: DELETE
--        - Target roles: authenticated
--        - USING expression: bucket_id = 'banners'
--
--      Policy 4: "Public can view"
--        - Policy name: "Public can view banners"
--        - Allowed operation: SELECT
--        - Target roles: public
--        - USING expression: bucket_id = 'banners'
--
-- OR use the simpler approach: Make the bucket PUBLIC and it will allow public reads automatically
-- Then you only need policies 1-3 for authenticated uploads

-- Verify the bucket exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'banners'
  ) THEN
    RAISE NOTICE '⚠️  Storage bucket "banners" does not exist yet.';
    RAISE NOTICE 'Please create it in the Supabase Dashboard:';
    RAISE NOTICE '  1. Go to Storage → New Bucket';
    RAISE NOTICE '  2. Name: "banners"';
    RAISE NOTICE '  3. Public: YES';
    RAISE NOTICE '  4. Then set up policies via Dashboard UI (see STORAGE-SETUP.md)';
  ELSE
    RAISE NOTICE '✅ Storage bucket "banners" exists.';
    RAISE NOTICE '⚠️  Remember to set up storage policies via Dashboard UI:';
    RAISE NOTICE '   Go to Storage → Policies → Create policies for "banners" bucket';
    RAISE NOTICE '   See STORAGE-SETUP.md for detailed policy setup instructions.';
  END IF;
END $$;

