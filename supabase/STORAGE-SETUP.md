# Storage Bucket Setup Guide

This guide will help you set up the `banners` storage bucket for image uploads.

## Quick Setup (2 Steps)

### Step 1: Create the Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Configure the bucket:
   - **Name**: `banners` (must be exactly this)
   - **Public bucket**: ✅ **YES** (check this box - this is important!)
   - **File size limit**: `10MB` (optional, recommended)
   - **Allowed MIME types**: `image/*` (optional, recommended)
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies (via Dashboard UI)

Since storage policies require special permissions, they must be set up through the Dashboard UI:

1. In **Storage**, click on the **"banners"** bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New Policy"** and create these 4 policies:

#### Policy 1: Allow Authenticated Uploads
- **Policy name**: `Authenticated users can upload to banners`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'banners'`
- **WITH CHECK expression**: `bucket_id = 'banners'`
- Click **"Save"**

#### Policy 2: Allow Authenticated Updates
- **Policy name**: `Authenticated users can update banners`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'banners'`
- Click **"Save"**

#### Policy 3: Allow Authenticated Deletes
- **Policy name**: `Authenticated users can delete banners`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'banners'`
- Click **"Save"**

#### Policy 4: Allow Public Viewing (if bucket is not public)
- **Policy name**: `Public can view banners`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'banners'`
- Click **"Save"**

> **Note**: If you made the bucket **Public** in Step 1, Policy 4 is optional (public access is already enabled). However, it's still recommended to add it explicitly.

## What These Policies Do

The storage policies enable:

- ✅ **Authenticated users** can upload images
- ✅ **Authenticated users** can update/delete their uploads
- ✅ **Public** can view/download images (for displaying on event pages)

## Troubleshooting

### Error: "Storage bucket 'banners' does not exist"

**Solution**: Make sure you completed Step 1 above. The bucket must be created in the Dashboard before running the SQL script.

### Error: "Permission denied" when uploading

**Solution**: 
1. Make sure you created all 4 policies in Step 2
2. Check that the bucket is set to **Public**
3. Verify you're logged in as an authenticated user
4. Check the browser console for detailed error messages
5. Verify the policy expressions are exactly: `bucket_id = 'banners'`

### Images not displaying after upload

**Solution**:
1. Verify the bucket is **Public**
2. Check that the "Public can view banners" policy was created
3. Ensure `next.config.ts` has the Supabase storage domain in `images.remotePatterns`

## Testing

After setup, try uploading an image in the event creation form. You should see:
- ✅ Image preview appears
- ✅ No error messages
- ✅ Image displays on the event page

If you encounter issues, check the browser console for detailed error messages.

