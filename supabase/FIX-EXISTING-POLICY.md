# Fix Existing Storage Policy

## Error: Policy Already Exists

If you see: `policy "Authenticated users can upload to banners 1tghu4n_0" for table "objects" already exists`

This means you already created a policy, but it might not be configured correctly.

## Solution: Edit the Existing Policy

### Step 1: Find the Existing Policy

1. Go to **Supabase Dashboard** → **Storage** → **Policies** tab
2. In the **BANNERS** section, you should see your existing policy
3. Look for a policy with name like "Authenticated users can upload to banners 1tghu4n_0"

### Step 2: Check the Policy Configuration

Click on the policy (or the three dots ⋮ menu → Edit) and verify:

**Required Settings:**
- ✅ **Allowed operation**: Should be `INSERT`
- ✅ **Target roles**: Should be `authenticated` (NOT "anon" or "public")
- ✅ **WITH CHECK expression**: Must be `bucket_id = 'banners'` ⚠️ **This is critical!**

### Step 3: Fix if Needed

If the policy is missing the **WITH CHECK expression** or has wrong settings:

1. Click the **⋮** (three dots) next to the policy
2. Click **"Edit"** or **"Delete"** (if you want to recreate it)
3. If editing, add/update:
   - **WITH CHECK expression**: `bucket_id = 'banners'`
   - **Target roles**: `authenticated`
4. Click **"Save"**

### Step 4: Delete and Recreate (Alternative)

If editing doesn't work:

1. Click **⋮** → **"Delete"** on the existing policy
2. Wait a moment for it to be removed
3. Click **"New policy"** again
4. Create with these exact settings:
   - **Policy name**: `Authenticated users can upload to banners`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: (leave empty or `bucket_id = 'banners'`)
   - **WITH CHECK expression**: `bucket_id = 'banners'` ⚠️ **Required!**
5. Click **"Save"**

## Verify Policy is Correct

After fixing, your policy should show:
- **NAME**: "Authenticated users can upload to banners" (or similar)
- **COMMAND**: INSERT
- **APPLIED TO**: authenticated

## Test Upload

Try uploading an image again. If you still get the RLS error, the WITH CHECK expression might be missing or incorrect.

## Common Issues

### Issue 1: Policy exists but upload still fails
- **Cause**: Missing or incorrect WITH CHECK expression
- **Fix**: Edit policy and add `bucket_id = 'banners'` to WITH CHECK

### Issue 2: Policy is for "anon" instead of "authenticated"
- **Cause**: Wrong target role selected
- **Fix**: Delete and recreate with "authenticated" role

### Issue 3: Multiple duplicate policies
- **Cause**: Created policy multiple times
- **Fix**: Delete all duplicates, keep only one with correct settings

