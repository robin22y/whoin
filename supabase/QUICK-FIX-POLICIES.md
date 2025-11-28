# Quick Fix: Storage Policy Error

## Error Message
```
new row violates row-level security policy
```

This means the storage policy isn't set up correctly or doesn't exist.

## Immediate Fix

### Step 1: Verify You're Logged In
Make sure you're authenticated in your app before trying to upload.

### Step 2: Create the INSERT Policy

1. Go to **Supabase Dashboard** → **Storage** → **Policies** tab
2. Find the **"BANNERS"** bucket section
3. Click **"New policy"**
4. Fill in exactly:

   **Policy Template:**
   - **Policy name**: `Authenticated users can upload to banners`
   - **Allowed operation**: `INSERT` (select from dropdown)
   - **Target roles**: `authenticated` (select from dropdown - NOT "anon" or "public")
   - **USING expression**: Leave empty or use: `bucket_id = 'banners'`
   - **WITH CHECK expression**: `bucket_id = 'banners'` ⚠️ **This is critical!**

5. Click **"Save"**

### Step 3: Verify Policy Created

You should now see a policy in the list:
- Name: "Authenticated users can upload to banners"
- Command: INSERT
- Applied to: authenticated

### Step 4: Test Upload

Try uploading an image again. It should work now!

## If Still Not Working

### Check Policy Expression

The **WITH CHECK** expression is the most important part. It must be:
```sql
bucket_id = 'banners'
```

### Alternative: Use Policy Template

In Supabase, you can also use the "Policy Templates" option:
1. Click "New policy"
2. Select "Policy template" tab
3. Choose "Allow authenticated users to upload files"
4. Set bucket to "banners"
5. Save

## Complete Policy Setup

For full functionality, you also need:

1. **UPDATE policy** (for editing images):
   - Operation: UPDATE
   - Role: authenticated
   - USING: `bucket_id = 'banners'`

2. **DELETE policy** (for removing images):
   - Operation: DELETE
   - Role: authenticated
   - USING: `bucket_id = 'banners'`

But the INSERT policy is the critical one for uploads to work.



