# Storage Policies Setup for Banners Bucket

Based on your current setup, you have:
- ✅ Bucket "banners" created
- ✅ Public bucket enabled
- ✅ MIME type restriction: `image/*`
- ⚠️ Only one policy exists (for anonymous uploads)

## Required Policies

You need to create **3 additional policies** for authenticated users. Here's how:

### Step 1: Go to Storage Policies

1. In Supabase Dashboard, go to **Storage** → **Policies** tab
2. You should see the "BANNERS" bucket section
3. Click **"New policy"** button

### Step 2: Create Policy 1 - Authenticated Uploads

**Policy Configuration:**
- **Policy name**: `Authenticated users can upload to banners`
- **Allowed operation**: Select **"INSERT"**
- **Target roles**: Select **"authenticated"** (not "anon")
- **USING expression**: `bucket_id = 'banners'`
- **WITH CHECK expression**: `bucket_id = 'banners'`
- Click **"Save"**

### Step 3: Create Policy 2 - Authenticated Updates

**Policy Configuration:**
- **Policy name**: `Authenticated users can update banners`
- **Allowed operation**: Select **"UPDATE"**
- **Target roles**: Select **"authenticated"**
- **USING expression**: `bucket_id = 'banners'`
- Click **"Save"**

### Step 4: Create Policy 3 - Authenticated Deletes

**Policy Configuration:**
- **Policy name**: `Authenticated users can delete banners`
- **Allowed operation**: Select **"DELETE"**
- **Target roles**: Select **"authenticated"**
- **USING expression**: `bucket_id = 'banners'`
- Click **"Save"**

## Optional: Remove Anonymous Upload Policy

Your current policy "Allow Public Uploads 1tghu4n_0" allows anonymous users to upload. If you want to restrict uploads to authenticated users only:

1. Click the **three dots (⋮)** next to the policy
2. Click **"Delete"**
3. Confirm deletion

This is recommended for security - only logged-in users should be able to upload images.

## Final Policy Summary

After setup, you should have:

1. ✅ **Authenticated users can upload to banners** (INSERT, authenticated)
2. ✅ **Authenticated users can update banners** (UPDATE, authenticated)
3. ✅ **Authenticated users can delete banners** (DELETE, authenticated)
4. ✅ Public bucket setting = Public read access (no SELECT policy needed)

## Testing

After creating these policies:
1. Make sure you're logged in to your app
2. Try uploading an image in the event creation form
3. It should work now! ✅



